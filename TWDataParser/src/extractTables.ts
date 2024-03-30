import { exec } from 'child_process';
import fse, { emptyDirSync } from 'fs-extra';
import { statSync } from 'fs';
import log from './utils/log';

const cwd = process.env.CWD + '/bins';

const createExtractedTimestamp = (folder: string, dbPackName: string) => {
  const fileStats = statSync(`./game_source/${folder}/${dbPackName}.pack`);
  fse.outputJSONSync(`./extracted_files/${folder}/${dbPackName}_timestamp.json`, { time: fileStats.mtime.toString() });
};

const extractData = (folder: string, dbPackName: string, tablesString: string, game: string, inputFolder = folder) => {
  const schema = game.includes('2') ? 'schema_wh2.ron' : 'schema_wh3.ron';
  return new Promise<void>((resolveI, rejectI) => {
    exec(
      `rpfm_cli.exe -g ${game} pack extract -p "../game_source/${inputFolder}/${dbPackName}.pack" -t "../rpfm-schemas/${schema}" -F ${tablesString}`,
      { cwd },
      (error) => {
        if (error) {
          rejectI(error);
        } else {
          resolveI();
        }
      },
    );
  });
};

const extractLoc = (folder: string, locPackName: string, locsString: string, game: string, inputFolder = folder) => {
  const schema = game.includes('2') ? 'schema_wh2.ron' : 'schema_wh3.ron';
  return new Promise<void>((resolveI, rejectI) => {
    exec(
      `rpfm_cli.exe -g ${game} pack extract -p "../game_source/${inputFolder}/${locPackName}.pack" -t "../rpfm-schemas/${schema}" -f ${locsString}`,
      { cwd },
      (error) => {
        if (error) {
          rejectI(error);
        } else {
          resolveI();
        }
      },
    );
  });
};

const extractLocBulk = (folder: string, locPackName: string, game: string, inputFolder = folder) => {
  const schema = game.includes('2') ? 'schema_wh2.ron' : 'schema_wh3.ron';
  return new Promise<void>((resolve, reject) => {
    exec(
      `rpfm_cli.exe -g ${game} pack extract -p "../game_source/${inputFolder}/${locPackName}.pack" -t "../rpfm-schemas/${schema}" -F "/text;../extracted_files/${folder}"`,
      { cwd },
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      },
    );
  });
};

const generateTablesString = (dbList: Array<string>, folder: string) => {
  return dbList.reduce((prev, cur) => {
    return `${prev} "/db/${cur}_tables;../extracted_files/${folder}"`;
  }, '');
};

const generateLocsString = (locList: Array<string>, folder: string) => {
  return locList.reduce((prev, cur) => {
    return `${prev} "/text/db/${cur}.loc;../extracted_files/${folder}"`;
  }, '');
};

