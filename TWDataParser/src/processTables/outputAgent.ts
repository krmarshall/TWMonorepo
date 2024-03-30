import { ProcessedAgentInterface } from '../interfaces/ProcessedTreeInterface';
import fse from 'fs-extra';

const outputAgent = (agent: ProcessedAgentInterface, folder: string, subculture: string) => {
  fse.outputJSONSync(`./output/skills/${folder}/${subculture}/${agent.key}.json`, agent, {
    spaces: 2,
  });
};

export default outputAgent;
