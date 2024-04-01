import { workerData } from 'worker_threads';
import { ensureDirSync } from 'fs-extra';
import { WorkerDataInterface } from '../@types/WorkerDataInterfaces';
import parseImages from '../parseImages';
import { extractPackfileMass } from '../extractTables';
import initializeGlobalData from '../utils/initializeGlobalData';
import csvParse from '../csvParse';
import akData from '../akData';
import generateTables from '../generateTables';
import processFactions from '../processTables/processFactions';
import { workerMod, workerModMulti } from './workerExports';
import { modPackInfo, vanillaPackInfo } from '../lists/packInfo';

const { folder, dbPackName, locPackName, dbList, locList, game, schema, tech, pruneVanilla }: WorkerDataInterface = workerData;

const imagePacknames = vanillaPackInfo.vanilla3.imgs;

console.time(folder);

const globalData = initializeGlobalData([...Object.keys(vanillaPackInfo), ...Object.keys(modPackInfo)]);

ensureDirSync(`./extracted_files/${folder}/`);
extractPackfileMass(folder, dbPackName as string, locPackName as string, dbList, locList, game)
  .then(() => parseImages(folder, imagePacknames, game, tech, globalData))
  .then(() => {
    csvParse(folder, false, globalData);
    akData(folder, globalData);

    // Unpruned Mods
    workerModMulti(radiousWorkerData);
    workerMod(sfoWorkerData);
    workerMod(crysWorkerData);
    // Pruned Mods
    workerModMulti(mixuWorkerData);
    workerMod(legeWorkerData);
    workerModMulti(scmWorkerData);
    workerModMulti(cat3WorkerData);
    workerModMulti(ovn3WorkerData);
    workerModMulti(hol3WorkerData);

    // AK Tables we dont extract with rpfm, but have schemas for now, only want in vanilla3 unless I add mod startpos
    dbList.push('start_pos_characters', 'start_pos_character_traits');
    const tables = generateTables(folder, globalData, dbList, schema);
    processFactions(folder, globalData, tables, pruneVanilla, tech);
  })
  .then(() => {
    console.timeEnd(folder);
  })
  .catch((error) => {
    throw error;
  });

// Unpruned Mods
const radiousWorkerData = {
  globalData: globalData,
  folder: 'radious3',
  dbPackNames: modPackInfo.getMultiPacks('radious3'),
  locPackNames: modPackInfo.getMultiPacks('radious3'),
  dbList: dbList,
  locList: undefined,
  game: 'warhammer_3',
  schema: schema,
  pruneVanilla: false,
  tech: true,
  packNameEnum: undefined,
};

const sfoWorkerData = {
  globalData: globalData,
  folder: 'sfo3',
  dbPackName: modPackInfo.getSinglePack('sfo3'),
  locPackName: modPackInfo.getSinglePack('sfo3'),
  dbList: dbList,
  locList: undefined,
  game: 'warhammer_3',
  schema: schema,
  pruneVanilla: false,
  tech: true,
  packNameEnum: undefined,
};

const crysWorkerData = {
  globalData: globalData,
  folder: 'crys3',
  dbPackName: modPackInfo.getSinglePack('crys3'),
  locPackName: modPackInfo.getSinglePack('crys3'),
  dbList: dbList,
  locList: undefined,
  game: 'warhammer_3',
  schema: schema,
  pruneVanilla: false,
  tech: false,
  packNameEnum: undefined,
};

// Pruned Mods
const mixuWorkerData = {
  globalData: globalData,
  folder: 'mixu3',
  dbPackNames: modPackInfo.getMultiPacks('mixu3'),
  locPackNames: modPackInfo.getMultiPacks('mixu3'),
  dbList: dbList,
  locList: undefined,
  game: 'warhammer_3',
  schema: schema,
  pruneVanilla: true,
  tech: false,
  packNameEnum: modPackInfo['mixu3'],
};

const legeWorkerData = {
  globalData: globalData,
  folder: 'lege3',
  dbPackName: modPackInfo.getSinglePack('lege3'),
  locPackName: modPackInfo.getSinglePack('lege3'),
  dbList: dbList,
  locList: undefined,
  game: 'warhammer_3',
  schema: schema,
  pruneVanilla: true,
  tech: false,
  packNameEnum: undefined,
};

const scmWorkerData = {
  globalData: globalData,
  folder: 'scm3',
  dbPackNames: modPackInfo.getMultiPacks('scm3'),
  locPackNames: modPackInfo.getMultiPacks('scm3'),
  dbList: dbList,
  locList: undefined,
  game: 'warhammer_3',
  schema: schema,
  pruneVanilla: true,
  tech: false,
  packNameEnum: modPackInfo['scm3'],
};

const cat3WorkerData = {
  globalData: globalData,
  folder: 'cat3',
  dbPackNames: modPackInfo.getMultiPacks('cat3'),
  locPackNames: modPackInfo.getMultiPacks('cat3'),
  dbList: dbList,
  locList: undefined,
  game: 'warhammer_3',
  schema: schema,
  pruneVanilla: true,
  tech: false,
  packNameEnum: modPackInfo['cat3'],
};

const ovn3WorkerData = {
  globalData: globalData,
  folder: 'ovn3',
  dbPackNames: modPackInfo.getMultiPacks('ovn3'),
  locPackNames: modPackInfo.getMultiPacks('ovn3'),
  dbList: dbList,
  locList: undefined,
  game: 'warhammer_3',
  schema: schema,
  pruneVanilla: true,
  tech: false,
  packNameEnum: modPackInfo['ovn3'],
};

const hol3WorkerData = {
  globalData: globalData,
  folder: 'hol3',
  dbPackNames: modPackInfo.getMultiPacks('hol3'),
  locPackNames: modPackInfo.getMultiPacks('hol3'),
  dbList: dbList,
  locList: undefined,
  game: 'warhammer_3',
  schema: schema,
  pruneVanilla: true,
  tech: false,
  packNameEnum: undefined,
};
