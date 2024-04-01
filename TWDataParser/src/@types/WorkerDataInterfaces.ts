import { ModInfoInterface } from '../lists/packInfo';
import { GlobalDataInterface, RefKey } from './GlobalDataInterface';
import { SchemaInterface } from './SchemaInterfaces';

interface WorkerDataInterface {
  folder: string;
  globalData?: GlobalDataInterface;
  dbPackName?: string;
  dbPackNames?: Array<string>;
  locPackName?: string;
  locPackNames?: Array<string>;
  dbList: Array<RefKey>;
  locList?: Array<string>;
  game: string;
  tech: boolean;
  schema: SchemaInterface;
  pruneVanilla: boolean;
  packNameData?: Array<ModInfoInterface>;
}

export { WorkerDataInterface };
