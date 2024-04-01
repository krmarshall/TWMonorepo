import { exec } from 'child_process';
import { emptyDirSync, ensureDirSync, ensureFile, outputFileSync, outputJSONSync, readJSONSync } from 'fs-extra';
import { statSync } from 'fs';
import log from './utils/log';
import { basename } from 'path';
import { promisify } from 'util';
import { GlobalDataInterface } from './@types/GlobalDataInterface';
import { sync } from 'fast-glob';

const execPromise = promisify(exec);

export default class Extractor {
  folder: string;
  game: string;
  rpfmPath: string;
  schemaPath: string;
  nconvertPath: string;
  globalData: GlobalDataInterface;
  constructor(
    folder: string,
    game: string,
    rpfmPath: string,
    schemaPath: string,
    workSpacePath: string,
    nconvertPath: string,
    globalData: GlobalDataInterface,
  ) {
    this.folder = folder;
    this.game = game;
    this.rpfmPath = rpfmPath;
    this.schemaPath = schemaPath;
    this.nconvertPath = nconvertPath;
    this.globalData = globalData;
    process.chdir(workSpacePath);
  }
  #generateTablesString = (dbList: Array<string>, appendString = '') => {
    return dbList.reduce((prev, cur) => {
      return `${prev} "/db/${cur}_tables;./extracted_files/${this.folder}${appendString}"`;
    }, '');
  };

  #generateLocsString = (locList: Array<string>, appendString = '') => {
    return locList.reduce((prev, cur) => {
      return `${prev} "/text/db/${cur}.loc;./extracted_files/${this.folder}${appendString}"`;
    }, '');
  };

  #createExtractedTimestamp = (dbPackName: string, dbPackPath: string, appendString = '') => {
    const fileStats = statSync(dbPackPath);
    outputJSONSync(`./extracted_files/${this.folder}/${dbPackName}_timestamp${appendString}.json`, { time: fileStats.mtime.toString() });
  };

  #checkCachedExtractGood = (packPath: string, newTables: Array<string>, forceExtract: boolean) => {
    const dbPackName = basename(packPath);
    const oldDbTimestamp = readJSONSync(`./extracted_files/${this.folder}/${dbPackName}_timestamp.json`, { throws: false });
    const newFileStats = statSync(`${packPath}.pack`);
    const oldTables = readJSONSync(`./extracted_files/${this.folder}/tables.json`);
    if (
      !forceExtract &&
      oldDbTimestamp !== null &&
      oldDbTimestamp.time === newFileStats.mtime.toString() &&
      oldTables !== null &&
      JSON.stringify(oldTables) === JSON.stringify(newTables)
    ) {
      return true;
    } else {
      return false;
    }
  };

  #extractData = (packPath: string, tablesString: string) => {
    return execPromise(`${this.rpfmPath} -g ${this.game} pack extract -p "${packPath}.pack" -t "${this.schemaPath}" -F ${tablesString}`);
  };

  extractPackfile = (
    dbPackPath: string,
    locPackPath: string,
    dbList: Array<string>,
    locList: Array<string> | undefined,
    forceExtract: boolean,
  ) => {
    return new Promise<void>((resolve, reject) => {
      const newTables = [...dbList];
      newTables.push(...(locList ?? ''));

      const goodCachedExtract = this.#checkCachedExtractGood(dbPackPath, newTables, forceExtract);
      if (goodCachedExtract) {
        log(`Cached extract ${this.folder}`, 'green');
        return resolve();
      } else {
        emptyDirSync(`./extracted_files/${this.folder}`);
      }

      const tablesString = this.#generateTablesString(dbList);
      const locString = locList !== undefined ? this.#generateLocsString(locList) : `"/text;./extracted_files/${this.folder}"`;
      const dataPromise = this.#extractData(dbPackPath, tablesString);
      const locPromise = this.#extractData(locPackPath, locString);

      Promise.all([dataPromise, locPromise])
        .then(() => {
          const dbPackName = basename(dbPackPath);
          this.#createExtractedTimestamp(dbPackName, dbPackPath);
          outputJSONSync(`./extracted_files/${this.folder}/tables.json`, newTables);
          resolve();
        })
        .catch((error) => reject(error));
    });
  };

  extractPackfileMulti = (
    dbPackPaths: Array<string>,
    locPackPaths: Array<string>,
    dbList: Array<string>,
    locList: Array<string> | undefined,
    forceExtract: boolean,
  ) => {
    return new Promise<void>((resolve, reject) => {
      const newTables = [...dbList];
      newTables.push(...(locList ?? ''));

      let goodCachedExtract = true;
      dbPackPaths.forEach((dbPackPath) => {
        if (!this.#checkCachedExtractGood(dbPackPath, newTables, forceExtract)) goodCachedExtract = false;
      });

      if (goodCachedExtract) {
        log(`Cached extract ${this.folder}`, 'green');
        return resolve();
      } else {
        emptyDirSync(`./extracted_files/${this.folder}`);
      }

      const dataPromises = dbPackPaths.map((dbPackPath, index) => {
        const dbPackName = basename(dbPackPath);
        ensureDirSync(`./extracted_files/${this.folder}/subDB${index}`);
        ensureFile(`./extracted_files/${this.folder}/subDB${index}/${dbPackName}`);
        const tablesString = this.#generateTablesString(dbList, `/subDB${index}`);
        return this.#extractData(dbPackPath, tablesString);
      });

      const locPromises = locPackPaths.map((locPackPath, index) => {
        const locPackName = basename(locPackPath);
        ensureDirSync(`./extracted_files/${this.folder}/subLoc${index}`);
        ensureFile(`./extracted_files/${this.folder}/subLoc${index}/${locPackName}`);
        const locString =
          locList !== undefined
            ? this.#generateLocsString(locList, `/subLoc${index}`)
            : `"/text;./extracted_files/${this.folder}/subLoc${index}"`;
        return this.#extractData(locPackPath, locString);
      });

      Promise.all([...dataPromises, ...locPromises])
        .then(() => {
          dbPackPaths.forEach((dbPackPath) => this.#createExtractedTimestamp(basename(dbPackPath), dbPackPath));
          outputJSONSync(`./extracted_files/${this.folder}/tables.json`, newTables);
        })
        .catch((error) => reject(error));
    });
  };

  #extractImages = (packPaths: Array<string>, tech: boolean) => {
    return new Promise<void>((resolve, reject) => {
      let goodCachedExtract = true;
      packPaths.forEach((packPath) => {
        const packName = basename(packPath);
        const oldTimestamp = readJSONSync(`./extracted_files/${this.folder}/${packName}_timestamp_img.json`, { throws: false });
        const newFileStats = statSync(`${packPath}.pack`);
        if (oldTimestamp === null || oldTimestamp.time !== newFileStats.mtime.toString()) {
          goodCachedExtract = false;
        }
      });
      if (goodCachedExtract) {
        return resolve();
      } else {
        emptyDirSync(`./extracted_files/${this.folder}/ui`);
      }

      const imagePromises = packPaths.map((packPath) => {
        let foldersString = `"/ui/battle ui/ability_icons;../extracted_files/${this.folder}" "/ui/campaign ui/effect_bundles;../extracted_files/${this.folder}" "/ui/campaign ui/skills;../extracted_files/${this.folder}" "/ui/campaign ui/ancillaries;../extracted_files/${this.folder}" "/ui/campaign ui/mounts;../extracted_files/${this.folder}" "/ui/portraits/portholes;../extracted_files/${this.folder}"`;
        tech ? (foldersString += ` "/ui/campaign ui/technologies;../extracted_files/${this.folder}"`) : undefined;
        return execPromise(
          `${this.rpfmPath} -g ${this.game} pack extract -p "${packPath}.pack" -t "${this.schemaPath}" -F ${foldersString}`,
        );
      });
      Promise.all(imagePromises)
        .then(() => {
          packPaths.forEach((packPath) => this.#createExtractedTimestamp(basename(packPath), packPath, '_img'));
          resolve();
        })
        .catch((error) => reject(error));
    });
  };

  #convertImages = () => {
    const imageDirs = sync(`./extracted_files/${this.folder}/ui/**/`, {
      markDirectories: true,
      onlyDirectories: true,
      ignore: [`./extracted_files/${this.folder}/ui/portraits/**/`],
    });
    const imagePromises = imageDirs.map((imageDir, index) => {
      const imagePaths = sync(`${imageDir}*.png`);
      if (imagePaths.length !== 0) {
        const splitPath = imageDir.split(`${this.folder}/ui/`);
        let outPath = `../output_img/${this.folder}/${splitPath[splitPath.length - 1]}`;
        outPath = outPath.replaceAll(' ', '_');
        // ensureDirSync(outPath);
        const script = `### -out webp -q 90 -rmeta -quiet -lower -o ${outPath}%`;
        const finalScript = imagePaths.reduce((prev, cur) => {
          const fileSplitPath = cur.split(`${this.folder}/ui/`);
          const filePath = fileSplitPath[fileSplitPath.length - 1].replaceAll(' ', '_').replace('.png', '').toLowerCase();
          this.globalData.imgPaths[this.folder][filePath] = filePath;
          return `${prev}\n.${cur}`;
        }, script);
        outputFileSync(`./bins/nScripts/${this.folder}${index}.txt`, finalScript);
        return execPromise(`${this.nconvertPath} ./nScripts/${this.folder}${index}.txt`, { maxBuffer: 5 * 1024 * 1024 });
      }
    });

    return Promise.all(imagePromises);
  };

  #convertPortraitBins = () => {};
  #fillPortraitGlobalData = () => {};
  #convertPortraits = () => {};
  parseImages = () => {};
}
