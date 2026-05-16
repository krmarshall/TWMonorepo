import { workerData } from 'worker_threads';
import type { WorkerItemDataInterface } from '../@types/WorkerDataInterfaces.ts';
import { deserialize } from '@ungap/structured-clone';
import type { RefKey } from '../@types/GlobalDataInterface.ts';
import type { Table } from '../generateTables.ts';
import type { ExtendedItemInterface } from '../@types/ItemInterface.ts';
import { outputJsonSync } from 'fs-extra/esm';
import processAncillaryExtended from '../processTables/processAncillaryExtended.ts';

// tables no longer have access to methods from class Table (findRecordByKey), but data structure is the same.
const tables: { [key in RefKey]?: Table } = deserialize(workerData.tables);
const { folder, globalData, pruneVanilla }: WorkerItemDataInterface = workerData;
const game = folder.includes('3') ? 'warhammer_3' : 'warhammer_2';

const ancillaries: Array<ExtendedItemInterface> = [];
tables.ancillaries.records.forEach((ancillary) => {
  const processedAncillary = processAncillaryExtended(ancillary, tables, folder, globalData, pruneVanilla, game);
  if (processedAncillary !== undefined) {
    ancillaries.push(processedAncillary);
  }
});

const vanillaAncillaryKeyMap = {};
ancillaries.map((ancillaries) => {
  vanillaAncillaryKeyMap[ancillaries.key] = ancillaries.key;
});
outputJsonSync(`./debug/items/${folder}.json`, vanillaAncillaryKeyMap, { spaces: 2 });

outputJsonSync(`./output/items/${folder}.json`, ancillaries, { spaces: 2 });
