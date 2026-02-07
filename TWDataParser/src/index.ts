import 'dotenv/config';
import { emptyDirSync } from 'fs-extra/esm';
import { v2DbList, v3DbList } from './lists/extractLists/dbLists.ts';
import { workerRpfmServer, workerVanilla } from './workers/workerExports.ts';
import type { RefKey } from './@types/GlobalDataInterface.ts';
import modTimestamps from './utils/modTimestamps.ts';
import { vanillaPackInfo } from './lists/packInfo.ts';

process.chdir(process.env.CWD as string);

await workerRpfmServer();

emptyDirSync('./output');
emptyDirSync('./output_img');
emptyDirSync('./output_portraits');
emptyDirSync('./bins/nScripts');
emptyDirSync(`./debug`);

modTimestamps();

workerVanilla({
  folder: 'vanilla2',
  packs: vanillaPackInfo.vanilla2,
  dbList: v2DbList as unknown as Array<RefKey>,
  game: 'warhammer_2',
});

workerVanilla({
  folder: 'vanilla3',
  packs: vanillaPackInfo.vanilla3,
  dbList: v3DbList as unknown as Array<RefKey>,
  game: 'warhammer_3',
});
