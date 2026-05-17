import {
  ItemCategoryEnum,
  ItemSubcategoryEnum,
  type ExtendedItemInterface,
  type ItemCategoryEnumKey,
  type ItemSubcategoryEnumKey,
} from '../@types/ItemInterface.ts';
import { vanillaAncillaries } from '../lists/vanillaLists/vanillaAncillaries.ts';
import processAncillary from '../processTables/processAncillary.ts';
import { cultureMap, subcultureMap } from '../lists/cultureMaps.ts';
import { rarityLookup } from '../utils/itemUtils.ts';
import stringInterpolator from '../utils/stringInterpolator.ts';
import type { Table } from '../generateTables.ts';
import type { GlobalDataInterface, RefKey, TableRecord } from '../@types/GlobalDataInterface.ts';

const processAncillaryExtended = (
  ancillary: TableRecord,
  tables: { [key in RefKey]?: Table },
  folder: string,
  globalData: GlobalDataInterface,
  pruneVanilla: boolean,
  game: string,
): ExtendedItemInterface | undefined => {
  // Skip Mounts
  if (ancillary.category === 'mount') {
    return;
  }

  // Skip vanilla ancillaries if we just want modded ones.
  if (pruneVanilla && vanillaAncillaries[ancillary.key as string] !== undefined) {
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
  const abilityKeys: Array<string> = [];
  baseAncillary.effects?.forEach((effect) =>
    effect.related_abilities?.forEach((ability) => abilityKeys.push(ability.unit_ability.key)),
  );
  // For each ability key, find its ability record, and grab that abilities uniqueness group key
  const rarityGroups = [];
  abilityKeys.forEach((abilityKey) => {
    const recordIndex = (tables.unit_abilities as Table).indexedKeys.key[abilityKey];
    const ability = (tables.unit_abilities as Table).records[recordIndex];
    const group = ability.localRefs?.ancillary_uniqueness_groupings?.group_key;
    rarityGroups.push(group);
  });
  // Find rarity from the uniqueness score of the ancillary
  const rarity = rarityLookup(ancillary.uniqueness_score as number, game);

  // Category
  const category = ItemCategoryEnum[ancillary.localRefs?.ancillaries_categories?.category as ItemCategoryEnumKey];

  const returnAncillary: ExtendedItemInterface = { ...baseAncillary, rarity, category };

  // Optional details
  // Subcategory
  if (ancillary.localRefs?.ancillaries_subcategories !== undefined) {
    returnAncillary.subcategory =
      ItemSubcategoryEnum[ancillary.localRefs?.ancillaries_subcategories.subcategory as ItemSubcategoryEnumKey];
  }
  // Randomly Dropped
  if (ancillary.randomly_dropped) returnAncillary.randomly_dropped = true;
  // Can be Destroyed
  if (ancillary.can_be_destroyed) returnAncillary.can_be_destroyed = true;
  // Transferrable
  if (ancillary.transferrable) returnAncillary.transferrable = true;
  // Agent Subtypes
  ancillary.foreignRefs?.ancillaries_included_agent_subtypes?.forEach((agentJunc) => {
    const agent = agentJunc.localRefs?.agent_subtypes;
    const name =
      (agent?.localRefs?.main_units?.localRefs?.land_units?.onscreen_name as string) ??
      (agent?.onscreen_name_override as string);
    const processedName = stringInterpolator(name, globalData.parsedData[folder].text);
    if (returnAncillary.agent_subtypes === undefined) returnAncillary.agent_subtypes = [];
    if (!returnAncillary.agent_subtypes.includes(processedName)) {
      returnAncillary.agent_subtypes.push(processedName);
    }
  });
  // Agent Types
  ancillary.localRefs?.ancillary_info?.foreignRefs?.ancillary_to_included_agents?.forEach((agentJunc) => {
    if (returnAncillary.agent_types === undefined) returnAncillary.agent_types = [];
    returnAncillary.agent_types.push(agentJunc.agent as string);
  });

  // Faction Sets
  let availableCount = 0;
  let unavailableCount = 0;
  ancillary.localRefs?.faction_sets?.foreignRefs?.faction_set_items?.forEach((factionSet) => {
    returnAncillary.available = { factions: {}, subcultures: {}, cultures: {} };
    returnAncillary.unavailable = { factions: {}, subcultures: {}, cultures: {} };
    const remove = factionSet.remove as boolean;
    const faction = factionSet.localRefs?.factions;
    const subculture = factionSet.localRefs?.cultures_subcultures;
    const culture = factionSet.localRefs?.cultures;
    // Faction
    if (faction !== undefined) {
      const facData = {
        name: faction.screen_name as string,
        img: (faction.flags_path as string).replaceAll('\\', '/').replace('ui/', ''),
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
    // @ts-expect-error 18048
    returnAncillary.available.all = true;
  }
  if (unavailableCount === 0) {
    delete returnAncillary.unavailable;
  }

  return returnAncillary;
};

export default processAncillaryExtended;
