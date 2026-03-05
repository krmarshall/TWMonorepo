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

- Items unlocked by techs (data is already there, just need to display it)
- Boons of Chaos System (Initiatives / Campaign Groups)
- Radial Selector for Agent Variants?

## Adding A Mod

- Find/create an icon for the mod, put into ./src/imgs/games and link with gameImage.ts
- Create appropriate entry in frontend ./src/data/gameData.ts
- Create appropriate entry in backend ./src/usageLog.ts gameList to add it to the usage logs

## Adding Base Game Characters

- All automated now :-) just remember to add their nodeset key to TWDataParser/src/lists/vanillaLists/vanillaCharacter.ts so mods get pruned correctly.
