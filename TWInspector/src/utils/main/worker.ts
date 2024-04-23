import { ensureDirSync, readJSONSync } from 'fs-extra';
import { v3DbList, v3LocList } from '../../../../TWDataParser/src/lists/extractLists/vanilla3';
import { IpcMainInvokeEvent } from 'electron';
import { mergeLocsIntoVanilla, mergeTablesIntoVanilla } from '../../../../TWDataParser/src/mergeTables';
import generateTables from '../../../../TWDataParser/src/generateTables';
import processFactions from '../../../../TWDataParser/src/processTables/processFactions';
import { RefKey } from '../../@types/GlobalDataInterfaceRef';
import { SchemaInterface } from '../../@types/SchemaInterfaceRef';
import initializeGlobalData from '../../../../TWDataParser/src/utils/initializeGlobalData';
import { vanillaPackInfo } from '../../../../TWDataParser/src/lists/packInfo';
import Extractor from '../../../../TWDataParser/src/extractor';
import csvParse from '../../../../TWDataParser/src/csvParse';
import akData from '../../../../TWDataParser/src/akData';

export const handleBuild = async (
  _event: IpcMainInvokeEvent,
  rpfmPath: string,
  schemaFolderPath: string,
  workspacePath: string,
  warhammer3Location: string,
  modFilePaths: Array<string>,
  forceExtract: boolean,
  pruneVanilla = true,
) => {
  process.chdir(workspacePath);
  const dbPackName = vanillaPackInfo.vanilla3.db;
  const locPackName = vanillaPackInfo.vanilla3.loc;
  const dbList = v3DbList as unknown as Array<RefKey>;
  const locList = v3LocList;
  const game = 'warhammer_3';
  const folder = 'vanilla3';
  const modFolder = 'mod';
  const modCleanFilePaths = modFilePaths.map((path) => path.replace(/.pack$/, ''));
  const globalData = initializeGlobalData([folder, modFolder]);
  const dbPackPath = `${warhammer3Location}/${dbPackName}`;
  const locPackPath = `${warhammer3Location}/${locPackName}`;
  const imagePackPaths = vanillaPackInfo.vanilla3.imgs.map((imgPackName) => `${warhammer3Location}/${imgPackName}`);
  const schemaPath = `${schemaFolderPath}/schema_wh3`;
  const schema: SchemaInterface = readJSONSync(`${schemaPath}.json`);
  ensureDirSync('./extracted_files');
  const vanillaExtractor = new Extractor({
    folder,
    game,
    rpfmPath,
    schemaPath,
    nconvertPath: process.env.NCONVERT_PATH as string,
    globalData,
  });
  await vanillaExtractor
    .extractPackfile(dbPackPath, locPackPath, dbList, locList, forceExtract)
    .then(() => vanillaExtractor.parseImages(imagePackPaths, true))
    .then(() => {
      csvParse(folder, false, globalData);
      akData(folder, globalData, warhammer3Location);
    })
    .catch((error) => {
      throw error;
    });

  const modExtractor = new Extractor({
    folder: modFolder,
    game,
    rpfmPath,
    schemaPath,
    nconvertPath: process.env.NCONVERT_PATH as string,
    globalData,
  });
  await modExtractor
    .extractPackfileMulti(modCleanFilePaths, modCleanFilePaths, dbList, undefined, forceExtract)
    .then(() => modExtractor.parseImages(modCleanFilePaths, true))
    .then(() => {
      csvParse(modFolder, true, globalData);
      mergeTablesIntoVanilla(modFolder, globalData, schema);
      mergeLocsIntoVanilla(modFolder, globalData);
      const tables = generateTables(modFolder, globalData, dbList, schema);
      processFactions(modFolder, globalData, tables, pruneVanilla, false);
    })
    .catch((error) => {
      throw error;
    });
  return 'Build complete';
};
