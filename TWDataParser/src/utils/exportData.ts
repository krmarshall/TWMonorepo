import { copySync, emptyDirSync, removeSync } from 'fs-extra';
import log from '../utils/log.ts';

const exportData = () => {
  copySync(`./override_portraits`, './output_portraits');
  copySync(`./output_portraits`, '../TWPlanner/frontend/public/portraits', { overwrite: false });
  copySync(`./output_img`, '../TWPlanner/frontend/public/imgs', { overwrite: false });

  emptyDirSync(process.env.TWP_DATA_PATH + '/skills');
  emptyDirSync(process.env.TWP_DATA_PATH + '/techs');
  emptyDirSync(process.env.TWP_DATA_PATH + '/compGroups');
  emptyDirSync(process.env.TWP_DATA_PATH + '/charLists');
  removeSync(process.env.TWP_DATA_PATH + '/modTimestamps.json');

  copySync(process.env.CWD + '/output', process.env.TWP_DATA_PATH as string);
  log('Data Exported', 'green');
};

export default exportData;
