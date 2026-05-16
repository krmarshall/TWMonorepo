import { workerData } from 'worker_threads';
import { ensureDirSync, outputJsonSync } from 'fs-extra/esm';
import generateTables from '../generateTables.ts';
import Extractor from '../extractor.ts';
import RpfmClient from '../rpfmClient.ts';
import { parser } from '../parser.ts';
import processAncillaryExtended from '../processTables/processAncillaryExtended.ts';
import type { WorkerModItemDataInterface } from '../@types/WorkerDataInterfaces.ts';
import type { ExtendedItemInterface } from '../@types/ItemInterface.ts';

const { folder, dbList, game, globalData, modInfo, pruneVanilla }: WorkerModItemDataInterface = workerData;

if (globalData === undefined) {
  throw `${folder} missing globalData`;
}

const packPath = `${process.env.WH3_WORKSHOP_PATH}/${modInfo.id}/${modInfo.pack}.pack`;

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
const ancillaries: Array<ExtendedItemInterface> = [];
tables.ancillaries?.records.forEach((ancillary) => {
  const processedAncillary = processAncillaryExtended(ancillary, tables, folder, globalData, pruneVanilla, game);
  if (processedAncillary !== undefined) {
    ancillaries.push(processedAncillary);
  }
});

outputJsonSync(`./output/items/${folder}.json`, ancillaries, { spaces: 2 });

rpfmClient.disconnect();
