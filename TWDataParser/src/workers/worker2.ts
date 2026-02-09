import { workerData } from 'worker_threads';
import { ensureDirSync } from 'fs-extra/esm';
import type { VanillaWorkerDataInterface } from '../@types/WorkerDataInterfaces.ts';
import initializeGlobalData from '../utils/initializeGlobalData.ts';
import generateTables from '../generateTables.ts';
import processFactions from '../processTables/processFactions.ts';
import { modPackInfo, vanillaPackInfo } from '../lists/packInfo.ts';
import Extractor from '../extractor.ts';
import RpfmClient from '../rpfmClient.ts';
import { parser } from '../parser.ts';

const { folder, packs, dbList, game }: VanillaWorkerDataInterface = workerData;

const packPaths = packs.map((pack) => `${process.env.WH2_DATA_PATH}/${pack}.pack`);

console.time(folder);

const globalData = initializeGlobalData([...Object.keys(vanillaPackInfo), ...Object.keys(modPackInfo)]);

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

const tables = await generateTables(folder, globalData, dbList, rpfmClient);
processFactions(folder, globalData, tables, false, true);

console.timeEnd(folder);
rpfmClient.disconnect();
