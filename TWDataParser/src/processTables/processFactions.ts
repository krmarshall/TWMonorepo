import { Table } from '../generateTables.ts';
import type { CharacterListInterface } from '../@types/CharacterListInterface.ts';
import type { GlobalDataInterface, RefKey, TableRecord } from '../@types/GlobalDataInterface.ts';
import {
  addAgents,
  ignoreAgents,
  ignoreCultures,
  ignoreFactions,
  ignoreSubcultures,
  remapFactions,
  skipVanillaAgentPrune,
} from '../lists/processFactionsLists.ts';
import { techNodeSetsPrune2, techNodeSetsPrune3, vanilla3TechNodeSets } from '../lists/processFactionsTechLists.ts';
import subcultureMap from '../lists/subcultureMap.ts';
import vanillaCharacters from '../lists/vanillaCharacters.ts';
import processAgent from './processAgent.ts';
import processTechNodeSet from './processTechNodeSet.ts';
import { outputJSONSync } from 'fs-extra/esm';
import { sortCharacterList } from '../utils/sortCharacterList.ts';
import { hardcodeCharListData } from '../utils/hardcodeCharList.ts';

const processFactions = (
  folder: string,
  globalData: GlobalDataInterface,
  tables: { [key in RefKey]?: Table },
  pruneVanilla: boolean,
  tech: boolean,
) => {
  const game = folder.includes('2') ? '2' : '3';

  const completedTechNodeSets: { [key: string]: boolean } = {};
  const agentMap: { [agentKey: string]: { [subcultureKey: string]: Set<string /* Faction Key */> } } = {};
  const characterList: CharacterListInterface = {};
  Object.values(subcultureMap).forEach((subculture) => (characterList[subculture] = { lords: {}, heroes: {} }));

  addAgents.forEach((addAgent) => {
    if (addAgent.game !== game) {
      return;
    }
    const agent = tables.agent_subtypes?.findRecordByKey('key', addAgent.agent);
    if (agent === undefined) {
      return;
    }
    let nodeSetKey = agent.foreignRefs?.character_skill_node_sets?.[0]?.key as string;
    // HEFs have a bunch of special node sets that just have diff background traits?
    let n = 1;
    while (nodeSetKey?.endsWith('_affinity')) {
      nodeSetKey = agent.foreignRefs?.character_skill_node_sets?.[n]?.key as string;
      n++;
    }
    if (nodeSetKey === undefined) {
      return;
    }
    if (
      ignoreAgents.some(
        (ignoreAgent) =>
          ignoreAgent.agent === addAgent.agent &&
          (ignoreAgent.game === 'ALL' || game === ignoreAgent.game) &&
          (ignoreAgent.folder === undefined || ignoreAgent.folder === folder) &&
          (ignoreAgent.subculture === undefined || ignoreAgent.subculture === addAgent.subculture),
      )
    ) {
      return;
    }
    if (pruneVanilla && vanillaCharacters[nodeSetKey] !== undefined) {
      return;
    }

    if (agentMap[addAgent.agent] === undefined) agentMap[addAgent.agent] = {};
    agentMap[addAgent.agent][addAgent.subculture] = new Set<string>();
  });

  tables.cultures?.records.forEach((culture) => {
    if (ignoreCultures.includes(culture.key as string)) {
      return;
    }
    if (tech) {
      culture.foreignRefs?.technology_node_sets?.forEach((techNodeSet) => {
        handleTechs(game, pruneVanilla, techNodeSet, folder, globalData, tables, completedTechNodeSets);
      });
    }

    culture.foreignRefs?.cultures_subcultures?.forEach((subculture) => {
      if (tech) {
        subculture.foreignRefs?.technology_node_sets?.forEach((techNodeSet) => {
          handleTechs(game, pruneVanilla, techNodeSet, folder, globalData, tables, completedTechNodeSets);
        });
      }

      if (
        ignoreSubcultures.some(
          (ignoreCult) =>
            ignoreCult.subculture === subculture.subculture &&
            (folder === ignoreCult.game || ignoreCult.game === 'ALL'),
        )
      ) {
        return;
      }
      subculture.foreignRefs?.factions?.forEach((faction) => {
        const factionKey = faction.key as string;
        if (tech) {
          faction.foreignRefs?.technology_node_sets?.forEach((techNodeSet) => {
            handleTechs(game, pruneVanilla, techNodeSet, folder, globalData, tables, completedTechNodeSets);
          });
        }
        if (
          faction.is_quest_faction === true ||
          faction.is_rebel === true ||
          factionKey.includes('_separatists') ||
          factionKey.includes('_invasion') ||
          factionKey.includes('_prologue') ||
          ignoreFactions.includes(factionKey)
        ) {
          return;
        }
        faction.foreignRefs?.faction_agent_permitted_subtypes?.forEach((factionAgent) => {
          const factionAgentSubtype = factionAgent.subtype as string;
          if (
            factionAgent.agent === 'colonel' ||
            factionAgent.agent === 'minister' ||
            factionAgent.mod_disabled === true
          ) {
            return;
          }
          if (
            ignoreAgents.some(
              (ignoreAgent) =>
                ignoreAgent.agent === factionAgent.subtype &&
                (ignoreAgent.game === 'ALL' || game === ignoreAgent.game) &&
                (ignoreAgent.folder === undefined || ignoreAgent.folder === folder) &&
                (ignoreAgent.subculture === undefined || ignoreAgent.subculture === subculture.subculture),
            )
          ) {
            return;
          }
          let nodeSetKey = factionAgent?.localRefs?.agent_subtypes?.foreignRefs?.character_skill_node_sets?.[0]
            ?.key as string;
          // HEFs have a bunch of special node sets that just have diff background traits?
          let n = 1;
          while (nodeSetKey?.endsWith('_affinity')) {
            nodeSetKey = factionAgent?.localRefs?.agent_subtypes?.foreignRefs?.character_skill_node_sets?.[n]
              ?.key as string;
            n++;
          }
          if (nodeSetKey === undefined) {
            return;
          }

          if (
            skipVanillaAgentPrune[nodeSetKey] !== undefined &&
            skipVanillaAgentPrune[nodeSetKey].mod === folder &&
            skipVanillaAgentPrune[nodeSetKey].subculture === subculture.subculture
          ) {
            // Pass
          } else if (pruneVanilla && vanillaCharacters[nodeSetKey] !== undefined) {
            return;
          }

          const remappedSubculture = remapFactions[factionKey] ?? (subculture.subculture as string);

          if (agentMap[factionAgentSubtype] === undefined) agentMap[factionAgentSubtype] = {};
          if (agentMap[factionAgentSubtype][remappedSubculture] === undefined) {
            agentMap[factionAgentSubtype][remappedSubculture] = new Set<string>();
          }
          agentMap[factionAgentSubtype][remappedSubculture].add(factionKey);
        });
      });
    });
  });

  Object.keys(agentMap).forEach((agentKey) => {
    const agent = agentMap[agentKey];
    Object.keys(agent).forEach((subcultureKey) => {
      const factions = agent[subcultureKey];
      const agentRecord = tables.agent_subtypes?.findRecordByKey('key', agentKey);
      if (agentRecord !== undefined) {
        processAgent(folder, globalData, tables, agentRecord, subcultureKey, factions, characterList);
      }
    });
  });

  hardcodeCharListData(characterList);
  const sortedCharList = sortCharacterList(characterList, folder);

  outputJSONSync(`./output/charLists/${folder}.json`, sortedCharList, { spaces: 2 });
};

export default processFactions;

const handleTechs = (
  game: string,
  pruneVanilla: boolean,
  techNodeSet: TableRecord,
  folder: string,
  globalData: GlobalDataInterface,
  tables: { [key in RefKey]?: Table },
  completedTechNodeSets: { [key: string]: boolean },
) => {
  const techNodeSetKey = techNodeSet.key as string;
  if (completedTechNodeSets[techNodeSetKey] !== undefined) {
    return;
  }
  const gameTechNodePrune = game === '2' ? techNodeSetsPrune2 : techNodeSetsPrune3;
  if (gameTechNodePrune.includes(techNodeSetKey)) {
    return;
  }
  if (pruneVanilla && vanilla3TechNodeSets.includes(techNodeSetKey)) {
    return;
  }
  completedTechNodeSets[techNodeSetKey] = true;
  processTechNodeSet(folder, globalData, techNodeSet, tables);
};
