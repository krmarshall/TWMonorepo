import type { GlobalDataInterface, TableRecord } from '../@types/GlobalDataInterface.ts';
import type { ProjectileBombardmentInterface } from '../@types/CharacterInterface.ts';
import { parseFloating, parseInteger } from '../utils/parseStringToTypes.ts';
import processProjectile from './processProjectile.ts';

const processBombardment = (folder: string, globalData: GlobalDataInterface, bombardment: TableRecord) => {
  const returnBombardment: ProjectileBombardmentInterface = {
    bombardment_key: bombardment.bombardment_key,
    arrival_window: parseFloating(bombardment.arrival_window),
    radius_spread: parseFloating(bombardment.radius_spread),
    start_time: parseFloating(bombardment.start_time),
    projectile_type: processProjectile(folder, globalData, bombardment.localRefs?.projectiles as TableRecord),
  };
  if (parseInteger(bombardment.num_projectiles) > 1)
    returnBombardment.num_projectiles = parseInteger(bombardment.num_projectiles);

  return returnBombardment;
};

export default processBombardment;
