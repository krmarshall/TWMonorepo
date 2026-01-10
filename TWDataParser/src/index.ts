import 'dotenv/config';
import { emptyDirSync } from 'fs-extra';
import { v3DbList, v3LocList } from './lists/extractLists/vanilla3.ts';
import { workerVanilla } from './workers/workerExports.ts';
import { RefKey } from './@types/GlobalDataInterface.ts';
import { v2DbList, v2LocList } from './lists/extractLists/vanilla2.ts';
import modTimestamps from './utils/modTimestamps.ts';
import { vanillaPackInfo } from './lists/packInfo.ts';

process.chdir(process.env.CWD as string);

emptyDirSync('./output');
emptyDirSync('./output_img');
emptyDirSync('./output_portraits');
emptyDirSync('./bins/nScripts');
emptyDirSync(`./debug`);

modTimestamps();

workerVanilla({
  folder: 'vanilla2',
  dbPackName: vanillaPackInfo.vanilla2.db,
  locPackName: vanillaPackInfo.vanilla2.loc,
  dbList: v2DbList as unknown as Array<RefKey>,
  locList: v2LocList,
  game: 'warhammer_2',
});

workerVanilla({
  folder: 'vanilla3',
  dbPackName: vanillaPackInfo.vanilla3.db,
  locPackName: vanillaPackInfo.vanilla3.loc,
  dbList: v3DbList as unknown as Array<RefKey>,
  locList: v3LocList,
  game: 'warhammer_3',
});
