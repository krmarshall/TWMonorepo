# TWMonorepo

## TW Data Parser

Requires steam to be running for the steamworks api
yarn parser:dev
yarn parser:build

## TW Planner

yarn planner:dev
yarn planner:build
yarn planner:test

## TW Inspector

Electron Forge does not support npm workspaces, so does not share dependencies like the rest 🙃
yarn inspector:def
yarn inspector:build
