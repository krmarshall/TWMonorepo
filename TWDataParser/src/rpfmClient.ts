import type {
  Command,
  ContainerInfo,
  ContainerPath,
  DataSource,
  DB,
  Definition,
  Field,
  GitResponse,
  Loc,
  PortraitSettings,
  RFileInfo,
  TableInMemory,
} from './@types/rpfm_ipc_protocol.ts';

type FileTypes = 'DB' | 'Loc' | 'Text' | 'Image' | 'Rigidmodel' | 'PortraitSettings';

interface DecodedFile {
  file_type: FileTypes;
  contents: {
    data: {
      DB?: DB;
      Loc?: Loc;
      PortraitSettings?: PortraitSettings;
    };
    kind: 'decoded' | 'text' | 'raw' | string; // ? Guess from ipc src
  };
}

interface FileList {
  files: Array<{
    file_type: FileTypes;
    path: string;
  }>;
  folders: unknown;
  total: number;
}

interface PackSummary {
  key: string;
  name: string;
  path: string;
  pack_type: string;
  file_count: number;
}

interface SessionStatus {
  game: string;
  schema_loaded: boolean;
  packs: PackSummary[];
}

interface RpcError {
  code: number;
  message: string;
  data?: { kind: string; details?: string };
}

type JobStatus = { job: number; method: string } & (
  | { state: 'queued' }
  | { state: 'running'; stage?: string }
  | { state: 'finished'; result: any }
  | { state: 'failed'; error: RpcError }
  | { state: 'cancelled' }
);

class RpfmError extends Error {
  public error: RpcError;
  constructor(error: RpcError) {
    super(error.message);
    this.error = error;
  }

  get kind(): string | undefined {
    return this.error.data?.kind;
  }
}

export default class RpfmClient {
  private ws!: WebSocket;
  private nextId = 1;
  private pending = new Map<
    number,
    {
      resolve: (resp: any) => void;
      reject: (err: Error) => void;
      callStack: string;
      command: string;
    }
  >();
  public sessionId: number | null = null;
  private packKey!: string; // Server can handle multiple open packs, we only ever care about a single one.
  private definitionMap: Map<string, Definition> = new Map(); // Maps table name (unit_abilities) to the highest definition version used (42)

  /** Called with every `job.updated` notification, to show progress. */
  public onJobUpdated: (status: JobStatus) => void = () => {};

