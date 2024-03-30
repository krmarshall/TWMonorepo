import { emptyDirSync, ensureDirSync, readJsonSync } from 'fs-extra';
import { v3DbList, v3LocList } from '../../../../TWDataParser/src/lists/extractLists/vanilla3';
import { IpcMainInvokeEvent } from 'electron';
import { extractPackfile, extractPackfileMulti, parseImages, updateLocalVars } from './rpfm';
import path from 'path';
import csvParse from './csvParse';
import { mergeLocsIntoVanilla, mergeTablesIntoVanilla } from '../../../../TWDataParser/src/mergeTables';
import generateTables from '../../../../TWDataParser/src/generateTables';
import processFactions from '../../../../TWDataParser/src/processTables/processFactions';
import { GlobalDataInterface, RefKey } from '../../@types/GlobalDataInterfaceRef';
import { SchemaInterface } from '../../@types/SchemaInterfaceRef';

const dbPackName = 'db';
const locPackName = 'local_en';
const dbList = v3DbList as unknown as Array<RefKey>;
const locList = v3LocList;
const game = 'warhammer_3';
const folder = 'vanilla3';
const modFolder = 'mod';
const imagePacknames = ['data', 'data_1', 'data_2', 'data_3', 'data_bl', 'data_bm', 'data_tk', 'data_we', 'data_wp_'];
const globalData = initializeGlobalData();

export const handleBuild = async (
  _event: IpcMainInvokeEvent,
  rpfmPath: string,
  schemaPath: string,
  workspacePath: string,
  warhammer3Location: string,
  modFilePaths: Array<string>,
  forceExtract: boolean,
) => {
  updateLocalVars(workspacePath, rpfmPath, schemaPath, game, globalData);
  process.chdir(workspacePath);
  ensureDirSync(workspacePath + '/extracted_files');
  // Vanilla
  const vanilla = extractPackfile(
    folder,
    dbPackName,
    `${warhammer3Location}/${dbPackName}.pack`,
    locPackName,
    `${warhammer3Location}/${locPackName}.pack`,
    dbList,
    locList,
    forceExtract,
  );
  const imagePackPaths = imagePacknames.map((packName) => `${warhammer3Location}/${packName}.pack`);
  const vanillaImg = parseImages(folder, imagePackPaths, forceExtract);

  await Promise.all([vanilla, vanillaImg]);
  csvParse(folder, false, globalData, workspacePath);

  // Mod
  let mod;
  if (modFilePaths.length === 1) {
    const modPackName = path.basename(modFilePaths[0], '.pack');
    mod = extractPackfile(modFolder, modPackName, modFilePaths[0], modPackName, modFilePaths[0], dbList, undefined, true);
  } else {
    mod = extractPackfileMulti(modFolder, modFilePaths, dbList, true);
  }
  const modImgs = parseImages(modFolder, modFilePaths, true);

  await Promise.all([mod, modImgs]);
  csvParse(modFolder, true, globalData, workspacePath);
  const schemaJson: SchemaInterface = readJsonSync(`${schemaPath}/schema_wh3.json`);
  mergeTablesIntoVanilla(modFolder, globalData, schemaJson);
  mergeLocsIntoVanilla(modFolder, globalData);

  const tables = generateTables(modFolder, globalData, dbList, schemaJson);
  emptyDirSync('./output');
  processFactions(modFolder, globalData, tables, true, false, `${workspacePath}/characterList.json`);
  return 'Completed';
};

function initializeGlobalData() {
  const globalData: GlobalDataInterface = {
    extractedData: {},
    parsedData: {},
    imgPaths: {},
    portraitPaths: {},
  };
  [folder, modFolder].forEach((folder) => {
    globalData.extractedData[folder] = {
      db: {},
      text: {},
    };
    globalData.parsedData[folder] = {
      db: {},
      text: {},
    };
    globalData.imgPaths[folder] = {};
    globalData.portraitPaths[folder] = {};
  });
  return globalData;
}
