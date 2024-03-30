import { exec } from 'child_process';
import { IpcMainInvokeEvent } from 'electron';
import { emptyDirSync, ensureDirSync, ensureFileSync, outputJSONSync, readJSONSync, statSync } from 'fs-extra';
import path from 'path';
import { sync, convertPathToPattern } from 'fast-glob';
import { fillPortraitGlobalData } from '../../../../TWDataParser/src/parseImages';
import { GlobalDataInterface } from '../../@types/GlobalDataInterfaceRef';

let cwd = '';
let rpfmPath = '';
let schemaPath = '';
let game = '';
let globalData: GlobalDataInterface;

export const handleRefreshSchemas = (_event: IpcMainInvokeEvent, rpfmPath: string, schemaPath: string) => {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    exec(`${rpfmPath} -g warhammer_3 schemas update --schema-path "${schemaPath}"`, (error, stdout, stderr) => {
      resolve({ stdout, stderr });
    });
  });
};

export const handleConvertSchemas = (_event: IpcMainInvokeEvent, rpfmPath: string, schemaPath: string) => {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    exec(`${rpfmPath} -g warhammer_3 schemas to-json --schemas-path "${schemaPath}"`, (error, stdout, stderr) => {
      resolve({ stdout, stderr });
    });
  });
};

export const updateLocalVars = (
  workspacePath: string,
  rpfmPathArg: string,
  schemaPathArg: string,
  gameArg: string,
  globalDataArg: GlobalDataInterface,
) => {
  cwd = workspacePath;
  rpfmPath = rpfmPathArg;
  schemaPath = schemaPathArg;
  game = gameArg;
  globalData = globalDataArg;
};

const generateTablesString = (dbList: Array<string>, folder: string) => {
  return dbList.reduce((prev, cur) => {
    return `${prev} "/db/${cur}_tables;./extracted_files/${folder}"`;
  }, '');
};

const generateLocsString = (locList: Array<string>, folder: string) => {
  return locList.reduce((prev, cur) => {
    return `${prev} "/text/db/${cur}.loc;./extracted_files/${folder}"`;
  }, '');
};

const createExtractedTimestamp = (folder: string, dbPackName: string, dbPackPath: string) => {
  const fileStats = statSync(dbPackPath);
  outputJSONSync(`${cwd}/extracted_files/${folder}/${dbPackName}_timestamp.json`, { time: fileStats.mtime.toString() });
};

const extractData = (packPath: string, tablesString: string) => {
  return new Promise<string>((resolve, reject) => {
    exec(
      `cd /d ${cwd}&&${rpfmPath} --verbose -g ${game} pack extract -p "${packPath}" -t "${schemaPath}/schema_wh3.ron" -F ${tablesString}`,
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(`${stdout}\n${stderr}`);
        }
      },
    );
  });
};

export const extractPackfile = (
  folder: string,
  dbPackName: string,
  dbPackPath: string,
  locPackName: string,
  locPackPath: string,
  dbList: Array<string>,
  locList: Array<string> | undefined,
  forceExtract: boolean,
) => {
  return new Promise<string>((resolve, reject) => {
    const tablesString = generateTablesString(dbList, folder);

    const oldDbTimestamp = readJSONSync(`${cwd}/extracted_files/${folder}/${dbPackName}_timestamp.json`, {
      throws: false,
    });
    const newFileStats = statSync(dbPackPath);
    const oldTables = readJSONSync(`${cwd}/extracted_files/${folder}/tables.json`, { throws: false });
    const newTables = dbList;
    if (
      forceExtract === false &&
      oldDbTimestamp !== null &&
      oldDbTimestamp.time === newFileStats.mtime.toString() &&
      oldTables !== null &&
      JSON.stringify(oldTables) === JSON.stringify(newTables)
    ) {
      return resolve(`Cached ${dbPackName}`);
    } else {
      emptyDirSync(`${cwd}/extracted_files/${folder}`);
    }

    if (locList === undefined && dbPackName === locPackName) {
      extractData(dbPackPath, `${tablesString} "/text;${cwd}/extracted_files/${folder}"`)
        .then((consoleOutput) => {
          createExtractedTimestamp(folder, dbPackName, dbPackPath);
          resolve(consoleOutput);
        })
        .catch((error: any) => reject(error));
    } else {
      const locString = generateLocsString(locList as Array<string>, folder);
      const locPromise = extractData(locPackPath, locString);
      const dataPromise = extractData(dbPackPath, tablesString);
      Promise.all([dataPromise, locPromise])
        .then((consoleOutputs) => {
          createExtractedTimestamp(folder, dbPackName, dbPackPath);
          outputJSONSync(`${cwd}/extracted_files/${folder}/tables.json`, newTables);
          resolve(consoleOutputs.toString());
        })
        .catch((error) => reject(error));
    }
  });
};

