import { exec } from 'child_process';
import { outputFileSync, outputJson, readJSONSync } from 'fs-extra/esm';
import { statSync } from 'fs';
import { basename } from 'path';
import { promisify } from 'util';
import type { GlobalDataInterface } from './@types/GlobalDataInterface.ts';
import fastGlob from 'fast-glob';
import { hardcodePortraitData } from './utils/hardcodeCharList.ts';
import RpfmClient from './rpfmClient.ts';
import { imgFolders } from './lists/extractLists/imgFolders.ts';
import type { PortraitSettings } from './@types/CustomRpfmTypes.ts';
import log from './utils/log.ts';

const execPromise = promisify(exec);

interface CacheInterface {
  packs: Array<string>;
  newestTimestamp: number;
}

export default class Extractor {
  private folder: string;
  private globalData: GlobalDataInterface;
  private packPaths: Array<string>;
  private nconvertPath: string;
  private rpfmClient: RpfmClient;

  constructor(extractorArgs: {
    folder: string;
    packPaths: Array<string>;
    nconvertPath: string;
    globalData: GlobalDataInterface;
    rpfmClient: RpfmClient;
  }) {
    this.folder = extractorArgs.folder;
    this.packPaths = extractorArgs.packPaths;
    this.nconvertPath = extractorArgs.nconvertPath;
    this.globalData = extractorArgs.globalData;
    this.rpfmClient = extractorArgs.rpfmClient;
  }

  private getLatestPackTimestamp = (): number => {
    let latestTimestamp = 0;
    this.packPaths.forEach((pack) => {
      const fileStats = statSync(pack);
      const fileModifiedTime = fileStats.mtime.getTime();
      if (fileModifiedTime > latestTimestamp) {
        latestTimestamp = fileModifiedTime;
      }
    });
    return latestTimestamp;
  };

  private checkCacheValid = (latestPackTimestamp: number): boolean => {
    const oldCacheInfo: CacheInterface = readJSONSync(`./extracted_files/${this.folder}/timestamp.json`, {
      throws: false,
    });
    if (oldCacheInfo === null) {
      return false;
    }
    if (JSON.stringify(oldCacheInfo.packs) !== JSON.stringify(this.packPaths)) {
      return false;
    }
    if (oldCacheInfo.newestTimestamp !== latestPackTimestamp) {
      return false;
    }
    return true;
  };

  private extractImages = async (): Promise<void> => {
    const latestPackTimestamp = this.getLatestPackTimestamp();
    if (this.checkCacheValid(latestPackTimestamp)) {
      return;
    }
    const containerPaths = imgFolders.map((imgFolderPath) => {
      return { Folder: imgFolderPath };
    });
    await this.rpfmClient.extractFiles({ PackFile: containerPaths }, `./extracted_files/${this.folder}/`);
    outputJson(`./extracted_files/${this.folder}/timestamp.json`, {
      packs: this.packPaths,
      newestTimestamp: latestPackTimestamp,
    });
    return;
  };

  private convertImages = async (): Promise<void> => {
    const imageDirs = fastGlob.sync(`./extracted_files/${this.folder}/ui/**/`, {
      markDirectories: true,
      onlyDirectories: true,
      ignore: [`./extracted_files/${this.folder}/ui/portraits/**/`],
    });
    const imagePromises = imageDirs.map((imageDir, index) => {
      const imagePaths = fastGlob.sync(`${imageDir}*.png`);
      if (imagePaths.length !== 0) {
        const splitPath = imageDir.split(`${this.folder}/ui/`);
        let outPath = `./output_img/${this.folder}/${splitPath[splitPath.length - 1]}`;
        outPath = outPath.replaceAll(' ', '_');
        // ensureDirSync(outPath);
        const script = `### -out webp -q 90 -rmeta -quiet -lower -o ${outPath}%`;
        const finalScript = imagePaths.reduce((prev, cur) => {
          const fileSplitPath = cur.split(`${this.folder}/ui/`);
          const filePath = fileSplitPath[fileSplitPath.length - 1]
            .replaceAll(' ', '_')
            .replace('.png', '')
            .toLowerCase();
          this.globalData.imgPaths[this.folder][filePath] = filePath;
          return `${prev}\n${cur}`;
        }, script);
        outputFileSync(`./bins/nScripts/${this.folder}${index}.txt`, finalScript);
        return new Promise<void>((resolve, reject) => {
          execPromise(`${this.nconvertPath} ./bins/nScripts/${this.folder}${index}.txt`, {
            maxBuffer: 5 * 1024 * 1024,
          })
            .then(() => resolve())
            .catch((error) => reject(error));
        });
      }
    });
    await Promise.all(imagePromises);
    return;
  };

  private parsePortraitBins = async () => {
    const portraitSettingsPaths = fastGlob.sync(`./extracted_files/${this.folder}/ui/portraits/portholes/*.bin`);
    const cleanPortraitSettingPaths = portraitSettingsPaths.map((path) =>
      path.replace(`./extracted_files/${this.folder}/`, ''),
    );
    const portraitPromises = cleanPortraitSettingPaths.map(async (binPath) => {
      let portraitSettings: PortraitSettings;
      try {
        portraitSettings = await this.rpfmClient.decodePortraitBin(binPath);
      } catch (error) {
        // log(`Bad Portrait Bin: ${this.folder} | ${binPath}`, 'yellow');
        return;
      }
      portraitSettings.entries.forEach((entry) => {
        // Agents can have multiple portrait variants, just grab the first one and ignore the rest
        if (entry.id.match(/0[2-9]$|[1-9][1-9]$/)) {
          return;
        }
        const imgPath = entry.variants[0].file_diffuse.toLowerCase();
        this.globalData.portraitPaths[this.folder][entry.id] = imgPath;
      });
    });

    Object.entries(hardcodePortraitData).forEach((entry) => {
      const nodeSetKey = entry[0];
      const portraitFile = basename(entry[1], '.webp');
      const portraitPaths = fastGlob.sync(
        `./extracted_files/${this.folder}/ui/portraits/portholes/**/${portraitFile}.png`,
      );
      if (portraitPaths.length !== 0) {
        const path = portraitPaths[0].replace(`./extracted_files/${this.folder}/`, '');
        this.globalData.portraitPaths[this.folder][nodeSetKey] = path;
      }
    });

    await Promise.all(portraitPromises);
    return;
  };

  private convertPortraits = () => {
    const portraitMap = new Map<string, boolean>();
    const script = `### -canvas 164 164 center -out webp -q 90 -rmeta -quiet -lower -o ./output_portraits/${this.folder}/%`;
    const finalScript = Object.values(this.globalData.portraitPaths[this.folder]).reduce((prev, portraitPath) => {
      if (portraitMap.has(portraitPath)) {
        return prev;
      } else {
        portraitMap.set(portraitPath, true);
        return `${prev}\n./extracted_files/${this.folder}/${portraitPath}`;
      }
    }, script);
    outputFileSync(`./bins/nScripts/${this.folder}portraits.txt`, finalScript);
    return new Promise<void>((resolve, reject) => {
      execPromise(`${this.nconvertPath} ./bins/nScripts/${this.folder}portraits.txt`, { maxBuffer: 5 * 1024 * 1024 })
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  };

  extractAndParseImages = async () => {
    await this.extractImages();
    await this.convertImages();
    await this.parsePortraitBins();
    await this.convertPortraits();
    return;
  };
}
