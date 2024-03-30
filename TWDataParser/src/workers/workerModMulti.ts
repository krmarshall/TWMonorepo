import { workerData } from 'worker_threads';
import { ensureDirSync } from 'fs-extra';
import { WorkerDataInterface } from '../interfaces/WorkerDataInterfaces';
import parseImages from '../parseImages';
import { extractPackfileMulti } from '../extractTables';
import csvParse from '../csvParse';
import generateTables from '../generateTables';
import processFactions from '../processTables/processFactions';
import { mergeLocsIntoVanilla, mergeTablesIntoVanilla } from '../mergeTables';
import outputCompilationGroups from '../processTables/outputCompilationGroups';

const {
  folder,
  globalData,
  dbPackNames,
  locPackNames,
  dbList,
  locList,
  game,
  schema,
  tech,
  pruneVanilla,
  packNameEnum,
}: WorkerDataInterface = workerData;

if (globalData === undefined) {
  throw `${folder} missing globalData`;
}

ensureDirSync(`./extracted_files/${folder}/`);
extractPackfileMulti(folder, dbPackNames as Array<string>, locPackNames as Array<string>, dbList, locList, game)
  .then(() => parseImages(folder, dbPackNames as Array<string>, game, tech, globalData))
  .then(() => {
    if (packNameEnum !== undefined) {
      outputCompilationGroups(folder, packNameEnum);
    }
    csvParse(folder, true, globalData);
    mergeTablesIntoVanilla(folder, globalData, schema);
    mergeLocsIntoVanilla(folder, globalData);

    const tables = generateTables(folder, globalData, dbList, schema);
    processFactions(folder, globalData, tables, pruneVanilla, tech);
  })
  .catch((error) => {
    throw error;
  });
