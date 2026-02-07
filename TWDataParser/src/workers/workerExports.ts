import { Worker } from 'worker_threads';
import type {
  ModWorkerDataInterface,
  MultiModWorkerDataInterface,
  VanillaWorkerDataInterface,
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

const workerVanilla = (workerData: VanillaWorkerDataInterface) => {
  const { game, folder } = workerData;
  console.time(`${game} total`);
  const workerScript = game === 'warhammer_2' ? './src/workers/worker2.ts' : './src/workers/worker3.ts';
  const workerVanilla = new Worker(workerScript, {
    workerData,
    name: folder,
  });
  workerVanilla.on('error', (error) => {
    console.error(error);
    throw error;
  });
  workerVanilla.on('exit', () => {
    console.timeEnd(`${game} total`);
    if (game === 'warhammer_3') {
      exportSitemap();
      exportData();
      // steamworks.js doesnt seem to be intended for scripts like this, stays open holding the node process running
      // force close after everything is finished
      process.exit();
    }
  });
  return workerVanilla;
};

const workerMod = (workerData: ModWorkerDataInterface) => {
  const { folder } = workerData;
  console.time(folder);
  const workerMod = new Worker('./src/workers/workerMod.ts', {
    workerData,
    name: folder,
  });
  workerMod.on('error', (error) => {
    log(`${folder} failed`, 'red');
    console.error(error);
    throw error;
  });
  workerMod.on('exit', () => {
    console.timeEnd(folder);
  });
};

const workerModMulti = (workerData: MultiModWorkerDataInterface) => {
  const { folder } = workerData;
  console.time(folder);
  const workerModMulti = new Worker('./src/workers/workerModMulti.ts', {
    workerData,
    name: folder,
  });
  workerModMulti.on('error', (error) => {
    log(`${folder} failed`, 'red');
    console.error(error);
    throw error;
  });
  workerModMulti.on('exit', () => {
    console.timeEnd(folder);
  });
};

export { workerRpfmServer, workerVanilla, workerMod, workerModMulti };
