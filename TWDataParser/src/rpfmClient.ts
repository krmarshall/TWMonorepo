import * as CustomRpfmTypes from './@types/CustomRpfmTypes.ts';
import type {
  Command,
  ContainerInfo,
  ContainerPath,
  DataSource,
  DB,
  Definition,
  Field,
  Loc,
  Message,
  RFileInfo,
} from './@types/rpfm_ipc_protocol.ts';

export default class RpfmClient {
  private ws: WebSocket;
  private nextId = 1;
  private pending = new Map<
    number,
    {
      resolve: (resp: unknown) => void;
      reject: (err: Error) => void;
      callStack: string;
      command: string;
    }
  >();
  public sessionId: number | null = null;

  constructor() {}

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws !== undefined) {
        console.error('WS Already Initialized');
        return reject();
      }
      this.ws = new WebSocket(process.env.RPFM_SERVER_URL) as unknown as WebSocket;
      this.ws.onmessage = (event) => {
        const msg: Message<unknown> = JSON.parse(event.data);

        // Handle SessionConnected (unsolicited, id=0)
        if (typeof msg.data === 'object' && 'SessionConnected' in msg.data) {
          this.sessionId = msg.data.SessionConnected as number;
          return resolve();
        }

        const handler = this.pending.get(msg.id);
        if (handler) {
          this.pending.delete(msg.id);
          if (typeof msg.data === 'object' && 'Error' in msg.data) {
            handler.reject(
              new Error(`${msg.data.Error as string}\nCommand: ${handler.command}\nCall Stack: ${handler.callStack}`),
            );
          } else {
            handler.resolve(msg.data);
          }
        }
      };
    });
  }

  send(command: Command): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const id = this.nextId++;
      const callStack = new Error().stack;
      const commandString = JSON.stringify(command);
      this.pending.set(id, { resolve, reject, callStack, command: commandString });
      this.ws.send(JSON.stringify({ id, data: command }));
    });
  }

  async disconnect(): Promise<void> {
    await this.send('ClientDisconnecting');
    this.ws.close();
  }

  async updateSchemas(): Promise<string> {
    const checkResp: { APIResponseGit?: 'NewUpdate' | 'NoUpdate' } = await this.send('CheckSchemaUpdates');
    if (checkResp.APIResponseGit !== 'NewUpdate') {
      return 'No Schema Update';
    }

    const updateResp: string | { Error?: string } = await this.send('UpdateSchemas');
    if (updateResp.Error !== undefined) {
      return updateResp.Error;
    } else {
      return 'Schema Updated';
    }
  }

  async setGame(gameKey: string, rebuildDeps: boolean): Promise<unknown> {
    const resp = (await this.send({ SetGameSelected: [gameKey, rebuildDeps] })) as
      | { CompressionFormatDependenciesInfo: Array<unknown> }
      | { Error: string };
    if ('Error' in resp) {
      throw resp.Error;
    }
    return resp;
  }

  async openPacks(paths: string[]): Promise<ContainerInfo> {
    const resp = (await this.send({ OpenPackFiles: paths })) as { ContainerInfo: ContainerInfo };
    return resp.ContainerInfo;
  }

  async extractFiles(
    paths: Partial<Record<DataSource, ContainerPath[]>>,
    destPath: string,
    asTsv = false,
  ): Promise<[string, string[]]> {
    // @ts-expect-error ts(2322) Dont need to fill out every datasource, can just send the datasources we actually want files from
    const resp = (await this.send({ ExtractPackedFiles: [paths, destPath, asTsv] })) as {
      StringVecPathBuf: [string, string[]];
    };
    return resp.StringVecPathBuf;
  }

  async decodeFile(path: string) {
    const resp = await this.send({ DecodePackedFile: [path, 'PackFile'] });
    return resp;
  }

  async getTablePathsByTableName(tableName: string) {
    if (!tableName.endsWith('_tables')) {
      tableName += '_tables';
    }
    const resp = (await this.send({ GetTablesByTableName: tableName })) as { VecString: Array<string> };
    return resp.VecString;
  }

  async decodeDbTable(tablePath: string) {
    const resp = (await this.decodeFile(tablePath)) as { DBRFileInfo: [DB, RFileInfo] };
    return resp.DBRFileInfo[0].table;
  }

  async getTableDefinition(tableName: string): Promise<Definition> {
    if (!tableName.endsWith('_tables')) {
      tableName += '_tables';
    }
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

  async getLocPaths() {
    type LocPathsResp = {
      HashMapDataSourceHashSetContainerPath: Record<DataSource, Array<ContainerPath>>;
    };
    const resp = await this.send({ GetPackedFilesNamesStartingWitPathFromAllSources: { Folder: 'text/' } });
    const paths = (resp as LocPathsResp).HashMapDataSourceHashSetContainerPath.PackFile.map((path) => {
      if ('File' in path) return path.File;
    });
    return paths;
  }

  async decodeLoc(locPath: string) {
    const resp = (await this.decodeFile(locPath)) as { LocRFileInfo: [Loc, RFileInfo] };
    return resp.LocRFileInfo[0].table;
  }

  async decodePortraitBin(binPath: string) {
    const resp = (await this.decodeFile(binPath)) as {
      PortraitSettingsRFileInfo: [CustomRpfmTypes.PortraitSettings, RFileInfo];
    };
    return resp.PortraitSettingsRFileInfo[0];
  }

  async getProcessedDefinition(definition: Definition) {
    const resp = (await this.send({ FieldsProcessed: definition })) as { VecField: Array<Field> };
    return resp.VecField;
  }
}
