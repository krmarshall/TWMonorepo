import { readJSONSync, writeJSON } from 'fs-extra/esm';
import { modPackInfo } from '../lists/packInfo.ts';
import log from './log.ts';
import { init } from 'steamworks.js';

interface TimeStampInterface {
  [modHeader: string]: { [subMod: string]: number };
}

const modTimestamps = () => {
  const client = init(1142710);
  const oldTimestamps = readJSONSync(`${process.env.TWP_DATA_PATH}/modTimestamps.json`);
  const timestampObj: TimeStampInterface = {};
  const promiseArray: Array<Promise<void | Response>> = [];
  Object.entries(modPackInfo).forEach((entry) => {
    const modHeader = entry[0];
    const subMods = entry[1];
    timestampObj[modHeader] = {};
    subMods.forEach((subMod) => {
      promiseArray.push(
        client.workshop
          .getItem(BigInt(subMod.id))
          .then((workshopItem) => {
            if (workshopItem !== null) {
              if (workshopItem.timeUpdated === undefined) {
                log(`Workshop item missing timestamp: ${subMod.pack}`, 'yellow');
                timestampObj[modHeader][subMod.pack] = oldTimestamps[modHeader][subMod.pack];
              } else {
                timestampObj[modHeader][subMod.pack] = workshopItem.timeUpdated;
              }
            }
          })
          .catch((error) => log(`Workshop item error ${subMod.pack}: ${error}`, 'yellow')),
      );
    });
  });

  Promise.all(promiseArray)
    .then(() => {
      const sortedObj: TimeStampInterface = {};
      Object.keys(timestampObj)
        .sort()
        .forEach((key) => {
          sortedObj[key] = {};
          Object.keys(timestampObj[key])
            .sort()
            .forEach((subKey) => {
              sortedObj[key][subKey] = timestampObj[key][subKey];
            });
        });
      writeJSON('./output/modTimestamps.json', sortedObj, { spaces: 2 });
    })
    .catch((error) => {
      throw error;
    });
};

export default modTimestamps;
