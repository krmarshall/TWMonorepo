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
import { cultureMap, subcultureMap } from '../lists/cultureMaps.ts';

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
  // Faction Sets
  let availableCount = 0;
  let unavailableCount = 0;
  ancillary.localRefs?.faction_sets?.foreignRefs?.faction_set_items?.forEach((factionSet) => {
    returnAncillary.available = { factions: {}, subcultures: {}, cultures: {} };
    returnAncillary.unavailable = { factions: {}, subcultures: {}, cultures: {} };
    const remove = factionSet.remove as boolean;
    const faction = factionSet.localRefs?.factions;
    const subculture = factionSet.localRefs.cultures_subcultures;
    const culture = factionSet.localRefs?.cultures;
    // Faction
    if (faction !== undefined) {
      const facData = {
        name: faction.screen_name as string,
        img: faction.flags_path as string,
      };
      if (remove) {
        returnAncillary.unavailable.factions[faction.key as string] = facData;
        unavailableCount++;
      } else {
        returnAncillary.available.factions[faction.key as string] = facData;
        availableCount++;
      }
    }

    // Subculture
    if (subculture !== undefined) {
      const subData = {
        name: subculture.name as string,
        img: subcultureMap[`${subculture.subculture}`],
      };
      if (remove) {
        returnAncillary.unavailable.subcultures[subculture.subculture as string] = subData;
        unavailableCount++;
      } else {
        returnAncillary.available.subcultures[subculture.subculture as string] = subData;
        availableCount++;
      }
    }

    // Culture
    if (culture !== undefined) {
      const culData = {
        name: culture.name as string,
        img: cultureMap[`${culture.key}`],
      };
      if (remove) {
        returnAncillary.unavailable.cultures[culture.key as string] = culData;
        unavailableCount++;
      } else {
        returnAncillary.available.cultures[culture.key as string] = culData;
        availableCount++;
      }
    }

    // All
    if (factionSet.set === 'all') {
      returnAncillary.available.all = true;
    }
  });
  // If the item didnt add any faction sets and only removed them it is available for everything except those
  if (availableCount === 0 && unavailableCount > 0) {
    returnAncillary.available.all = true;
  }

  return returnAncillary;
});

outputJsonSync(`./output/items/${folder}.json`, ancillaries, { spaces: 2 });
