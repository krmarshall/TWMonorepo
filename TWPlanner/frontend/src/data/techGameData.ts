import { TechDataInterface } from '../@types/GameInterface.ts';
import gameData from './gameData.ts';
import vanilla2Techs from './techs/vanilla2Techs.ts';
import vanilla3Techs from './techs/vanilla3Techs.ts';
import radious3Techs from './techs/radious3Techs.ts';
import sfo33Techs from './techs/sfo3Techs.ts';

const techGameData: { [key: string]: TechDataInterface } = {
  vanilla2: {
    text: gameData.vanilla2.text,
    image: gameData.vanilla2.image,
    updated: gameData.vanilla2.updated,
    category: gameData.vanilla2.category,
    techTrees: vanilla2Techs,
  },
  vanilla3: {
    text: gameData.vanilla3.text,
    image: gameData.vanilla3.image,
    updated: gameData.vanilla3.updated,
    category: gameData.vanilla3.category,
    techTrees: vanilla3Techs,
  },
  radious3: {
    text: gameData.radious3.text,
    image: gameData.radious3.image,
    updated: gameData.radious3.updated,
    category: gameData.radious3.category,
    techTrees: radious3Techs,
  },
  sfo3: {
    text: gameData.sfo3.text,
    image: gameData.sfo3.image,
    updated: gameData.sfo3.updated,
    category: gameData.sfo3.category,
    techTrees: sfo33Techs,
  },
};

export default techGameData;
