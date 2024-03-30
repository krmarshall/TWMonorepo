import { GlobalDataInterface, TableRecord } from '../interfaces/GlobalDataInterface';
import { ProjectileInterface } from '../interfaces/ProcessedTreeInterface';
import { parseBoolean, parseFloating, parseInteger } from '../utils/parseStringToTypes';
import processPhase from './processPhase';
import processVortex from './processVortex';

const processProjectile = (folder: string, globalData: GlobalDataInterface, projectile: TableRecord) => {
  const returnProjectile: ProjectileInterface = {
    key: projectile.key,
    damage: parseFloating(projectile.damage),
    ap_damage: parseFloating(projectile.ap_damage),
    shockwave_radius: parseFloating(projectile.shockwave_radius),
    effective_range: parseInteger(projectile.effective_range),
    base_reload_time: parseFloating(projectile.base_reload_time),
  };

  if (parseInteger(projectile.bonus_v_infantry) > 0) returnProjectile.bonus_v_infantry = parseInteger(projectile.bonus_v_infantry);
  if (parseInteger(projectile.bonus_v_large) > 0) returnProjectile.bonus_v_large = parseInteger(projectile.bonus_v_large);
  if (parseInteger(projectile.projectile_number) > 1) returnProjectile.projectile_number = parseInteger(projectile.projectile_number);
  if (parseInteger(projectile.burst_size) > 1) returnProjectile.burst_size = parseInteger(projectile.burst_size);
  if (projectile.is_magical === 'true') returnProjectile.is_magical = true;
  if (parseInteger(projectile.ignition_amount) >= 1) returnProjectile.is_flaming = true;
  if (parseInteger(projectile.shots_per_volley) > 1) returnProjectile.shots_per_volley = parseInteger(projectile.shots_per_volley);
  if (projectile.can_damage_allies === 'true') returnProjectile.can_damage_allies = true;

  // explosion_type
  if (projectile.localRefs?.projectiles_explosions !== undefined) {
    const explosion = projectile.localRefs?.projectiles_explosions;
    returnProjectile.explosion_type = {
      key: explosion.key,
      affects_allies: parseBoolean(explosion.affects_allies),
      detonation_damage: parseFloating(explosion.detonation_damage),
      detonation_damage_ap: parseFloating(explosion.detonation_damage_ap),
      detonation_radius: parseFloating(explosion.detonation_radius),
    };
    if (explosion.is_magical === 'true') returnProjectile.explosion_type.is_magical = true;
    if (parseInteger(explosion.ignition_amount) >= 1) returnProjectile.explosion_type.is_flaming = true;
    if (explosion.localRefs?.special_ability_phases !== undefined) {
      returnProjectile.explosion_type.contact_phase_effect = processPhase(
        folder,
        globalData,
        { order: '1', target_enemies: 'true', target_self: 'false', target_friends: explosion.affects_allies },
        explosion.localRefs?.special_ability_phases,
      );
    }
  }
  // contact_stat_effect
  if (projectile.localRefs?.special_ability_phases !== undefined) {
    returnProjectile.contact_stat_effect = processPhase(
      folder,
      globalData,
      { order: '1', target_enemies: 'true', target_self: 'false', target_friends: projectile.can_damage_allies },
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
