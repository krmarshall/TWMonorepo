import type { GlobalDataInterface, TableRecord } from '../@types/GlobalDataInterface.ts';
import type { ProjectileInterface } from '../@types/CharacterInterface.ts';
import processPhase from './processPhase.ts';
import processVortex from './processVortex.ts';

const processProjectile = (folder: string, globalData: GlobalDataInterface, projectile: TableRecord) => {
  const returnProjectile: ProjectileInterface = {
    key: projectile.key as string,
    damage: projectile.damage as number,
    ap_damage: projectile.ap_damage as number,
    shockwave_radius: projectile.shockwave_radius as number,
    effective_range: projectile.effective_range as number,
    base_reload_time: projectile.base_reload_time as number,
  };

  if ((projectile.bonus_v_infantry as number) > 0)
    returnProjectile.bonus_v_infantry = projectile.bonus_v_infantry as number;
  if ((projectile.bonus_v_large as number) > 0) returnProjectile.bonus_v_large = projectile.bonus_v_large as number;
  if ((projectile.projectile_number as number) > 1)
    returnProjectile.projectile_number = projectile.projectile_number as number;
  if ((projectile.burst_size as number) > 1) returnProjectile.burst_size = projectile.burst_size as number;
  if (projectile.is_magical) returnProjectile.is_magical = true;
  if ((projectile.ignition_amount as number) >= 1) returnProjectile.is_flaming = true;
  if ((projectile.shots_per_volley as number) > 1)
    returnProjectile.shots_per_volley = projectile.shots_per_volley as number;
  if (projectile.can_damage_allies) returnProjectile.can_damage_allies = true;

  // explosion_type
  if (projectile.localRefs?.projectiles_explosions !== undefined) {
    const explosion = projectile.localRefs?.projectiles_explosions;
    returnProjectile.explosion_type = {
      key: explosion.key as string,
      affects_allies: explosion.affects_allies as boolean,
      detonation_damage: explosion.detonation_damage as number,
      detonation_damage_ap: explosion.detonation_damage_ap as number,
      detonation_radius: explosion.detonation_radius as number,
    };
    if (explosion.is_magical) returnProjectile.explosion_type.is_magical = true;
    if ((explosion.ignition_amount as number) >= 1) returnProjectile.explosion_type.is_flaming = true;
    if (explosion.localRefs?.special_ability_phases !== undefined) {
      returnProjectile.explosion_type.contact_phase_effect = processPhase(
        folder,
        globalData,
        { order: 1, target_enemies: true, target_self: false, target_friends: explosion.affects_allies },
        explosion.localRefs?.special_ability_phases,
      );
    }
  }
  // contact_stat_effect
  if (projectile.localRefs?.special_ability_phases !== undefined) {
    returnProjectile.contact_stat_effect = processPhase(
      folder,
      globalData,
      { order: 1, target_enemies: true, target_self: false, target_friends: projectile.can_damage_allies },
      projectile.localRefs?.special_ability_phases,
    );
  }

  // spawned_vortex
  if (projectile.localRefs?.battle_vortexs !== undefined) {
    returnProjectile.spawned_vortex = processVortex(folder, globalData, projectile.localRefs?.battle_vortexs);
  }

  return returnProjectile;
};

export default processProjectile;