export const extractPackfileMulti = (folder: string, dbPackPaths: Array<string>, dbList: Array<string>, forceExtract: boolean) => {
  const dataPromises = dbPackPaths.map((packPath, index) => {
    const packName = path.basename(packPath, '.pack');
    ensureDirSync(`${cwd}/extracted_files/${folder}/subDB${index}`);
    ensureDirSync(`${cwd}/extracted_files/${folder}/subLOC${index}`);
    ensureFileSync(`${cwd}/extracted_files/${folder}/subDB${index}/${packName}`);

    const tablesString = generateTablesString(dbList, `${folder}/subDB${index}`);
    return extractData(packPath, `${tablesString} "/text;./extracted_files/${folder}/subLOC${index}"`);
  });

  return Promise.all(dataPromises);
};

export const extractImages = (folder: string, packPaths: Array<string>, forceExtract: boolean) => {
  let goodPreExtract = true;
  packPaths.forEach((packPath) => {
    const packName = path.basename(packPath, '.pack');
    const oldDbTimestamp = readJSONSync(`${cwd}/extracted_files/${folder}/${packName}_timestamp_img.json`, {
      throws: false,
    });
    const newFileStats = statSync(packPath);
    if (forceExtract || oldDbTimestamp === null || oldDbTimestamp !== newFileStats.mtime.toString()) {
      goodPreExtract = false;
    }
  });

  let imagePromises: Array<Promise<any>> = [];
  if (!goodPreExtract) {
    const tablesString = `"/ui/battle ui/ability_icons;./extracted_files/${folder}" "/ui/campaign ui/effect_bundles;./extracted_files/${folder}" "/ui/campaign ui/skills;./extracted_files/${folder}" "/ui/campaign ui/ancillaries;./extracted_files/${folder}" "/ui/campaign ui/mounts;./extracted_files/${folder}" "/ui/portraits/portholes;./extracted_files/${folder}"`;

    imagePromises = packPaths.map((packPath) => {
      return extractData(packPath, tablesString);
    });
  }

  return Promise.all(imagePromises);
};

const extractPortraits = (folder: string) => {
  const pattern = convertPathToPattern(cwd) + `/extracted_files/${folder}/ui/portraits/portholes/portrait_settings*.bin`;
  const portraitSettingsPaths = sync(pattern);
  const portraitPromises = portraitSettingsPaths.map((portraitSettings) => {
    return new Promise<string | void>((resolve, reject) => {
      const portraitSettingsName = path.basename(portraitSettings, '.bin');
      exec(
        `cd /d ${cwd}&&${rpfmPath} -g ${game} portrait-settings to-json --bin-path "${portraitSettings}" --json-path "./extracted_files/${folder}/ui/portraits/portholes/${portraitSettingsName}.json"`,
        (error) => {
          if (error) {
            resolve(error.message);
          } else {
            fillPortraitGlobalData(folder, globalData, portraitSettings.replace(/.bin$/, '.json'));
            resolve();
          }
        },
      );
    });
  });
  return Promise.all(portraitPromises);
};

export const parseImages = async (folder: string, packPaths: Array<string>, forceExtract: boolean) => {
  const images = await extractImages(folder, packPaths, forceExtract);
  return extractPortraits(folder);
};
