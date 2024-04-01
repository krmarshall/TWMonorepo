import * as dotenv from 'dotenv';
dotenv.config();
import { emptyDirSync } from 'fs-extra';
import { v3DbList, v3LocList } from './lists/extractLists/vanilla3';
import { workerVanilla } from './workers/workerExports';
import { RefKey } from './@types/GlobalDataInterface';
import { v2DbList, v2LocList } from './lists/extractLists/vanilla2';
import { SchemaInterface } from './@types/SchemaInterfaces';
import modTimestamps from './utils/modTimestamps';
import { vanillaPackInfo } from './lists/packInfo';

import schema3 from '../bins/jsonSchemas/schema_wh3.json';
import schema2 from '../bins/jsonSchemas/schema_wh2.json';

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
  tech: true,
  schema: schema2 as SchemaInterface,
  pruneVanilla: false,
});

workerVanilla({
  folder: 'vanilla3',
  dbPackName: vanillaPackInfo.vanilla3.db,
  locPackName: vanillaPackInfo.vanilla3.loc,
  dbList: v3DbList as unknown as Array<RefKey>,
  locList: v3LocList,
  game: 'warhammer_3',
  tech: true,
  schema: schema3 as SchemaInterface,
  pruneVanilla: false,
});
