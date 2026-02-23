import { Worker } from 'worker_threads';
import { serialize } from '@ungap/structured-clone';
import type {
  WorkerItemDataInterface,
  WorkerModDataInterface,
  WorkerMultiModDataInterface,
  WorkerVanillaDataInterface,
} from '../@types/WorkerDataInterfaces.ts';
import log from '../utils/log.ts';
import exportData from '../utils/exportData.ts';
import exportSitemap from '../utils/exportSitemap.ts';

const workerRpfmServer = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const workerRpfmServer = new Worker('./src/workers/workerRpfmServer.ts', { name: 'RpfmServer' });
    workerRpfmServer.on('error', (error) => {
      reject(error);
    });
    workerRpfmServer.on('message', (message) => {
      if (message === 'ready') {
        resolve();
      }
    });
  });
};

const workerVanilla = (workerData: WorkerVanillaDataInterface) => {
  const { game, folder } = workerData;
  console.time(`${game} total`);
  const workerScript = game === 'warhammer_2' ? './src/workers/worker2.ts' : './src/workers/worker3.ts';
  const workerVanilla = new Worker(workerScript, {
    workerData,
    name: folder,
    resourceLimits: { stackSizeMb: 512 },
  });
  workerVanilla.on('error', (error: Error) => {
    console.error(error.stack);
    throw error;
  });
  workerVanilla.on('exit', () => {
    console.timeEnd(`${game} total`);
    if (game === 'warhammer_3') {
      exportSitemap();
      exportData();
      // steamworks.js stays open holding the node process running, force close after everything is finished
      process.exit();
    }
  });
  return workerVanilla;
};

const workerMod = (workerData: WorkerModDataInterface) => {
  const { folder } = workerData;
  console.time(folder);
  const workerMod = new Worker('./src/workers/workerMod.ts', {
    workerData,
    name: folder,
  });
  workerMod.on('error', (error: Error) => {
    log(`${folder} failed`, 'red');
    throw error;
  });
  workerMod.on('exit', () => {
    console.timeEnd(folder);
  });
};

const workerModMulti = (workerData: WorkerMultiModDataInterface) => {
  const { folder } = workerData;
  console.time(folder);
  const workerModMulti = new Worker('./src/workers/workerModMulti.ts', {
    workerData,
    name: folder,
  });
  workerModMulti.on('error', (error: Error) => {
    log(`${folder} failed`, 'red');
    throw error;
  });
  workerModMulti.on('exit', () => {
    console.timeEnd(folder);
  });
};

const workerItem = (workerDataParam: WorkerItemDataInterface) => {
  const { folder, tables } = workerDataParam;
  // tables contains classes with functions, and circular references. Have to serialize separately to not throw
  const serializedTables = serialize(tables, { lossy: true });
  const workerData: any = workerDataParam;
  workerData.tables = serializedTables;
  console.time(`${folder} items`);
  const workerItem = new Worker('./src/workers/workerItem.ts', {
    workerData,
    name: `${folder} items`,
    resourceLimits: { stackSizeMb: 512 },
  });
  workerItem.on('error', (error: Error) => {
    log(`${folder} item failed`, 'red');
    throw error;
  });
  workerItem.on('exit', () => {
    console.timeEnd(`${folder} items`);
  });
};

export { workerRpfmServer, workerVanilla, workerMod, workerModMulti, workerItem };
