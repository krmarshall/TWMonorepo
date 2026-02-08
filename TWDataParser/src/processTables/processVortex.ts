import type { GlobalDataInterface, TableRecord } from '../@types/GlobalDataInterface.ts';
import type { VortexInterface } from '../@types/CharacterInterface.ts';
import processPhase from './processPhase.ts';

const processVortex = (folder: string, globalData: GlobalDataInterface, vortex: TableRecord) => {
  const returnVortex: VortexInterface = {
    vortex_key: vortex.vortex_key as string,
    duration: vortex.duration as number,
    damage: vortex.damage as number,
    damage_ap: vortex.damage_ap as number,
    goal_radius: vortex.goal_radius as number,
    movement_speed: vortex.movement_speed as number,
    delay: vortex.delay as number,
    affects_allies: vortex.affects_allies as boolean,
  };

  // is_magical
  if (vortex.is_magical) returnVortex.is_magical = true;
  // is_flaming
  if ((vortex.ignition_amount as number) >= 1) returnVortex.is_flaming = true;
  // num_vortexes / delay_between_vortexes
  if ((vortex.num_vortexes as number) > 1) {
    returnVortex.num_vortexes = vortex.num_vortexes as number;
    returnVortex.delay_between_vortexes = vortex.delay_between_vortexes as number;
  }
  // contact_effect
  if (vortex.localRefs?.special_ability_phases !== undefined) {
    returnVortex.contact_effect = processPhase(
      folder,
      globalData,
      {
        order: 1,
        target_enemies: true,
        target_self: false,
        target_friends: returnVortex.affects_allies.toString(),
      },
      vortex.localRefs?.special_ability_phases,
    );
  }

  return returnVortex;
};

export default processVortex;