const extractPackfileMass = (
  folder: string,
  dbPackName: string,
  locPackName: string,
  dbList: Array<string>,
  locList: Array<string> | undefined,
  game: string,
) => {
  return new Promise<void>((resolve, reject) => {
    const tablesString = generateTablesString(dbList, folder);

    const oldDbTimestamp = fse.readJSONSync(`./extracted_files/${folder}/${dbPackName}_timestamp.json`, { throws: false });
    const newFileStats = statSync(`./game_source/${folder}/${dbPackName}.pack`);
    const oldTables = fse.readJSONSync(`./extracted_files/${folder}/tables.json`, { throws: false });
    const newTables = dbList;
    if (
      oldDbTimestamp !== null &&
      oldDbTimestamp.time === newFileStats.mtime.toString() &&
      oldTables !== null &&
      JSON.stringify(oldTables) === JSON.stringify(newTables)
    ) {
      log(`Pre-extract ${folder}`, 'green');
      return resolve();
    } else {
      emptyDirSync(`./extracted_files/${folder}`);
    }

    // If a locList isnt provided, just extract every loc file alongside the dbs, useful for mods, too much data for vanilla games.
    if (locList === undefined && dbPackName === locPackName) {
      extractData(folder, dbPackName, tablesString + ` "/text;../extracted_files/${folder}"`, game)
        .then(() => {
          createExtractedTimestamp(folder, dbPackName);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      const locsString = generateLocsString(locList as Array<string>, folder);
      const locPromise = extractLoc(folder, locPackName, locsString, game);
      const dataPromise = extractData(folder, dbPackName, tablesString, game);

      Promise.all([dataPromise, locPromise])
        .then(() => {
          createExtractedTimestamp(folder, dbPackName);
          fse.outputJSONSync(`./extracted_files/${folder}/tables.json`, dbList);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

const extractPackfileMulti = (
  folder: string,
  dbPackNames: Array<string>,
  locPackNames: Array<string>,
  dbList: Array<string>,
  locList: Array<string> | undefined,
  game: string,
) => {
  return new Promise<void>((resolve, reject) => {
    let goodPreExtract = true;
    dbPackNames.forEach((dbPackName) => {
      const oldDbTimestamp = fse.readJSONSync(`./extracted_files/${folder}/${dbPackName}_timestamp.json`, { throws: false });
      const newFileStats = statSync(`./game_source/${folder}/${dbPackName}.pack`);
      if (oldDbTimestamp === null || oldDbTimestamp.time !== newFileStats.mtime.toString()) {
        goodPreExtract = false;
      }
    });
    const oldTables = fse.readJSONSync(`./extracted_files/${folder}/tables.json`, { throws: false });
    const newTables = dbList;
    if (goodPreExtract && oldTables !== null && JSON.stringify(oldTables) === JSON.stringify(newTables)) {
      log(`Pre-extract ${folder}`, 'green');
      return resolve();
    } else {
      emptyDirSync(`./extracted_files/${folder}`);
    }

    // If a locList isnt provided, just extract every loc file alongside the dbs, useful for mods, too much data for vanilla games.
    let dataPromises;
    let locPromises;
    if (locList === undefined && JSON.stringify(dbPackNames) === JSON.stringify(locPackNames)) {
      locPromises = locPackNames.map((locPackName, index) => {
        fse.ensureDirSync(`./extracted_files/${folder}/subDB${index}`);
        fse.ensureDirSync(`./extracted_files/${folder}/subLOC${index}`);
        fse.ensureFile(`./extracted_files/${folder}/subDB${index}/${locPackName}`);

        const tablesString = generateTablesString(dbList, folder + `/subDB${index}`);
        return extractData(
          folder + `/subDB${index}`,
          locPackName,
          tablesString + ` "/text;../extracted_files/${folder}/subLOC${index}"`,
          game,
          folder,
        );
      });
    } else {
      dataPromises = dbPackNames.map((dbPackName, index) => {
        fse.ensureDirSync(`./extracted_files/${folder}/subDB${index}`);
        fse.ensureFile(`./extracted_files/${folder}/subDB${index}/${dbPackName}`);

        const tablesString = generateTablesString(dbList, folder + `/subDB${index}`);
        return extractData(folder + `/subDB${index}`, dbPackName, tablesString, game, folder);
      });

      locPromises = locPackNames.map((locPackName, index) => {
        fse.ensureDirSync(`./extracted_files/${folder}/subLOC${index}`);
        const locsString = generateLocsString(locList as Array<string>, folder + `/subLOC${index}`);
        return extractLoc(folder + `/subLOC${index}`, locPackName, locsString, game, folder);
      });
    }
    const promiseArray = [...locPromises];
    if (dataPromises !== undefined) {
      promiseArray.push(...dataPromises);
    }
    Promise.all(promiseArray)
      .then(() => {
        dbPackNames.forEach((dbPackName) => createExtractedTimestamp(folder, dbPackName));
        fse.outputJSONSync(`./extracted_files/${folder}/tables.json`, dbList);
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export { extractPackfileMass, extractPackfileMulti };
