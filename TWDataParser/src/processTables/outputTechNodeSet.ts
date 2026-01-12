import { outputJSONSync } from 'fs-extra/esm';
import type { TechSetInterface } from '../@types/TechInterface.ts';

const outputTechNodeSet = (techNodeSet: TechSetInterface, folder: string) => {
  outputJSONSync(`./output/techs/${folder}/${techNodeSet.key}.json`, techNodeSet, { spaces: 2 });
};

export default outputTechNodeSet;
