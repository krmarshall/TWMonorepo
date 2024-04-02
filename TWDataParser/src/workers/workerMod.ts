import { workerData } from 'worker_threads';
import { ensureDirSync } from 'fs-extra';
import { ModWorkerDataInterface } from '../@types/WorkerDataInterfaces';
import csvParse from '../csvParse';
import generateTables from '../generateTables';
import processFactions from '../processTables/processFactions';
import { mergeLocsIntoVanilla, mergeTablesIntoVanilla } from '../mergeTables';
import Extractor from '../extractor';

const { folder, globalData, modInfo, dbList, locList, game, schemaPath, schema, tech, pruneVanilla }: ModWorkerDataInterface = workerData;

if (globalData === undefined) {
  throw `${folder} missing globalData`;
}

const packPath = `${process.env.WH3_WORKSHOP_PATH}/${modInfo.id}/${modInfo.pack}`;

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
  .extractPackfile(packPath, packPath, dbList, locList, false)
  .then(() => extractor.parseImages([packPath], tech))
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
