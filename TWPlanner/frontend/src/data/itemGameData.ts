import { ItemDataInterface } from '../@types/DataInterfaces.ts';
import gameImages from '../imgs/games/gameImages.ts';
import gameData from './gameData.ts';

import modTimestamps from '../../../TWPData/modTimestamps.json';
import { toParsedDateString } from '../utils/dateFunctions.ts';

const itemGameData: Record<string, ItemDataInterface> = {
  vanilla2: {
    text: gameData.vanilla2.text,
    image: gameData.vanilla2.image,
    updated: gameData.vanilla2.updated,
  },
  vanilla3: {
    text: gameData.vanilla3.text,
    image: gameData.vanilla3.image,
    updated: gameData.vanilla3.updated,
  },
  s5a3: {
    text: 'Stompie5 Artifacts',
    image: gameImages.s5a3,
    updated: toParsedDateString(modTimestamps.s5a3.stompies_new_artefacts),
    workshopLink: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2790444477',
  },
};

export default itemGameData;
