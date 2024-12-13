import { workerData } from 'worker_threads';
import { ensureDirSync, readJSONSync } from 'fs-extra';
import { VanillaWorkerDataInterface } from '../@types/WorkerDataInterfaces';
import Extractor from '../extractor';
import initializeGlobalData from '../utils/initializeGlobalData';
import csvParse from '../csvParse';
import akData from '../akData';
import generateTables from '../generateTables';
import processFactions from '../processTables/processFactions';
import { workerMod, workerModMulti } from './workerExports';
import { modPackInfo, vanillaPackInfo } from '../lists/packInfo';
import { v3AssKitList } from '../lists/extractLists/vanilla3';
import { RefKey } from '../@types/GlobalDataInterface';
import { SchemaInterface } from '../@types/SchemaInterfaces';

const { folder, dbPackName, locPackName, dbList, locList, game }: VanillaWorkerDataInterface = workerData;

const dbPackPath = `${process.env.WH3_DATA_PATH}/${dbPackName}`;
const locPackPath = `${process.env.WH3_DATA_PATH}/${locPackName}`;
const imagePackPaths = vanillaPackInfo.vanilla3.imgs.map(
  (imgPackName) => `${process.env.WH3_DATA_PATH}/${imgPackName}`,
);
const schemaPath = `${process.env.SCHEMAS_PATH as string}/schema_wh3`;
const schema: SchemaInterface = readJSONSync(`${schemaPath}.json`);

console.time(folder);

const globalData = initializeGlobalData([...Object.keys(vanillaPackInfo), ...Object.keys(modPackInfo)]);

ensureDirSync(`./extracted_files/${folder}/`);
const extractor = new Extractor({
  folder,
  game,
  rpfmPath: process.env.RPFM_PATH as string,
  schemaPath,
  nconvertPath: process.env.NCONVERT_PATH as string,
  globalData,
});
extractor
  .extractPackfile(dbPackPath, locPackPath, dbList, locList, false)
  .then(() => extractor.parseImages(imagePackPaths, true))
  .then(() => {
    csvParse(folder, false, globalData);
    akData(folder, globalData, process.env.WH3_DATA_PATH as string);

    // Unpruned Mods
    workerModMulti(radiousWorkerData);
    // workerMod(sfoWorkerData);
    workerMod(crysWorkerData);
    // Pruned Mods
    workerModMulti(mixuWorkerData);
    workerMod(legeWorkerData);
    workerModMulti(scmWorkerData);
    workerModMulti(cat3WorkerData);
    workerModMulti(ovn3WorkerData);
    workerModMulti(hol3WorkerData);

    dbList.push(...(v3AssKitList as Array<RefKey>));
    const tables = generateTables(folder, globalData, dbList, schema);
    processFactions(folder, globalData, tables, false, true);

    console.timeEnd(folder);
  })
  .catch((error) => {
    throw error;
  });

// Unpruned Mods
const radiousWorkerData = {
  globalData,
  folder: 'radious3',
  modInfoArray: modPackInfo.radious3,
  dbList,
  locList: undefined,
  game: 'warhammer_3',
  schemaPath,
  schema,
  pruneVanilla: false,
  tech: true,
};

const sfoWorkerData = {
  globalData,
  folder: 'sfo3',
  modInfo: modPackInfo.sfo3[0],
  dbList,
  locList: undefined,
  game: 'warhammer_3',
  schemaPath,
  schema,
  pruneVanilla: false,
  tech: true,
};

const crysWorkerData = {
  globalData,
  folder: 'crys3',
  modInfo: modPackInfo.crys3[0],
  dbList,
  locList: undefined,
  game: 'warhammer_3',
  schemaPath,
  schema,
  pruneVanilla: false,
  tech: false,
};

// Pruned Mods
const mixuWorkerData = {
  globalData,
  folder: 'mixu3',
  modInfoArray: modPackInfo.mixu3,
  dbList,
  locList: undefined,
  game: 'warhammer_3',
  schemaPath,
  schema,
  pruneVanilla: true,
  tech: false,
};

const legeWorkerData = {
  globalData,
  folder: 'lege3',
  modInfo: modPackInfo.lege3[0],
  dbList,
  locList: undefined,
  game: 'warhammer_3',
  schemaPath,
  schema,
  pruneVanilla: true,
  tech: false,
};

const scmWorkerData = {
  globalData,
  folder: 'scm3',
  modInfoArray: modPackInfo.scm3,
  dbList,
  locList: undefined,
  game: 'warhammer_3',
  schemaPath,
  schema,
  pruneVanilla: true,
  tech: false,
};

const cat3WorkerData = {
  globalData,
  folder: 'cat3',
  modInfoArray: modPackInfo.cat3,
  dbList,
  locList: undefined,
  game: 'warhammer_3',
  schemaPath,
  schema,
  pruneVanilla: true,
  tech: false,
};

const ovn3WorkerData = {
  globalData,
  folder: 'ovn3',
  modInfoArray: modPackInfo.ovn3,
  dbList,
  locList: undefined,
  game: 'warhammer_3',
  schemaPath,
  schema,
  pruneVanilla: true,
  tech: false,
};

const hol3WorkerData = {
  globalData,
  folder: 'hol3',
  modInfoArray: modPackInfo.hol3,
  dbList,
  locList: undefined,
  game: 'warhammer_3',
  schemaPath,
  schema,
  pruneVanilla: true,
  tech: false,
};
