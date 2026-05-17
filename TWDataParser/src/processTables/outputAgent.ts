import { outputJSONSync } from 'fs-extra/esm';
import type { CharacterInterface } from '../@types/CharacterInterface.ts';

const outputAgent = (agent: CharacterInterface, folder: string, subculture: string) => {
  outputJSONSync(`./output/skills/${folder}/${subculture}/${agent.key}.json`, agent, {
    spaces: 2,
  });
};

export default outputAgent;
