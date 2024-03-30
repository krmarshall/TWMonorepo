import { outputJSONSync } from 'fs-extra';
import { TechSetInterface } from '../@types/TechInterface';

const outputTechNodeSet = (techNodeSet: TechSetInterface, folder: string) => {
  outputJSONSync(`./output/techs/${folder}/${techNodeSet.key}.json`, techNodeSet, { spaces: 2 });
};

export default outputTechNodeSet;
