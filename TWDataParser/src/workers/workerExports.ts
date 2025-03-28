import { Worker } from 'worker_threads';
import {
  ModWorkerDataInterface,
  MultiModWorkerDataInterface,
  VanillaWorkerDataInterface,
} from '../@types/WorkerDataInterfaces.ts';
import log from '../utils/log.ts';
import exportData from '../utils/exportData.ts';

const workerVanilla = (workerData: VanillaWorkerDataInterface) => {
  const { game, folder } = workerData;
  console.time(`${game} total`);
  const workerScript = game === 'warhammer_2' ? './src/workers/worker2.ts' : './src/workers/worker3.ts';
  const workerVanilla = new Worker(workerScript, {
    workerData,
    execArgv: ['--require', 'ts-node/register'],
    name: folder,
  });
  workerVanilla.on('error', (error) => {
    throw error;
  });
  workerVanilla.on('exit', () => {
    console.timeEnd(`${game} total`);
    if (game === 'warhammer_3') {
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
    execArgv: ['--require', 'ts-node/register'],
    name: folder,
  });
  workerMod.on('error', (error) => {
    log(`${folder} failed`, 'red');
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
    execArgv: ['--require', 'ts-node/register'],
    name: folder,
  });
  workerModMulti.on('error', (error) => {
    log(`${folder} failed`, 'red');
    throw error;
  });
  workerModMulti.on('exit', () => {
    console.timeEnd(folder);
  });
};

export { workerVanilla, workerMod, workerModMulti };
