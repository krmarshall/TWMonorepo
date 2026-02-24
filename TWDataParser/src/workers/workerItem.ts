import { workerData } from 'worker_threads';
import type { WorkerItemDataInterface } from '../@types/WorkerDataInterfaces.ts';
import { deserialize } from '@ungap/structured-clone';
import type { RefKey, TableRecord } from '../@types/GlobalDataInterface.ts';
import type { Table } from '../generateTables.ts';
import processAncillary from '../processTables/processAncillary.ts';
import { vanillaAncillaries } from '../lists/vanillaLists/vanillaAncillaries.ts';
import type { ExtendedItemInterface } from '../@types/ItemInterface.ts';
import { outputJsonSync } from 'fs-extra/esm';
import stringInterpolator from '../utils/stringInterpolator.ts';
import { rarityGroupPriority } from '../utils/rarityGroupPriority.ts';
import { rarityLookup } from '../utils/rarityLookup.ts';

// tables no longer have access to methods from class Table (findRecordByKey), but data structure is the same.
const tables: { [key in RefKey]?: Table } = deserialize(workerData.tables);
const { folder, globalData, pruneVanilla }: WorkerItemDataInterface = workerData;

const ancillaries = tables.ancillaries.records.map((ancillary) => {
  // Skip Mounts
  if (ancillary.category === 'mount') {
    return;
  }

  // Skip vanilla ancillaries if we just want modded ones.
  if (pruneVanilla && vanillaAncillaries[ancillary.something as string] !== undefined) {
    return;
  }

  // Find unlock rank if applicable
  let unlockedAtRank;
  ancillary.foreignRefs?.character_ancillary_quest_ui_details?.forEach((quest) => (unlockedAtRank = quest.rank));

  // Get standard ancillary details
  // processAncillary expects a junction table, so mock one for simplicity
  const mockJunc = { localRefs: { ancillaries: ancillary } } as TableRecord;
  const baseAncillary = processAncillary(folder, globalData, mockJunc, unlockedAtRank);

  // Get extra ancillary details, mostly for filtering
  // Rarity
  // Grab each effects related ability keys
  const abilityKeys = [];
  baseAncillary.effects?.forEach((effect) =>
    effect.related_abilities?.forEach((ability) => abilityKeys.push(ability.unit_ability.key)),
  );
  // For each ability key, find its ability record, and grab that abilities uniqueness group key
  const rarityGroups = [];
  abilityKeys.forEach((abilityKey) => {
    const recordIndex = tables.unit_abilities.indexedKeys.key[abilityKey];
    const ability = tables.unit_abilities.records[recordIndex];
    const group = ability.localRefs?.ancillary_uniqueness_groupings?.group_key;
    rarityGroups.push(group);
  });
  // Find the highest group key of all the ancillaries effects
  const highestGroup = rarityGroupPriority(rarityGroups);
  // Find rarity between either the uniqueness group of an ability, or fallback to the uniqueness score of the ancillary
  const rarity = rarityLookup(highestGroup, ancillary.uniqueness_score as number);

  // Category
  const category = stringInterpolator(
    ancillary.localRefs.ancillaries_categories.onscreen_name as string,
    globalData.parsedData[folder].text,
  );

  const returnAncillary: ExtendedItemInterface = { ...baseAncillary, rarity, category };

  // Optional details
  // Subcategory
  if (ancillary.localRefs?.ancillaries_subcategories !== undefined) {
    returnAncillary.subcategory = ancillary.localRefs?.ancillaries_subcategories?.onscreen_name as string;
  }
  // Randomly Dropped
  if (ancillary.randomly_dropped) returnAncillary.randomly_dropped = true;
  // Can be Destroyed
  if (ancillary.can_be_destroyed) returnAncillary.can_be_destroyed = true;
  // Transferrable
  if (ancillary.transferrable) returnAncillary.transferrable = true;

  return returnAncillary;
});

outputJsonSync(`./output/items/${folder}.json`, ancillaries, { spaces: 2 });
