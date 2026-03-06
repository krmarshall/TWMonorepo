import express from 'express';
import cors from 'cors';
import path, { dirname } from 'path';
import helmet from 'helmet';
import compression from 'compression';
import fs from 'fs-extra';

import { bulkItemListener, itemListener, skillListener, techListener } from './api.ts';
import setCustomCacheControl from './setCustomCacheControl.ts';
import { initializeData } from './initializeData.ts';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nodeSetMap = fs.readJSONSync('./src/nodeSetMap.json');

const app = express();

initializeData();

app.use(cors());
app.use(helmet());
app.use(compression());

app.set('trust proxy', true);
// Serve rest api
app.get('/api/skills/:modKey.:factionKey.:characterKey.:hasBuild', (req, res) => {
  skillListener(req, res, nodeSetMap);
});
app.get('/api/techs/:modKey.:techTreeKey', (req, res) => {
  techListener(req, res);
});
app.get('/api/bulkItems/:modKey', (req, res) => {
  bulkItemListener(req, res);
});
app.get('/api/item/:modKey.:itemKey', (req, res) => {
  itemListener(req, res);
});

// Serve static front end HTML/JS/Images (actually served by NGINX in prod)
app.use(
  express.static('public', {
    maxAge: '1y',
    setHeaders: setCustomCacheControl,
  }),
);
app.get('/*splat', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});

export default app;
