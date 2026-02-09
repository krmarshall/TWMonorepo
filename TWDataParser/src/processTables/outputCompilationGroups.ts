import { skipVanillaAgentPrune } from '../lists/processFactionsLists.ts';
import { ensureDirSync, writeJSONSync } from 'fs-extra/esm';
import type { ModInfoInterface } from '../lists/packInfo.ts';
import type { CompilationGroupsInterface } from '../@types/CompilationGroupsInterface.ts';
import RpfmClient from '../rpfmClient.ts';

const outputCompilationGroups = async (
  folder: string,
  game: string,
  modInfoArray: Array<ModInfoInterface>,
  packPaths: Array<string>,
) => {
  const compGroups: CompilationGroupsInterface = { mods: [], nodeSets: {} };

  // For each mod get all of its character_skill_node_sets subTables and pull out their node set keys
  const modPromises = modInfoArray.map(async (modInfo) => {
    if (modInfo.name === undefined) {
      return;
    }

    // Set up new client so we dont interfere with rest of the build
    const rpfmClient = new RpfmClient();
    await rpfmClient.init();
    await rpfmClient.setGame(game, true);
    compGroups.mods.push(modInfo.name);
    const packPath = packPaths.find((path) => path.includes(modInfo.pack));
    await rpfmClient.openPacks([packPath]);
    const subTablePaths = await rpfmClient.getTablePathsByTableName('character_skill_node_sets_tables');
    const subTablePromises = subTablePaths.map(async (subTablePath) => {
      const skillNodeSets = await rpfmClient.decodeDbTable(subTablePath);
      skillNodeSets.table_data.forEach((tableRow) => {
        // Key is at index 3
        compGroups.nodeSets[tableRow[3].StringU8 as string] = modInfo.name;
      });
    });

    await Promise.all(subTablePromises);
    rpfmClient.disconnect();
    return;
  });
  await Promise.all(modPromises);

  // For mods that prune vanilla, but want to export certain vanilla node sets
  Object.entries(skipVanillaAgentPrune).forEach((entry) => {
    const key = entry[0];
    const value = entry[1];
    if (folder === value.mod) {
      const packName = modInfoArray.find((modInfo) => modInfo.pack === value.packname)?.name;
      if (packName === undefined) {
        throw `Cant find packname for ${folder} ${value.packname}`;
      }
      compGroups.nodeSets[key] = packName;
    }
  });

  // Sort compGroups, rpfmClient timing can differ run to run, so keep a consistent order for git commits.
  compGroups.mods.sort();
  compGroups.nodeSets = Object.fromEntries(Object.entries(compGroups.nodeSets).sort());

  // Export
  if (Object.keys(compGroups).length !== 0) {
    ensureDirSync(`./output/compGroups`);
    writeJSONSync(`./output/compGroups/${folder}.json`, compGroups, { spaces: 2 });
  }
  return;
};

export default outputCompilationGroups;
