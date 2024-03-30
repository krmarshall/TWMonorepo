import { GlobalDataInterface, TableRecord } from '../interfaces/GlobalDataInterface';
import { VortexInterface } from '../interfaces/ProcessedTreeInterface';
import { parseBoolean, parseFloating, parseInteger } from '../utils/parseStringToTypes';
import processPhase from './processPhase';

const processVortex = (folder: string, globalData: GlobalDataInterface, vortex: TableRecord) => {
  const returnVortex: VortexInterface = {
    vortex_key: vortex.vortex_key,
    duration: parseFloating(vortex.duration),
    damage: parseFloating(vortex.damage),
    damage_ap: parseFloating(vortex.damage_ap),
    goal_radius: parseFloating(vortex.goal_radius),
    movement_speed: parseFloating(vortex.movement_speed),
    delay: parseFloating(vortex.delay),
    affects_allies: parseBoolean(vortex.affects_allies),
  };

  // is_magical
  if (vortex.is_magical === 'true') returnVortex.is_magical = true;
  // is_flaming
  if (parseInteger(vortex.ignition_amount) >= 1) returnVortex.is_flaming = true;
  // num_vortexes / delay_between_vortexes
  if (parseInteger(vortex.num_vortexes) > 1) {
    returnVortex.num_vortexes = parseInteger(vortex.num_vortexes);
    returnVortex.delay_between_vortexes = parseFloating(vortex.delay_between_vortexes);
  }
  // contact_effect
  if (vortex.localRefs?.special_ability_phases !== undefined) {
    returnVortex.contact_effect = processPhase(
      folder,
      globalData,
      { order: '1', target_enemies: 'true', target_self: 'false', target_friends: returnVortex.affects_allies.toString() },
      vortex.localRefs?.special_ability_phases,
    );
  }

  return returnVortex;
};

export default processVortex;
