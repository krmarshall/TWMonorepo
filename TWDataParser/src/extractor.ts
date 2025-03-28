import { exec } from 'child_process';
import { emptyDirSync, ensureDirSync, ensureFile, outputFileSync, outputJSONSync, readJSONSync } from 'fs-extra';
import { statSync } from 'fs';
import log from './utils/log.ts';
import { basename } from 'path';
import { promisify } from 'util';
import { GlobalDataInterface } from './@types/GlobalDataInterface.ts';
import { sync } from 'fast-glob';
import { hardcodePortraitData } from './utils/hardcodeCharList.ts';

const execPromise = promisify(exec);

export default class Extractor {
  #folder: string;
  #game: string;
  #rpfmPath: string;
  #schemaPath: string;
  #nconvertPath: string;
  #globalData: GlobalDataInterface;
  constructor(extractorArgs: {
    folder: string;
    game: string;
    rpfmPath: string;
    schemaPath: string;
    nconvertPath: string;
    globalData: GlobalDataInterface;
  }) {
    this.#folder = extractorArgs.folder;
    this.#game = extractorArgs.game;
    this.#rpfmPath = extractorArgs.rpfmPath;
    this.#schemaPath = extractorArgs.schemaPath;
    this.#nconvertPath = extractorArgs.nconvertPath;
    this.#globalData = extractorArgs.globalData;
  }
  #generateTablesString = (dbList: Array<string>, appendString = '') => {
    return dbList.reduce((prev, cur) => {
      return `${prev} "/db/${cur}_tables;./extracted_files/${this.#folder}${appendString}"`;
    }, '');
  };

  #generateLocsString = (locList: Array<string>, appendString = '') => {
    return locList.reduce((prev, cur) => {
      return `${prev} "/text/db/${cur}.loc;./extracted_files/${this.#folder}${appendString}"`;
    }, '');
  };

  #createExtractedTimestamp = (dbPackName: string, dbPackPath: string, appendString = '') => {
    const fileStats = statSync(`${dbPackPath}.pack`);
    outputJSONSync(`./extracted_files/${this.#folder}/${dbPackName}_timestamp${appendString}.json`, {
      time: fileStats.mtime.toString(),
    });
  };

  #checkCachedExtractGood = (packPath: string, newTables: Array<string>, forceExtract: boolean) => {
    const dbPackName = basename(packPath);
    const oldDbTimestamp = readJSONSync(`./extracted_files/${this.#folder}/${dbPackName}_timestamp.json`, {
      throws: false,
    });
    const newFileStats = statSync(`${packPath}.pack`);
    const oldTables = readJSONSync(`./extracted_files/${this.#folder}/tables.json`, { throws: false });
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
    return new Promise<void>((resolve, reject) => {
      execPromise(
        `${this.#rpfmPath} -g ${this.#game} pack extract -p "${packPath}.pack" -t "${this.#schemaPath}.ron" -F ${tablesString}`,
      )
        .then(() => resolve())
        .catch((error) => reject(error));
    });
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
        log(`Cached extract ${this.#folder}`, 'green');
        return resolve();
      } else {
        emptyDirSync(`./extracted_files/${this.#folder}`);
      }

      const tablesString = this.#generateTablesString(dbList);
      const locString =
        locList !== undefined ? this.#generateLocsString(locList) : `"/text;./extracted_files/${this.#folder}"`;
      const dataPromise = this.#extractData(dbPackPath, tablesString);
      const locPromise = this.#extractData(locPackPath, locString);

      Promise.all([dataPromise, locPromise])
        .then(() => {
          const dbPackName = basename(dbPackPath);
          this.#createExtractedTimestamp(dbPackName, dbPackPath);
          outputJSONSync(`./extracted_files/${this.#folder}/tables.json`, newTables);
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
        log(`Cached extract ${this.#folder}`, 'green');
        return resolve();
      } else {
        emptyDirSync(`./extracted_files/${this.#folder}`);
      }

      const dataPromises = dbPackPaths.map((dbPackPath, index) => {
        const dbPackName = basename(dbPackPath);
        ensureDirSync(`./extracted_files/${this.#folder}/subDB${index}`);
        ensureFile(`./extracted_files/${this.#folder}/subDB${index}/${dbPackName}`);
        const tablesString = this.#generateTablesString(dbList, `/subDB${index}`);
        return this.#extractData(dbPackPath, tablesString);
      });

      const locPromises = locPackPaths.map((locPackPath, index) => {
        const locPackName = basename(locPackPath);
        ensureDirSync(`./extracted_files/${this.#folder}/subLOC${index}`);
        ensureFile(`./extracted_files/${this.#folder}/subLOC${index}/${locPackName}`);
        const locString =
          locList !== undefined
            ? this.#generateLocsString(locList, `/subLOC${index}`)
            : `"/text;./extracted_files/${this.#folder}/subLOC${index}"`;
        return this.#extractData(locPackPath, locString);
      });

      Promise.all([...dataPromises, ...locPromises])
        .then(() => {
          dbPackPaths.forEach((dbPackPath) => this.#createExtractedTimestamp(basename(dbPackPath), dbPackPath));
          outputJSONSync(`./extracted_files/${this.#folder}/tables.json`, newTables);
          resolve();
        })
        .catch((error) => reject(error));
    });
  };

  #extractImages = (packPaths: Array<string>, tech: boolean) => {
    return new Promise<void>((resolve, reject) => {
      let goodCachedExtract = true;
      packPaths.forEach((packPath) => {
        const packName = basename(packPath);
        const oldTimestamp = readJSONSync(`./extracted_files/${this.#folder}/${packName}_timestamp_img.json`, {
          throws: false,
        });
        const newFileStats = statSync(`${packPath}.pack`);
        if (oldTimestamp === null || oldTimestamp.time !== newFileStats.mtime.toString()) {
          goodCachedExtract = false;
        }
      });
      if (goodCachedExtract) {
        return resolve();
      } else {
        emptyDirSync(`./extracted_files/${this.#folder}/ui`);
      }

      const imagePromises = packPaths.map((packPath) => {
        let foldersString = `"/ui/battle ui/ability_icons;./extracted_files/${this.#folder}" "/ui/campaign ui/effect_bundles;./extracted_files/${this.#folder}" "/ui/campaign ui/skills;./extracted_files/${this.#folder}" "/ui/campaign ui/ancillaries;./extracted_files/${this.#folder}" "/ui/campaign ui/mounts;./extracted_files/${this.#folder}" "/ui/portraits/portholes;./extracted_files/${this.#folder}"`;
        if (tech) foldersString += ` "/ui/campaign ui/technologies;./extracted_files/${this.#folder}"`;
        return new Promise<void>((resolveI, rejectI) => {
          execPromise(
            `${this.#rpfmPath} -g ${this.#game} pack extract -p "${packPath}.pack" -t "${this.#schemaPath}.ron" -F ${foldersString}`,
          )
            .then(() => resolveI())
            .catch((error) => rejectI(error));
        });
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
    const imageDirs = sync(`./extracted_files/${this.#folder}/ui/**/`, {
      markDirectories: true,
      onlyDirectories: true,
      ignore: [`./extracted_files/${this.#folder}/ui/portraits/**/`],
    });
    const imagePromises = imageDirs.map((imageDir, index) => {
      const imagePaths = sync(`${imageDir}*.png`);
      if (imagePaths.length !== 0) {
        const splitPath = imageDir.split(`${this.#folder}/ui/`);
        let outPath = `./output_img/${this.#folder}/${splitPath[splitPath.length - 1]}`;
        outPath = outPath.replaceAll(' ', '_');
        // ensureDirSync(outPath);
        const script = `### -out webp -q 90 -rmeta -quiet -lower -o ${outPath}%`;
        const finalScript = imagePaths.reduce((prev, cur) => {
          const fileSplitPath = cur.split(`${this.#folder}/ui/`);
          const filePath = fileSplitPath[fileSplitPath.length - 1]
            .replaceAll(' ', '_')
            .replace('.png', '')
            .toLowerCase();
          this.#globalData.imgPaths[this.#folder][filePath] = filePath;
          return `${prev}\n${cur}`;
        }, script);
        outputFileSync(`./bins/nScripts/${this.#folder}${index}.txt`, finalScript);
        return new Promise<void>((resolve, reject) => {
          execPromise(`${this.#nconvertPath} ./bins/nScripts/${this.#folder}${index}.txt`, {
            maxBuffer: 5 * 1024 * 1024,
          })
            .then(() => resolve())
            .catch((error) => reject(error));
        });
      }
    });

    return Promise.all(imagePromises);
  };

  #convertPortraitBins = () => {
    const portraitSettingsPaths = sync(`./extracted_files/${this.#folder}/ui/portraits/portholes/*.bin`);
    const portraitPromises = portraitSettingsPaths.map((portraitSettingsPath) => {
      return new Promise<void>((resolve, reject) => {
        const portraitSettingsName = basename(portraitSettingsPath, '.bin');
        execPromise(
          `${this.#rpfmPath} -g ${this.#game} portrait-settings to-json --bin-path "${portraitSettingsPath}" --json-path "./extracted_files/${this.#folder}/ui/portraits/portholes/${portraitSettingsName}.json"`,
        )
          .then(() => {
            this.#fillPortraitGlobalData(portraitSettingsPath.replace(/.bin$/, '.json'));
            resolve();
          })
          .catch(() => {
            // log(`Bad portrait bin:${portraitSettingsPath}`, 'yellow');
            resolve();
          });
      });
    });

    return Promise.all(portraitPromises);
  };
  #fillPortraitGlobalData = (jsonPath: string) => {
    const portraitSettings = readJSONSync(jsonPath);
    portraitSettings.entries.forEach((entry: { id: string; variants: Array<{ file_diffuse: string }> }) => {
      // art set id's typically end with 01-99 for variants, only want first variant
      if (entry.id.match(/0[2-9]$|[1-9][1-9]$/)) {
        return;
      }
      const imgPath = entry.variants[0].file_diffuse.toLowerCase();
      this.#globalData.portraitPaths[this.#folder][entry.id] = imgPath;
    });

    Object.entries(hardcodePortraitData).forEach((entry) => {
      const nodeSetKey = entry[0];
      const portraitFile = basename(entry[1], '.webp');
      const portraitPaths = sync(`./extracted_files/${this.#folder}/ui/portraits/portholes/**/${portraitFile}.png`);
      if (portraitPaths.length !== 0) {
        const path = portraitPaths[0].replace(`./extracted_files/${this.#folder}/`, '');
        this.#globalData.portraitPaths[this.#folder][nodeSetKey] = path;
      }
    });
  };
  #convertPortraits = () => {
    const portraitMap = new Map<string, boolean>();
    const script = `### -canvas 164 164 center -out webp -q 90 -rmeta -quiet -lower -o ./output_portraits/${this.#folder}/%`;
    const finalScript = Object.values(this.#globalData.portraitPaths[this.#folder]).reduce((prev, portraitPath) => {
      if (portraitMap.has(portraitPath)) {
        return prev;
      } else {
        portraitMap.set(portraitPath, true);
        return `${prev}\n./extracted_files/${this.#folder}/${portraitPath}`;
      }
    }, script);
    outputFileSync(`./bins/nScripts/${this.#folder}portraits.txt`, finalScript);
    return new Promise<void>((resolve, reject) => {
      execPromise(`${this.#nconvertPath} ./bins/nScripts/${this.#folder}portraits.txt`, { maxBuffer: 5 * 1024 * 1024 })
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  };
  parseImages = (packPaths: Array<string>, tech: boolean) => {
    return new Promise<void>((resolve, reject) => {
      this.#extractImages(packPaths, tech)
        .then(() => this.#convertImages())
        .then(() => this.#convertPortraitBins())
        .then(() => this.#convertPortraits())
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  };
}
