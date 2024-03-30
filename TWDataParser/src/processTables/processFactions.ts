import { Table } from '../generateTables';
import { CharacterListInterface } from '../interfaces/CharacterListInterface';
import { GlobalDataInterface, RefKey, TableRecord } from '../interfaces/GlobalDataInterface';
import {
  addAgents,
  ignoreAgents,
  ignoreCultures,
  ignoreFactions,
  ignoreSubcultures,
  remapFactions,
  skipVanillaAgentPrune,
} from '../lists/processFactionsLists';
import { techNodeSetsPrune2, techNodeSetsPrune3, vanilla3TechNodeSets } from '../lists/processFactionsTechLists';
import subcultureMap from '../lists/subcultureMap';
import vanillaCharacters from '../lists/vanillaCharacters';
import cleanNodeSetKey from '../utils/cleanNodeSetKey';
import processAgent from './processAgent';
import fse from 'fs-extra';
import processTechNodeSet from './processTechNodeSet';

const processFactions = (
  folder: string,
  globalData: GlobalDataInterface,
  tables: { [key in RefKey]?: Table },
  pruneVanilla: boolean,
  tech: boolean,
  charListPath = `debug/${folder}characterList.json`,
) => {
  const game = folder.includes('2') ? '2' : '3';

  const completedTechNodeSets: { [key: string]: boolean } = {};
  const agentMap: { [key: string /* Agent Key */]: { [key: string /* Subculture Key */]: Set<string /* Faction Key */> } } = {};
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
    const nodeSetKey = agent.foreignRefs?.character_skill_node_sets?.[0]?.key as string;
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
    const cleanKey = cleanNodeSetKey(nodeSetKey as string, true);
    if (pruneVanilla && vanillaCharacters[cleanKey] !== undefined) {
      return;
    }

    if (agentMap[addAgent.agent] === undefined) agentMap[addAgent.agent] = {};
    agentMap[addAgent.agent][addAgent.subculture] = new Set<string>();
  });

  tables.cultures?.records.forEach((culture) => {
    if (ignoreCultures.includes(culture.key)) {
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
          (ignoreCult) => ignoreCult.subculture === subculture.subculture && (folder === ignoreCult.game || ignoreCult.game === 'ALL'),
        )
      ) {
        return;
      }
      subculture.foreignRefs?.factions?.forEach((faction) => {
        if (tech) {
          faction.foreignRefs?.technology_node_sets?.forEach((techNodeSet) => {
            handleTechs(game, pruneVanilla, techNodeSet, folder, globalData, tables, completedTechNodeSets);
          });
        }
        if (
          faction.is_quest_faction === 'true' ||
          faction.is_rebel === 'true' ||
          faction.key.includes('_separatists') ||
          faction.key.includes('_invasion') ||
          faction.key.includes('_prologue') ||
          ignoreFactions.includes(faction.key)
        ) {
          return;
        }
        faction.foreignRefs?.faction_agent_permitted_subtypes?.forEach((factionAgent) => {
          if (factionAgent.agent === 'colonel' || factionAgent.agent === 'minister') {
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
          const nodeSetKey = factionAgent?.localRefs?.agent_subtypes?.foreignRefs?.character_skill_node_sets?.[0]?.key;
          if (nodeSetKey === undefined) {
            return;
          }

          const cleanKey = cleanNodeSetKey(nodeSetKey as string, true);
          if (
            skipVanillaAgentPrune[cleanKey] !== undefined &&
            skipVanillaAgentPrune[cleanKey].mod === folder &&
            skipVanillaAgentPrune[cleanKey].subculture === subculture.subculture
          ) {
            // Pass
          } else if (pruneVanilla && vanillaCharacters[cleanKey] !== undefined) {
            return;
          }

          const remappedSubculture = remapFactions[faction.key] ?? subculture.subculture;

          if (agentMap[factionAgent.subtype] === undefined) agentMap[factionAgent.subtype] = {};
          if (agentMap[factionAgent.subtype][remappedSubculture] === undefined) {
            agentMap[factionAgent.subtype][remappedSubculture] = new Set<string>();
          }
          agentMap[factionAgent.subtype][remappedSubculture].add(faction.key);
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

  fse.outputJSONSync(charListPath, characterList, { spaces: 2 });
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
  if (completedTechNodeSets[techNodeSet.key] !== undefined) {
    return;
  }
  const gameTechNodePrune = game === '2' ? techNodeSetsPrune2 : techNodeSetsPrune3;
  if (gameTechNodePrune.includes(techNodeSet.key)) {
    return;
  }
  if (pruneVanilla && vanilla3TechNodeSets.includes(techNodeSet.key)) {
    return;
  }
  completedTechNodeSets[techNodeSet.key] = true;
  processTechNodeSet(folder, globalData, techNodeSet, tables);
};
