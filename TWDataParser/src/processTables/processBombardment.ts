import type { GlobalDataInterface, TableRecord } from '../@types/GlobalDataInterface.ts';
import type { ProjectileBombardmentInterface } from '../@types/CharacterInterface.ts';
import processProjectile from './processProjectile.ts';

const processBombardment = (folder: string, globalData: GlobalDataInterface, bombardment: TableRecord) => {
  const returnBombardment: ProjectileBombardmentInterface = {
    bombardment_key: bombardment.bombardment_key as string,
    arrival_window: bombardment.arrival_window as number,
    radius_spread: bombardment.radius_spread as number,
    start_time: bombardment.start_time as number,
    projectile_type: processProjectile(folder, globalData, bombardment.localRefs?.projectiles as TableRecord),
  };
  if ((bombardment.num_projectiles as number) > 1)
    returnBombardment.num_projectiles = bombardment.num_projectiles as number;

  return returnBombardment;
};

export default processBombardment;
