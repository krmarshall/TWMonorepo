# TotalWarhammerPlanner

Complete rebuild using extracted data.

## Frontend

Built using Vite, React, Typescript, and Tailwind.

## Backend

Built using NodeJS, Express, Typescript

## Commands

npm run dev - Runs both frontend and backend in dev mode, reloading on any saved changes.

npm run start - Installs and builds the frontend into the backend ./public/ folder, then installs and builds the backend from typescript and runs the server.

## To Do

- Transition to eslint flat config (or biome at some point)
- Work on overall page style
- Affected unit cards
- Boons of Chaos System
- Radial Selector for Agent Variants?

## Adding A Mod

- Copy over json data to TWPData repo
- Copy over auto extracted and manually extracted images to respective frontend ./src/imgs or ./public/imgs
- Make sure to set up characterImgs export in ./src/imgs/characters/<mod>
- Create appropriate mod character list in frontend ./src/data, may have to look around rpfm for actual character names
- Find/create an icon for the mod, put into ./src/imgs/games and link with gameImage.ts
- Create appropriate entry in frontend ./src/data/gameData
- Create appropriate entry in backend ./__tests__/characterApi.js gameList to add it to the test suite
- Create appropriate entry in backend ./src/usageLog.ts gameList to add it to the usage logs

## Adding Base Game Characters

- Copy over json data to TWPData repo
- Copy over portrait to ./src/imgs/characters/<gameFolder>, be sure to crop and mask portrait to 164x164
- Update characterImgs export in ./src/imgs/characters/<gameFolder>
- Update character list in ./src/data/characters/<gameFile>, may have to look around rpfm for actual character names
