import { sync } from 'fast-glob';
import { dirname } from 'path';
import { parse } from 'csv-parse/sync';
import { TableRecord } from '../@types/GlobalDataInterface';
import { skipVanillaAgentPrune } from '../lists/processFactionsLists';
import { ensureDirSync, readFileSync, writeJSONSync } from 'fs-extra';
import { ModInfoInterface } from '../lists/packInfo';
import { CompilationGroupsInterface } from '../@types/CompilationGroupsInterface';

const csvParseConfig = {
  delimiter: '\t',
  from: 2,
  record_delimiter: '\n',
  columns: true,
  relax_quotes: true,
  quote: '`',
};

const outputCompilationGroups = (folder: string, modInfoArray: Array<ModInfoInterface>) => {
  const compGroups: CompilationGroupsInterface = { mods: [], nodeSets: {} };

  modInfoArray.forEach((modInfo) => {
    if (modInfo.name === undefined) {
      return;
    }
    compGroups.mods.push(modInfo.name);
    const subDb = sync(`./extracted_files/${folder}/subDB*/${modInfo.pack}`)[0];
    const subDbPath = dirname(subDb);
    const skillNodeSetTSVs = sync(`${subDbPath}/db/character_skill_node_sets_tables/*.tsv`);
    skillNodeSetTSVs.forEach((tsv) => {
      const parsedArray = parse(readFileSync(tsv, 'utf-8'), csvParseConfig);
      parsedArray.forEach((nodeSet: TableRecord) => {
        compGroups.nodeSets[nodeSet.key] = modInfo.name as string;
      });
    });
  });

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

  if (Object.keys(compGroups).length !== 0) {
    ensureDirSync(`./output/compGroups`);
    writeJSONSync(`./output/compGroups/${folder}.json`, compGroups, { spaces: 2 });
  }
};

export default outputCompilationGroups;
