import { readJSONSync, writeJSON } from 'fs-extra';
import modIdMap from '../lists/modIdMap';
import log from './log';
import steamworks from 'steamworks.js';

interface TimeStampInterface {
  [modHeader: string]: { [subMod: string]: number };
}

const modTimestamps = () => {
  const client = steamworks.init(1142710);
  const oldTimestamps = readJSONSync(`${process.env.TWP_DATA_PATH}/modTimestamps.json`);
  const timestampObj: TimeStampInterface = {};
  const promiseArray: Array<Promise<void | Response>> = [];
  Object.entries(modIdMap).forEach((entry) => {
    const modHeader = entry[0];
    const subMods = entry[1];

    timestampObj[modHeader] = {};
    Object.entries(subMods).forEach((subEntry) => {
      const subHeader = subEntry[0];
      const subId = subEntry[1];

      promiseArray.push(
        client.workshop
          .getItem(BigInt(subId))
          .then((workshopItem) => {
            if (workshopItem !== null) {
              if (workshopItem.timeUpdated === undefined) {
                log(`Workshop item missing timestamp: ${subHeader}`, 'yellow');
                timestampObj[modHeader][subHeader] = oldTimestamps[modHeader][subHeader];
              } else {
                timestampObj[modHeader][subHeader] = workshopItem.timeUpdated;
              }
            }
          })
          .catch((error) => {
            log(`Workshop item error ${subHeader}: ${error}`, 'yellow');
          }),
      );
    });
  });

  Promise.all(promiseArray).then(() => {
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
  });
};

export default modTimestamps;
