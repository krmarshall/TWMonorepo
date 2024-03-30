import fg from 'fast-glob';
import { exec } from 'child_process';
import fse, { emptyDirSync } from 'fs-extra';
import { GlobalDataInterface } from './interfaces/GlobalDataInterface';
import { statSync } from 'fs';
import { basename } from 'path';
import { promisify } from 'util';

const execPromise = promisify(exec);

const cwd = process.env.CWD + '/bins';

const createExtractedTimestampImg = (folder: string, dbPackName: string) => {
  const fileStats = statSync(`./game_source/${folder}/${dbPackName}.pack`);
  fse.outputJSONSync(`./extracted_files/${folder}/${dbPackName}_timestamp_img.json`, { time: fileStats.mtime.toString() });
};

const extractImages = (folder: string, packNames: Array<string>, game: string, tech: boolean) => {
  const schema = game.includes('2') ? 'schema_wh2.ron' : 'schema_wh3.ron';
  return new Promise<void>((resolve, reject) => {
    let goodPreExtract = true;
    packNames.forEach((packName) => {
      const oldDbTimestamp = fse.readJSONSync(`./extracted_files/${folder}/${packName}_timestamp_img.json`, { throws: false });
      const newFileStats = statSync(`./game_source/${folder}/${packName}.pack`);
      if (oldDbTimestamp === null || oldDbTimestamp.time !== newFileStats.mtime.toString()) {
        goodPreExtract = false;
      }
    });
    if (goodPreExtract) {
      return resolve();
    } else {
      emptyDirSync(`./extracted_files/${folder}/ui`);
    }

    const imagePromises = packNames.map((packName) => {
      return new Promise<void>((resolveI, rejectI) => {
        let foldersString = `"/ui/battle ui/ability_icons;../extracted_files/${folder}" "/ui/campaign ui/effect_bundles;../extracted_files/${folder}" "/ui/campaign ui/skills;../extracted_files/${folder}" "/ui/campaign ui/ancillaries;../extracted_files/${folder}" "/ui/campaign ui/mounts;../extracted_files/${folder}" "/ui/portraits/portholes;../extracted_files/${folder}"`;
        tech ? (foldersString += ` "/ui/campaign ui/technologies;../extracted_files/${folder}"`) : undefined;
        execPromise(
          `rpfm_cli.exe -g ${game} pack extract -p "../game_source/${folder}/${packName}.pack" -t "../rpfm-schemas/${schema}" -F ${foldersString}`,
          { cwd },
        )
          .then(() => resolveI())
          .catch((error) => rejectI(error));
      });
    });
    Promise.all(imagePromises)
      .then(() => {
        packNames.forEach((packName) => createExtractedTimestampImg(folder, packName));
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const convertImages = (folder: string, globalData: GlobalDataInterface) => {
  const imageDirs = fg.sync(`./extracted_files/${folder}/ui/**/`, {
    markDirectories: true,
    onlyDirectories: true,
    ignore: [`./extracted_files/${folder}/ui/portraits/**/`],
  });
  const promises = imageDirs.map((imageDir, index) => {
    return new Promise<void>((resolve, reject) => {
      const imagePaths = fg.sync(`${imageDir}*.png`);
      if (imagePaths.length === 0) {
        resolve();
      } else {
        const splitPath = imageDir.split(`${folder}/ui/`);
        let outPath = `../output_img/${folder}/${splitPath[splitPath.length - 1]}`;
        outPath = outPath.replace(' ', '_');
        // ensureDirSync(outPath);
        const script = `### -out webp -q 90 -rmeta -quiet -lower -o ${outPath}%`;
        const finalScript = imagePaths.reduce((prev, cur) => {
          const fileSplitPath = cur.split(`${folder}/ui/`);
          const filePath = fileSplitPath[fileSplitPath.length - 1].replace(' ', '_').replace('.png', '').toLowerCase();
          globalData.imgPaths[folder][filePath] = filePath;
          return `${prev}\n.${cur}`;
        }, script);
        fse.outputFileSync(`./bins/nScripts/${folder}${index}.txt`, finalScript);
        execPromise(`nconvert.exe ./nScripts/${folder}${index}.txt`, { cwd, maxBuffer: 5 * 1024 * 1024 })
          .then(() => resolve())
          .catch((error) => reject(error));
      }
    });
  });
  return new Promise<void>((resolve, reject) => {
    Promise.all(promises)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const parsePortraits = (folder: string, game: string, globalData: GlobalDataInterface) => {
  return new Promise<void>((resolve, reject) => {
    if (game === 'warhammer_2') {
      return resolve();
    }

    convertPortraitBins(folder, game, globalData)
      .then(() => convertPortraits(folder, globalData))
      .then(() => resolve())
      .catch((error) => reject(error));
  });
};

const convertPortraitBins = (folder: string, game: string, globalData: GlobalDataInterface) => {
  return new Promise<void>((resolve, reject) => {
    const portraitSettingsPaths = fg.sync(`./extracted_files/${folder}/ui/portraits/portholes/portrait_settings__*.bin`);
    const promises = portraitSettingsPaths.map((portraitSetting) => {
      return new Promise<void>((resolveI, rejectI) => {
        const portraitSettingName = basename(portraitSetting, '.bin');
        execPromise(
          `rpfm_cli.exe -g ${game} portrait-settings to-json --bin-path ".${portraitSetting}" --json-path "../extracted_files/${folder}/ui/portraits/portholes/${portraitSettingName}.json"`,
          { cwd },
        )
          .then(() => {
            fillPortraitGlobalData(folder, globalData, portraitSetting.replace(/.bin$/, '.json'));
            resolveI();
          })
          // RPFM cant parse mod bins sometimes, dont throw just pass.
          .catch((error) => resolveI());
      });
    });
    Promise.all(promises)
      .then(() => resolve())
      .catch((error) => reject(error));
  });
};

const fillPortraitGlobalData = (folder: string, globalData: GlobalDataInterface, jsonPath: string) => {
  const portraitSettings = fse.readJSONSync(jsonPath);
  portraitSettings.entries.forEach((entry: { id: string; variants: Array<{ file_diffuse: string }> }) => {
    // art set id's typically end with 01-99 for variants, only want first variant
    if (entry.id.match(/0[2-9]$|[1-9][1-9]$/)) {
      return;
    }
    const imgPath = entry.variants[0].file_diffuse.replace('UI/Portraits/Portholes/', 'ui/portraits/portholes/');
    globalData.portraitPaths[folder][entry.id] = imgPath;
  });
};

const convertPortraits = (folder: string, globalData: GlobalDataInterface) => {
  return new Promise<void>((resolve, reject) => {
    const portraitMap = new Map<string, boolean>();
    const script = `### -canvas 164 164 center -out webp -q 90 -rmeta -quiet -lower -o ../output_portraits/${folder}/%`;
    const finalScript = Object.values(globalData.portraitPaths[folder]).reduce((prev, portraitPath) => {
      if (portraitMap.has(portraitPath)) {
        return prev;
      } else {
        portraitMap.set(portraitPath, true);
        return `${prev}\n../extracted_files/${folder}/${portraitPath}`;
      }
    }, script);
    fse.outputFileSync(`./bins/nScripts/${folder}portraits.txt`, finalScript);
    exec(`nconvert.exe ./nScripts/${folder}portraits.txt`, { cwd, maxBuffer: 5 * 1024 * 1024 }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

const parseImages = (folder: string, packNames: Array<string>, game: string, tech: boolean, globalData: GlobalDataInterface) => {
  return new Promise<void>((resolve, reject) => {
    extractImages(folder, packNames, game, tech)
      .then(() => convertImages(folder, globalData))
      .then(() => parsePortraits(folder, game, globalData))
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default parseImages;
export { fillPortraitGlobalData };
