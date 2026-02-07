import { workerData } from 'worker_threads';
import { ensureDirSync } from 'fs-extra/esm';
import type { ModWorkerDataInterface } from '../@types/WorkerDataInterfaces.ts';
import generateTables from '../generateTables.ts';
import processFactions from '../processTables/processFactions.ts';
import Extractor from '../extractor.ts';
import RpfmClient from '../rpfmClient.ts';
import { parser } from '../parser.ts';

const { folder, dbList, game, globalData, modInfo, pruneVanilla, tech }: ModWorkerDataInterface = workerData;

if (globalData === undefined) {
  throw `${folder} missing globalData`;
}

const packPath = `${process.env.WH3_WORKSHOP_PATH}/${modInfo.id}/${modInfo.pack}`;

ensureDirSync(`./extracted_files/${folder}/`);

const rpfmClient = new RpfmClient();
await rpfmClient.init();
await rpfmClient.setGame(game, true);
await rpfmClient.openPacks([packPath]);

await parser(folder, globalData, rpfmClient, dbList);

const extractor = new Extractor({
  folder,
  globalData,
  packPaths: [packPath],
  nconvertPath: process.env.NCONVERT_PATH as string,
  rpfmClient,
});
await extractor.extractAndParseImages();

const tables = await generateTables(folder, globalData, dbList, rpfmClient);
processFactions(folder, globalData, tables, pruneVanilla, tech);
