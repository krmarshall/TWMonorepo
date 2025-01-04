import { CharacterInterface } from '../@types/CharacterInterface.ts';
import { outputJSONSync } from 'fs-extra';

const outputAgent = (agent: CharacterInterface, folder: string, subculture: string) => {
  outputJSONSync(`./output/skills/${folder}/${subculture}/${agent.key}.json`, agent, {
    spaces: 2,
  });
};

export default outputAgent;
