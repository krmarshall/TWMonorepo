import type { Table } from '../generateTables.ts';
import type { ModInfoInterface } from '../lists/packInfo.ts';
import type { GlobalDataInterface, RefKey } from './GlobalDataInterface.ts';

export interface WorkerVanillaDataInterface {
  folder: string;
  packs: Array<string>;
  dbList: Array<RefKey>;
  game: string;
}

export interface WorkerModDataInterface {
  folder: string;
  dbList: Array<RefKey>;
  game: string;
  globalData: GlobalDataInterface;
  modInfo: ModInfoInterface;
  pruneVanilla: boolean;
  tech: boolean;
}

export interface WorkerMultiModDataInterface {
  folder: string;
  dbList: Array<RefKey>;
  game: string;
  globalData: GlobalDataInterface;
  modInfoArray: Array<ModInfoInterface>;
  pruneVanilla: boolean;
  tech: boolean;
}

export interface WorkerItemDataInterface {
  folder: string;
  globalData: GlobalDataInterface;
  tables: { [key in RefKey]?: Table };
  pruneVanilla: boolean;
}
