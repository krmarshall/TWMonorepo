import { GlobalDataInterface } from '../@types/GlobalDataInterface';

const findImage = (folder: string, globalData: GlobalDataInterface, searchArray: Array<string>, icon: string) => {
  const vanillaGame = folder.includes('2') ? 'vanilla2' : 'vanilla3';

  const modIcon = searchArray.find((searchPathArg) => {
    const searchPath = searchPathArg.replaceAll(' ', '_');
    if (globalData.imgPaths[folder][searchPath] !== undefined) {
      return true;
    }
    return false;
  });
  if (modIcon !== undefined) {
    return `${folder}/${modIcon}`;
  }

  const vanillaIcon = searchArray.find((searchPathArg) => {
    const searchPath = searchPathArg.replaceAll(' ', '_');
    if (globalData.imgPaths[vanillaGame][searchPath] !== undefined) {
      return true;
    }
    return false;
  });
  if (vanillaIcon !== undefined) {
    return `${vanillaGame}/${vanillaIcon}`;
  }

  return icon;
};

export default findImage;
