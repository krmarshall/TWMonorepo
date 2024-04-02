import { workerData } from 'worker_threads';
import { ensureDirSync, readJSONSync } from 'fs-extra';
import { VanillaWorkerDataInterface } from '../@types/WorkerDataInterfaces';
import initializeGlobalData from '../utils/initializeGlobalData';
import csvParse from '../csvParse';
import generateTables from '../generateTables';
import processFactions from '../processTables/processFactions';
import { modPackInfo, vanillaPackInfo } from '../lists/packInfo';
import Extractor from '../extractor';
import { SchemaInterface } from '../@types/SchemaInterfaces';

const { folder, dbPackName, locPackName, dbList, locList, game }: VanillaWorkerDataInterface = workerData;

const dbPackPath = `${process.env.WH2_DATA_PATH}/${dbPackName}`;
const locPackPath = `${process.env.WH2_DATA_PATH}/${locPackName}`;
const imagePackPaths = [`${process.env.WH2_DATA_PATH}/${vanillaPackInfo.vanilla2.imgs[0]}`];
const schemaPath = `${process.env.SCHEMAS_PATH as string}/schema_wh2`;
const schema: SchemaInterface = readJSONSync(`${schemaPath}.json`);

console.time(folder);

const globalData = initializeGlobalData([...Object.keys(vanillaPackInfo), ...Object.keys(modPackInfo)]);

ensureDirSync(`./extracted_files/${folder}/`);
const extractor = new Extractor({
  folder,
  game,
  rpfmPath: process.env.RPFM_PATH as string,
  schemaPath: schemaPath,
  nconvertPath: process.env.NCONVERT_PATH as string,
  globalData,
});
extractor
  .extractPackfile(dbPackPath, locPackPath, dbList, locList, false)
  .then(() => extractor.parseImages(imagePackPaths, true))
  .then(() => {
    csvParse(folder, false, globalData);
    const tables = generateTables(folder, globalData, dbList, schema);
    processFactions(folder, globalData, tables, false, true);
    console.timeEnd(folder);
  })
  .catch((error) => {
    throw error;
  });
