import { workerData } from 'worker_threads';
import { ensureDirSync } from 'fs-extra';
import { WorkerDataInterface } from '../interfaces/WorkerDataInterfaces';
import parseImages from '../parseImages';
import { extractPackfileMass } from '../extractTables';
import csvParse from '../csvParse';
import generateTables from '../generateTables';
import processFactions from '../processTables/processFactions';
import { mergeLocsIntoVanilla, mergeTablesIntoVanilla } from '../mergeTables';

const { folder, globalData, dbPackName, locPackName, dbList, locList, game, schema, tech, pruneVanilla }: WorkerDataInterface = workerData;

if (globalData === undefined) {
  throw `${folder} missing globalData`;
}

ensureDirSync(`./extracted_files/${folder}/`);
extractPackfileMass(folder, dbPackName as string, locPackName as string, dbList, locList, game)
  .then(() => parseImages(folder, [dbPackName as string], game, tech, globalData))
  .then(() => {
    csvParse(folder, true, globalData);
    mergeTablesIntoVanilla(folder, globalData, schema);
    mergeLocsIntoVanilla(folder, globalData);

    const tables = generateTables(folder, globalData, dbList, schema);
    processFactions(folder, globalData, tables, pruneVanilla, tech);
  })
  .catch((error) => {
    throw error;
  });
