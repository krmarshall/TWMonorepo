import express from 'express';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import { readJSONSync } from 'fs-extra';

import { skillListener, techListener } from './api';
import setCustomCacheControl from './setCustomCacheControl';
import { initializeData } from './initializeData';

const nodeSetMap = readJSONSync('./src/nodeSetMap.json');

const app = express();

const origin =
  process.env.NODE_ENV === 'production'
    ? ['https://totalwarhammerplanner.com', 'https://totalwarhammerplanner.com/', 'totalwarhammerplanner.com']
    : ['http://localhost:5000', 'http://localhost:5173'];

initializeData();

// Opening page from google result causes fetches to error on cors even tho origins match z.z disable till find fix
// app.use(
//   cors({
//     origin: origin,
//   })
// );
app.use(cors());
app.use(helmet());
app.use(compression());

// Serve rest api
app.get('/api/skills/:gameKey.:factionKey.:characterKey.:hasBuild', (req, res) => {
  skillListener(req, res, nodeSetMap);
});
app.get('/api/techs/:gameKey.:techTreeKey', (req, res) => {
  techListener(req, res);
});

// Serve static front end HTML/JS/Images
app.use(
  express.static('public', {
    maxAge: '1y',
    setHeaders: setCustomCacheControl,
  }),
);
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});

export default app;
