import type { ModInfoInterface } from '../lists/packInfo.ts';
import type { GlobalDataInterface, RefKey } from './GlobalDataInterface.ts';

export interface VanillaWorkerDataInterface {
  folder: string;
  packs: Array<string>;
  dbList: Array<RefKey>;
  game: string;
}

export interface ModWorkerDataInterface {
  folder: string;
  dbList: Array<RefKey>;
  game: string;
  globalData: GlobalDataInterface;
  modInfo: ModInfoInterface;
  pruneVanilla: boolean;
  tech: boolean;
}

export interface MultiModWorkerDataInterface {
  folder: string;
  dbList: Array<RefKey>;
  game: string;
  globalData: GlobalDataInterface;
  modInfoArray: Array<ModInfoInterface>;
  pruneVanilla: boolean;
  tech: boolean;
}
