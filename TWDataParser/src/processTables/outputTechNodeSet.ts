import { TechSetInterface } from '../interfaces/TechInterface';
import fse from 'fs-extra';

const outputTechNodeSet = (techNodeSet: TechSetInterface, folder: string) => {
  fse.outputJSONSync(`./output/techs/${folder}/${techNodeSet.key}.json`, techNodeSet, { spaces: 2 });
};

export default outputTechNodeSet;
