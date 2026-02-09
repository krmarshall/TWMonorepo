import { spawn } from 'node:child_process';
import { parentPort } from 'worker_threads';
import RpfmClient from '../rpfmClient.ts';

const serverIp = process.env.RPFM_SERVER_IP;
const rpfmServer = spawn(process.env.RPFM_PATH);

let errBuffer = '';
let init = false;
rpfmServer.stderr.on('data', async (data) => {
  // Wait for server to be listening for requests
  const dataString = data.toString();
  if (!init) {
    errBuffer += dataString;
    if (errBuffer.includes(`Listening on ${serverIp}`)) {
      init = true;

      // Create a web socket to check for schema updates
      const client = new RpfmClient();
      await client.init();
      const schemaResponse = await client.updateSchemas();
      console.log(schemaResponse);

      // Tell main process the server is ready
      parentPort.postMessage('ready');
    }
  }
});

// Send server output to console for debugging
// rpfmServer.stdout.on('data', (data) => console.log(data.toString()));
// rpfmServer.stderr.on('data', (data) => console.error(data.toString()));

parentPort.on('message', (message) => {
  if (message === 'kill') {
    rpfmServer.kill();
  }
});
