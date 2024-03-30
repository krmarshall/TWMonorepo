import { GlobalDataInterface, RefKey, TableRecord } from '../interfaces/GlobalDataInterface';
import { ItemInterface, ProcessedAgentInterface } from '../interfaces/ProcessedTreeInterface';
import cleanNodeSetKey from '../utils/cleanNodeSetKey';
import findImage from '../utils/findImage';
import outputAgent from './outputAgent';
import processEffect from './processEffect';
import processNodeSet from './processNodeSet';
import subcultureMap from '../lists/subcultureMap';
import { CharacterListInterface } from '../interfaces/CharacterListInterface';
import processAncillary from './processAncillary';
import processUnitStats from './processUnitStats';
import addCharacterListReference from '../utils/addCharacterListReference';
import processStartPosTraits from './processStartPosTraits';
import { Table } from '../generateTables';

const processAgent = (
  folder: string,
  globalData: GlobalDataInterface,
  tables: { [key in RefKey]?: Table },
  agent: TableRecord,
  subcultureKey: string,
  factionKeys: Set<string>,
  characterList: CharacterListInterface,
) => {
  const returnAgent: ProcessedAgentInterface = {
    key: '',
    skillTree: [],
    unitStats: processUnitStats(folder, globalData, agent.localRefs?.main_units as TableRecord),
  };
  const unfilteredItems: Array<ItemInterface> = [];

  // Unique heroes require start_pos data from the assembly kit, unlikely mods will use start_pos just to add traits
  // and would have to find a way to process modded start_pos
  if (folder === 'vanilla3') {
    const startPosTraits = processStartPosTraits(folder, globalData, tables, agent, subcultureKey);
    if (startPosTraits !== undefined) returnAgent.startPosTraits = startPosTraits;
  }

  // LL Faction Effects WH3
  if (agent.foreignRefs?.faction_starting_general_effects !== undefined) {
    const { foreignRefs, ...effectBundle } = agent.foreignRefs?.faction_starting_general_effects[0].localRefs
      ?.effect_bundles as TableRecord;
    returnAgent.factionEffects = {
      key: effectBundle.key,
      localised_description: effectBundle.localised_description,
      localised_title: effectBundle.localised_title,
      ui_icon: findFactionEffectImage(folder, globalData, effectBundle.ui_icon),
      effects: [],
    };
    foreignRefs?.effect_bundles_to_effects_junctions?.forEach((effectJunc) => {
      returnAgent.factionEffects?.effects.push(processEffect(folder, globalData, effectJunc as TableRecord));
    });
    returnAgent.factionEffects.effects
      .sort((a, b) => (a.priority as number) - (b.priority as number))
      .forEach((effect) => delete effect.priority);
  }

  // Quest Ancillaries WH3
  agent.foreignRefs?.character_ancillary_quest_ui_details?.forEach((ancillaryQuest) => {
    unfilteredItems.push(processAncillary(folder, globalData, ancillaryQuest, ancillaryQuest.rank));
  });
  // Character locked ancillaries (no unlock rank, so mostly for picking up edge cases), includes mounts
  agent.foreignRefs?.ancillaries_included_agent_subtypes?.forEach((ancillaryAgent) => {
    if (
      ancillaryAgent?.localRefs?.ancillaries?.category !== undefined &&
      ancillaryAgent?.localRefs?.ancillaries?.category !== 'mount' &&
      ancillaryAgent?.localRefs?.ancillaries?.transferrable !== 'true'
    ) {
      const findItem = unfilteredItems.find(
        (unfItem) => unfItem.key === ancillaryAgent?.localRefs?.ancillaries?.localRefs?.ancillary_info?.ancillary,
      );
      if (findItem === undefined) {
        unfilteredItems.push(processAncillary(folder, globalData, ancillaryAgent, undefined));
      }
    }
  });

  agent.foreignRefs?.character_skill_node_sets?.forEach((nodeSet, index) => {
    if (index === 1 && agent.key === 'nor_marauder_chieftain') {
      return;
    }

    if (folder.includes('2')) {
      if (nodeSet.foreignRefs?.character_skill_nodes === undefined || nodeSet.foreignRefs?.character_skill_nodes.length === 0) {
        return;
      }
    } else {
      if (
        nodeSet.foreignRefs?.character_skill_node_set_items === undefined ||
        nodeSet.foreignRefs?.character_skill_node_set_items.length === 0
      ) {
        return;
      }
    }

    addCharacterListReference(folder, globalData, agent, nodeSet, subcultureKey, characterList);

    const { skillTree, backgroundSkills, items, altFactionNodeSets } = processNodeSet(
      folder,
      globalData,
      nodeSet,
      subcultureKey,
      factionKeys,
    );
    const tempAgent = JSON.parse(JSON.stringify(returnAgent));
    const nodeSetKey = cleanNodeSetKey(nodeSet.key);
    tempAgent.key = nodeSetKey;
    tempAgent.skillTree = skillTree;
    unfilteredItems.push(...items);
    if (unfilteredItems.length > 0) {
      tempAgent.items = [];
      const itemKeys = new Set<string>();
      unfilteredItems.forEach((item) => {
        if (!itemKeys.has(item.key)) {
          tempAgent.items?.push(item);
          itemKeys.add(item.key);
        }
      });
      tempAgent.items.sort((a: ItemInterface, b: ItemInterface) => (a.unlocked_at_rank ?? 99) - (b.unlocked_at_rank ?? 99));
    }
    tempAgent.backgroundSkills = backgroundSkills;
    if (altFactionNodeSets !== undefined) {
      tempAgent.altFactionNodeSets = altFactionNodeSets;
    }

    outputAgent(tempAgent, folder, subcultureMap[subcultureKey as keyof typeof subcultureMap]);
  });
};

export default processAgent;

const findFactionEffectImage = (folder: string, globalData: GlobalDataInterface, iconArg: string) => {
  const icon = iconArg.replace('.png', '').trim();
  const searchArray = [`campaign_ui/effect_bundles/${icon}`, `campaign_ui/effect_bundles/${icon.toLowerCase()}`];

  return findImage(folder, globalData, searchArray, icon);
};
