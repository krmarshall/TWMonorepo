import { ItemDataInterface } from '../@types/DataInterfaces.ts';
import gameData from './gameData.ts';

const itemGameData: Record<string, ItemDataInterface> = {
  vanilla2: {
    text: gameData.vanilla2.text,
    image: gameData.vanilla2.image,
    updated: gameData.vanilla2.updated,
    category: gameData.vanilla2.category,
  },
  vanilla3: {
    text: gameData.vanilla3.text,
    image: gameData.vanilla3.image,
    updated: gameData.vanilla3.updated,
    category: gameData.vanilla3.category,
  },
};

export default itemGameData;
