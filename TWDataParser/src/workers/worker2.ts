import { workerData } from 'worker_threads';
import { ensureDirSync } from 'fs-extra';
import { WorkerDataInterface } from '../@types/WorkerDataInterfaces';
import parseImages from '../parseImages';
import { extractPackfileMass } from '../extractTables';
import initializeGlobalData from '../utils/initializeGlobalData';
import csvParse from '../csvParse';
import generateTables from '../generateTables';
import processFactions from '../processTables/processFactions';
import { vanillaPackInfo } from '../lists/packInfo';

const { folder, dbPackName, locPackName, dbList, locList, game, schema, tech, pruneVanilla }: WorkerDataInterface = workerData;

const imagePacknames = vanillaPackInfo.vanilla2.imgs;

console.time(folder);

const globalData = initializeGlobalData(folder);

ensureDirSync(`./extracted_files/${folder}/`);
extractPackfileMass(folder, dbPackName as string, locPackName as string, dbList, locList, game)
  .then(() => parseImages(folder, imagePacknames, game, tech, globalData))
  .then(() => {
    csvParse(folder, false, globalData);
    const tables = generateTables(folder, globalData, dbList, schema);
    processFactions(folder, globalData, tables, pruneVanilla, tech);
  })
  .then(() => {
    console.timeEnd(folder);
  })
  .catch((error) => {
    throw error;
  });
