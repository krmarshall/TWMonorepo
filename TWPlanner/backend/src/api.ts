import type { Request, Response } from 'express';
import { skillData, techData, bulkItemData, itemData } from './initializeData.ts';
import { usageData } from './usageLog.ts';
// import { readFile } from 'fs/promises';

const skillListener = (req: Request, res: Response, nodeSetMap: { [key: string]: string }) => {
  let selectedCharacter = skillData[req.params.modKey]?.[req.params.factionKey]?.[req.params.characterKey];
  if (selectedCharacter === undefined && nodeSetMap[req.params.characterKey] !== undefined) {
    selectedCharacter = skillData[req.params.modKey]?.[req.params.factionKey]?.[nodeSetMap[req.params.characterKey]];
  }
  if (selectedCharacter === undefined) {
    usageData.misses++;
    usageData.missList.add(req.originalUrl);
    return res.sendStatus(404);
  }

  usageData.hits++;
  if (usageData.modHits[req.params.modKey] === undefined) {
    usageData.modHits.other++;
  } else {
    usageData.modHits[req.params.modKey]++;
  }
  if (req.params.hasBuild === 'true') {
    usageData.buildCode++;
  }

  return res.status(200).json(selectedCharacter);
};

// If (when) all the skill trees get too large to reasonable hold in memory consider reading from file instead.
// About half the requests/sec but can be improved a bit if you memoize the readFile.
// SANITIZE USER INPUT IF USING THIS
// const apiListener = (req: Request, res: Response) => {
//   //const selectedCharacter = bulkData[req.params.modKey]?.[req.params.factionKey]?.[req.params.characterKey];
//   readFile(`./src/data/${req.params.modKey}/${req.params.factionKey}/${req.params.characterKey}.json`, 'utf-8')
//     .then((selectedCharacter) => {
//       return res.status(200).json(JSON.parse(selectedCharacter));
//     })
//     .catch((error) => {
//       return res.sendStatus(404);
//     });
// };

const techListener = (req: Request, res: Response) => {
  const selectedTech = techData[req.params.modKey]?.[req.params.techTreeKey];

  if (selectedTech === undefined) {
    return res.sendStatus(404);
  }

  usageData.techHits++;
  return res.status(200).json(selectedTech);
};

const bulkItemListener = (req: Request, res: Response) => {
  const selectedItems = bulkItemData[req.params.modKey];

  if (selectedItems === undefined) {
    return res.sendStatus(404);
  }

  usageData.itemPageHits++;
  return res.status(200).json(selectedItems);
};

const itemListener = (req: Request, res: Response) => {
  const selectedItem = itemData[req.params.modKey][req.params.itemKey];

  if (selectedItem === undefined) {
    return res.sendStatus(404);
  }

  usageData.itemHits++;
  return res.status(200).json(selectedItem);
};

export { skillListener, techListener, bulkItemListener, itemListener };
