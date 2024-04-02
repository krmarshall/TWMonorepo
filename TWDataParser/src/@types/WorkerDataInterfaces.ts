import { ModInfoInterface } from '../lists/packInfo';
import { GlobalDataInterface, RefKey } from './GlobalDataInterface';
import { SchemaInterface } from './SchemaInterfaces';

export interface VanillaWorkerDataInterface {
  folder: string;
  dbPackName: string;
  locPackName: string;
  dbList: Array<RefKey>;
  locList: Array<string>;
  game: string;
}

export interface ModWorkerDataInterface {
  folder: string;
  globalData: GlobalDataInterface;
  modInfo: ModInfoInterface;
  dbList: Array<RefKey>;
  locList?: Array<string>;
  game: string;
  schemaPath: string;
  schema: SchemaInterface;
  pruneVanilla: boolean;
  tech: boolean;
}

export interface MultiModWorkerDataInterface {
  folder: string;
  globalData: GlobalDataInterface;
  modInfoArray: Array<ModInfoInterface>;
  dbList: Array<RefKey>;
  locList?: Array<string>;
  game: string;
  schemaPath: string;
  schema: SchemaInterface;
  pruneVanilla: boolean;
  tech: boolean;
}
