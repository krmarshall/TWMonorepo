import 'dotenv/config';
import { emptyDirSync } from 'fs-extra/esm';
import { v2DbList, v3DbList } from './lists/extractLists/dbLists.ts';
import { workerRpfmServer, workerVanilla } from './workers/workerExports.ts';
import modTimestamps from './utils/modTimestamps.ts';
import { vanillaPackInfo } from './lists/packInfo.ts';
import RpfmClient from './rpfmClient.ts';
import type { RefKey } from './@types/GlobalDataInterface.ts';

process.chdir(process.env.CWD as string);

await workerRpfmServer();

const rpfmClient = new RpfmClient();
await rpfmClient.init();
await rpfmClient.setGame('warhammer_3', true);
await rpfmClient.openPacks([
  'D:/Steam/steamapps/common/Total War WARHAMMER III/data/db.pack',
  'D:/Steam/steamapps/common/Total War WARHAMMER III/data/local_en.pack',
  'D:/Steam/steamapps/common/Total War WARHAMMER III/data/ui.pack',
]);
const test = await rpfmClient.getTableDefinition('technology_ui_groups');

console.log(test);

// emptyDirSync('./output');
// emptyDirSync('./output_img');
// emptyDirSync('./output_portraits');
// emptyDirSync('./bins/nScripts');
// emptyDirSync(`./debug`);

// modTimestamps();

// workerVanilla({
//   folder: 'vanilla2',
//   packs: vanillaPackInfo.vanilla2,
//   dbList: v2DbList as unknown as Array<RefKey>,
//   game: 'warhammer_2',
// });

// workerVanilla({
//   folder: 'vanilla3',
//   packs: vanillaPackInfo.vanilla3,
//   dbList: v3DbList as unknown as Array<RefKey>,
//   game: 'warhammer_3',
// });
