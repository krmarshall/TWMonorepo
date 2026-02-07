import { workerData } from 'worker_threads';
import { ensureDirSync } from 'fs-extra/esm';
import type { VanillaWorkerDataInterface } from '../@types/WorkerDataInterfaces.ts';
import Extractor from '../extractor.ts';
import initializeGlobalData from '../utils/initializeGlobalData.ts';
import akData from '../akData.ts';
import generateTables from '../generateTables.ts';
import processFactions from '../processTables/processFactions.ts';
import { workerMod, workerModMulti } from './workerExports.ts';
import { modPackInfo, vanillaPackInfo } from '../lists/packInfo.ts';
import { v3AssKitList } from '../lists/extractLists/dbLists.ts';
import type { RefKey } from '../@types/GlobalDataInterface.ts';
import RpfmClient from '../rpfmClient.ts';
import { parser } from '../parser.ts';

const { folder, packs, dbList, game }: VanillaWorkerDataInterface = workerData;

const packPaths = packs.map((pack) => `${process.env.WH3_DATA_PATH}/${pack}.pack`);

console.time(folder);

const globalData = initializeGlobalData([...Object.keys(vanillaPackInfo), ...Object.keys(modPackInfo)]);
// Just collapse this so its out of the way
const modData = {
  // Unpruned Mods
  radiousWorkerData: {
    folder: 'radious3',
    dbList,
    game: 'warhammer_3',
    globalData,
    modInfoArray: modPackInfo.radious3,
    pruneVanilla: false,
    tech: true,
  },

  sfoWorkerData: {
    folder: 'sfo3',
    dbList,
    game: 'warhammer_3',
    globalData,
    modInfo: modPackInfo.sfo3[0],
    pruneVanilla: false,
    tech: true,
  },

  // crysWorkerData: {
  //   folder: 'crys3',
  //   dbList,
  //   game: 'warhammer_3',
  //   globalData,
  //   modInfo: modPackInfo.crys3[0],
  //   pruneVanilla: false,
  //   tech: false,
  // },

  // Pruned Mods
  mixuWorkerData: {
    folder: 'mixu3',
    dbList,
    game: 'warhammer_3',
    globalData,
    modInfoArray: modPackInfo.mixu3,
    pruneVanilla: true,
    tech: false,
  },

  legeWorkerData: {
    folder: 'lege3',
    dbList,
    game: 'warhammer_3',
    globalData,
    modInfo: modPackInfo.lege3[0],
    pruneVanilla: true,
    tech: false,
  },

  scmWorkerData: {
    folder: 'scm3',
    dbList,
    game: 'warhammer_3',
    globalData,
    modInfoArray: modPackInfo.scm3,
    pruneVanilla: true,
    tech: false,
  },

  cat3WorkerData: {
    folder: 'cat3',
    dbList,
    game: 'warhammer_3',
    globalData,
    modInfoArray: modPackInfo.cat3,
    pruneVanilla: true,
    tech: false,
  },

  ovn3WorkerData: {
    folder: 'ovn3',
    dbList,
    game: 'warhammer_3',
    globalData,
    modInfoArray: modPackInfo.ovn3,
    pruneVanilla: true,
    tech: false,
  },

  hol3WorkerData: {
    folder: 'hol3',
    dbList,
    game: 'warhammer_3',
    globalData,
    modInfoArray: modPackInfo.hol3,
    pruneVanilla: true,
    tech: false,
  },
};

ensureDirSync(`./extracted_files/${folder}/`);

const rpfmClient = new RpfmClient();
await rpfmClient.init();
await rpfmClient.setGame(game, true);
await rpfmClient.openPacks(packPaths);

await parser(folder, globalData, rpfmClient, dbList);

const extractor = new Extractor({
  folder,
  globalData,
  packPaths,
  nconvertPath: process.env.NCONVERT_PATH as string,
  rpfmClient,
});
await extractor.extractAndParseImages();

akData(folder, globalData, process.env.WH3_DATA_PATH as string);

// Unpruned Mods
workerModMulti(modData.radiousWorkerData);
workerMod(modData.sfoWorkerData);
// workerMod(crysWorkerData);
// Pruned Mods
workerModMulti(modData.mixuWorkerData);
workerMod(modData.legeWorkerData);
workerModMulti(modData.scmWorkerData);
workerModMulti(modData.cat3WorkerData);
workerModMulti(modData.ovn3WorkerData);
workerModMulti(modData.hol3WorkerData);

dbList.push(...(v3AssKitList as Array<RefKey>));
const tables = await generateTables(folder, globalData, dbList, rpfmClient);
processFactions(folder, globalData, tables, false, true);

console.timeEnd(folder);
rpfmClient.disconnect();
