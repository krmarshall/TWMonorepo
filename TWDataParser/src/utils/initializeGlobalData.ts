import { GlobalDataInterface } from '../@types/GlobalDataInterface';

const initializeGlobalData = (folders: Array<string>) => {
  const globalData: GlobalDataInterface = {
    extractedData: {},
    parsedData: {},
    imgPaths: {},
    portraitPaths: {},
  };
  folders.forEach((folder) => {
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
