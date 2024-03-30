import { GlobalDataInterface, TableRecord } from '../interfaces/GlobalDataInterface';
import { ProjectileBombardmentInterface } from '../interfaces/ProcessedTreeInterface';
import { parseFloating, parseInteger } from '../utils/parseStringToTypes';
import processProjectile from './processProjectile';

const processBombardment = (folder: string, globalData: GlobalDataInterface, bombardment: TableRecord) => {
  const returnBombardment: ProjectileBombardmentInterface = {
    bombardment_key: bombardment.bombardment_key,
    arrival_window: parseFloating(bombardment.arrival_window),
    radius_spread: parseFloating(bombardment.radius_spread),
    start_time: parseFloating(bombardment.start_time),
    projectile_type: processProjectile(folder, globalData, bombardment.localRefs?.projectiles as TableRecord),
  };
  if (parseInteger(bombardment.num_projectiles) > 1) returnBombardment.num_projectiles = parseInteger(bombardment.num_projectiles);

  return returnBombardment;
};

export default processBombardment;
