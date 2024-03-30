import fse from 'fs-extra';
import log from '../utils/log';

const exportData = () => {
  fse.emptyDirSync(process.env.TWP_DATA_PATH + '/skills');
  fse.emptyDirSync(process.env.TWP_DATA_PATH + '/techs');
  fse.emptyDirSync(process.env.TWP_DATA_PATH + '/compGroups');
  fse.removeSync(process.env.TWP_DATA_PATH + '/modTimestamps.json');

  fse.copySync(process.env.CWD + '/output', process.env.TWP_DATA_PATH as string);
  log('Data Exported', 'green');
};

export default exportData;