  constructor() {}

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws !== undefined) {
        console.error('WS Already Initialized');
        return reject();
      }
      this.ws = new WebSocket(process.env.RPFM_SERVER_URL as string);
      this.ws.onclose = () => {
        this.pending.values().forEach((pendingMessage) => pendingMessage.reject(new Error('Connection Closed')));
        this.pending.clear();
      };
      this.ws.onerror = () => reject(new Error('Connection to RPFM Server Failed'));

      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if ('id' in message) {
          const pending = this.pending.get(message.id);
          this.pending.delete(message.id);
          if (message.error) {
            console.error(`Command: ${pending?.command}\nCall Stack: ${pending?.callStack}`);
            pending?.reject(new RpfmError(message.error));
          } else {
            pending?.resolve(message.result);
          }
        } else if (message.method === 'session.connected') {
          this.sessionId = message.params.session_id;
          return resolve();
        } else if (message.method === 'job.updated') {
          this.onJobUpdated(message.params);
        }
      };
    });
  }

  call<T = any>(method: string, params?: object): Promise<T> {
    return new Promise((resolve, reject) => {
      const id = this.nextId++;
      const callStack = new Error().stack as string;
      const commandString = `${method} ${JSON.stringify(params)}`;
      this.pending.set(id, { resolve, reject, callStack, command: commandString });
      this.ws.send(JSON.stringify({ jsonrpc: '2.0', id, method, params }));
    });
  }

  async runJob(method: string, params?: object): Promise<any> {
    const { job } = await this.call<{ job: number }>(method, params);
    while (true) {
      const status = await this.call<JobStatus>('job.wait', { job, timeout_secs: 60 });
      switch (status.state) {
        case 'finished':
          return status.result;
        case 'failed':
          throw new RpfmError(status.error);
        case 'cancelled':
          throw new Error(`Job ${job} was cancelled`);
        case 'queued':
        case 'running':
          break;
      }
    }
  }

  async disconnect(): Promise<void> {
    await this.call('session.disconnect');
    this.ws.close();
  }

  async updateSchemas(): Promise<SessionStatus> {
    return this.runJob('schema.update');
  }

  async setGame(game: string, rebuild_dependencies: boolean): Promise<SessionStatus> {
    return this.runJob('session.set_game', { game, rebuild_dependencies });
  }

  async openPacks(paths: string[], lazy_loading: boolean = true): Promise<PackSummary> {
    const response = await this.call('pack.open', { paths, lazy_loading });
    this.packKey = response.key;
    return response;
  }

  async extractFiles(paths: string[], destination: string, as_tsv: boolean = false): Promise<PackSummary> {
    return this.call('files.extract', { source: { pack: this.packKey }, paths, destination, as_tsv });
  }

  async listFiles(path_prefix?: string, file_types?: Array<FileTypes>): Promise<Array<string>> {
    const resp: FileList = await this.call('files.list', {
      source: { pack: this.packKey },
      path_prefix,
      file_types: file_types,
      limit: Number.MAX_SAFE_INTEGER,
    });
    const paths = resp.files.map((file) => file.path);
    return paths;
  }

  async getTablePathsByTableName(tableName: string): Promise<Array<string>> {
    if (!tableName.endsWith('_tables')) {
      tableName += '_tables';
    }
    return this.listFiles(`db/${tableName}`, ['DB']);
  }

  async fileRead(filePath: string): Promise<DecodedFile> {
    return this.call('file.read', { file: { source: { pack: this.packKey }, path: filePath } });
  }

  async decodeDbTable(tablePath: string): Promise<TableInMemory> {
    const resp = await this.fileRead(tablePath);
    if (resp.contents.data.DB === undefined) {
      throw `Error decoding table: ${tablePath}`;
    }
    const respTable = resp.contents.data.DB.table;
    const respTableVersion = respTable?.definition.version;
    const tableName = respTable?.table_name;
    const storedTableVersion = this.definitionMap.get(tableName)?.version;

    if (storedTableVersion === undefined) {
      this.definitionMap.set(tableName, respTable.definition);
    } else if (storedTableVersion < respTableVersion) {
      this.definitionMap.set(tableName, respTable.definition);
    }

    return respTable;
  }

  async decodeLoc(locPath: string): Promise<TableInMemory> {
    const resp = await this.fileRead(locPath);
    if (resp.contents.data.Loc === undefined) {
      throw `Error decoding loc: ${locPath}`;
    }
    return resp.contents.data.Loc.table;
  }

  async decodePortraitBin(binPath: string): Promise<PortraitSettings> {
    const resp = await this.fileRead(binPath);
    if (resp.contents.data.PortraitSettings === undefined) {
      throw `Error decoding portrait bin: ${binPath}`;
    }
    return resp.contents.data.PortraitSettings;
  }

  async getTableDefinition(table_name: string) {
    if (!table_name.endsWith('_tables')) {
      table_name += '_tables';
    }
    // If we already decoded the table grab the definition from the map.
    const storedTable = this.definitionMap.get(table_name);
    if (storedTable !== undefined) {
      return storedTable;
    }
    // Else fallback to the highest version definition (not perfect, some vanilla tables have versions in schema, but use 0 z.z)
    const resp = await this.call('schema.definition', { table_name });
    return resp;
  }

  async getTableDefinitionOLD(tableName: string): Promise<Definition> {
    if (!tableName.endsWith('_tables')) {
      tableName += '_tables';
    }

    // If we already decoded the table grab the definition from the map.
    const storedTable = this.definitionMap.get(tableName);
    if (storedTable !== undefined) {
      return storedTable;
    }

    // Else fallback to the highest version definition (not perfect, some vanilla tables have versions in schema, but use 0 z.z)
    const resp = (await this.send({ DefinitionsByTableName: tableName })) as {
      VecDefinition: Array<Definition>;
    };
    if (resp.VecDefinition.length === 0) {
      throw `Table missing schema definitions: ${tableName}`;
    }

    let highestVersionIndex = 0;
    let highestVersion = resp.VecDefinition[0].version;
    resp.VecDefinition.forEach((definition, index) => {
      if (definition.version > highestVersion) {
        highestVersion = definition.version;
        highestVersionIndex = index;
      }
    });

    return resp.VecDefinition[highestVersionIndex];
  }

  async getProcessedDefinition(definition: Definition) {
    const resp = (await this.send({ FieldsProcessed: definition })) as { VecField: Array<Field> };
    return resp.VecField;
  }
}
