import type { Request, Response } from 'express';
import { skillData, techData } from './initializeData.ts';
import { usageData } from './usageLog.ts';
// import { readFile } from 'fs/promises';

const skillListener = (req: Request, res: Response, nodeSetMap: { [key: string]: string }) => {
  let selectedCharacter = skillData[req.params.gameKey]?.[req.params.factionKey]?.[req.params.characterKey];
  if (selectedCharacter === undefined && nodeSetMap[req.params.characterKey] !== undefined) {
    selectedCharacter = skillData[req.params.gameKey]?.[req.params.factionKey]?.[nodeSetMap[req.params.characterKey]];
  }
  if (selectedCharacter === undefined) {
    usageData.misses++;
    usageData.missList.add(req.originalUrl);
    return res.sendStatus(404);
  }

  usageData.hits++;
  if (usageData.modHits[req.params.gameKey] === undefined) {
    usageData.modHits.other++;
  } else {
    usageData.modHits[req.params.gameKey]++;
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
//   //const selectedCharacter = bulkData[req.params.gameKey]?.[req.params.factionKey]?.[req.params.characterKey];
//   readFile(`./src/data/${req.params.gameKey}/${req.params.factionKey}/${req.params.characterKey}.json`, 'utf-8')
//     .then((selectedCharacter) => {
//       return res.status(200).json(JSON.parse(selectedCharacter));
//     })
//     .catch((error) => {
//       return res.sendStatus(404);
//     });
// };

const techListener = (req: Request, res: Response) => {
  const selectedTech = techData[req.params.gameKey]?.[req.params.techTreeKey];

  if (selectedTech === undefined) {
    return res.sendStatus(404);
  }

  usageData.techHits++;
  return res.status(200).json(selectedTech);
};

export { skillListener, techListener };
