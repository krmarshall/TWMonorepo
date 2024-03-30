import fg from 'fast-glob';
import { basename } from 'path';
import { GlobalDataInterface } from '../interfaces/GlobalDataInterface';

const initializeGlobalData = (folder: string) => {
  const game = folder.includes('2') ? '2' : '3';
  const globalData: GlobalDataInterface = {
    extractedData: {},
    parsedData: {},
    imgPaths: {},
    portraitPaths: {},
  };
  const modFolders = fg.sync(`./game_source/*${game}/`, { onlyDirectories: true });
  modFolders.forEach((folderPath) => {
    const folder = basename(folderPath);
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
};

export default initializeGlobalData;
