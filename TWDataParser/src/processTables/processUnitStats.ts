import { GlobalDataInterface, TableRecord } from '../interfaces/GlobalDataInterface';
import { AbilityInterface, AttributeInterface, UnitStatsInterface } from '../interfaces/ProcessedTreeInterface';
import { parseFloating, parseInteger } from '../utils/parseStringToTypes';
import processAbility from './processAbility';
import processAttribute from './processAttribute';
import processPhase from './processPhase';
import processProjectile from './processProjectile';

const processUnitStats = (folder: string, globalData: GlobalDataInterface, mainUnit: TableRecord) => {
  const landUnit = mainUnit.localRefs?.land_units as TableRecord;
  const battleEntity = landUnit?.localRefs?.battle_entities as TableRecord;
  const meleeWeapon = landUnit?.localRefs?.melee_weapons as TableRecord;
  const missileWeapon = landUnit?.localRefs?.missile_weapons;
  const attributeGroup = landUnit?.localRefs?.unit_attributes_groups;
  const returnStats: UnitStatsInterface = {
    run_speed: parseFloating(battleEntity.run_speed),
    mass: parseInteger(battleEntity.mass),
    size: battleEntity.size,

    hit_points: parseInteger(battleEntity.hit_points),
    bonus_hit_points: parseInteger(landUnit.bonus_hit_points),
    armour: parseInteger(landUnit?.localRefs?.unit_armour_types?.armour_value as string),
    missile_block_chance: parseInteger(landUnit?.localRefs?.unit_shield_types?.missile_block_chance as string),
    morale: parseInteger(landUnit.morale),
    damage_mod_flame: parseInteger(landUnit.damage_mod_flame),
    damage_mod_magic: parseInteger(landUnit.damage_mod_magic),
    damage_mod_physical: parseInteger(landUnit.damage_mod_physical),
    damage_mod_missile: parseInteger(landUnit.damage_mod_missile),
    damage_mod_all: parseInteger(landUnit.damage_mod_all),

    melee_attack: parseInteger(landUnit.melee_attack),
    melee_defence: parseInteger(landUnit.melee_defence),
    charge_bonus: parseInteger(landUnit.charge_bonus),
    bonus_v_large: parseInteger(meleeWeapon.bonus_v_large),
    bonus_v_infantry: parseInteger(meleeWeapon.bonus_v_infantry),
    damage: parseInteger(meleeWeapon.damage),
    ap_damage: parseInteger(meleeWeapon.ap_damage),
    splash_target_size_limit: meleeWeapon.splash_attack_target_size,
    splash_attack_max_attacks: parseInteger(meleeWeapon.splash_attack_max_attacks),
    melee_attack_interval: parseFloating(meleeWeapon.melee_attack_interval),
  };

  if (mainUnit.barrier_health !== undefined && mainUnit.barrier_health !== '0') returnStats.barrier = parseInteger(mainUnit.barrier_health);
  if (mainUnit.can_siege === 'true') returnStats.can_siege = true;
  if (landUnit.can_skirmish === 'true') returnStats.can_skirmish = true;
  if (battleEntity.fly_speed !== '0') returnStats.fly_speed = parseFloating(battleEntity.fly_speed);
  if (parseInteger(meleeWeapon.ignition_amount) >= 1) returnStats.is_flaming = true;
  if (meleeWeapon.is_magical === 'true') returnStats.is_magical = true;
  if (meleeWeapon.localRefs?.special_ability_phases !== undefined) {
    returnStats.contact_phase = processPhase(
      folder,
      globalData,
      { order: '1', target_enemies: 'true', target_self: 'false', target_friends: 'false' },
      meleeWeapon.localRefs?.special_ability_phases,
    );
  }

  if (missileWeapon !== undefined) {
    returnStats.projectile = processProjectile(folder, globalData, missileWeapon.localRefs?.projectiles as TableRecord);
    returnStats.accuracy = parseInteger(landUnit.accuracy);
    returnStats.reload = parseInteger(landUnit.reload);
    returnStats.primary_ammo = parseInteger(landUnit.primary_ammo);
    if (landUnit.secondary_ammo !== '0') returnStats.secondary_ammo = parseInteger(landUnit.secondary_ammo);
    returnStats.fire_arc = parseInteger(battleEntity.fire_arc_close);
  }

  const attributes: Array<AttributeInterface> = [];
  attributeGroup?.foreignRefs?.unit_attributes_to_groups_junctions?.forEach((attributeJunc) => {
    const attribute = attributeJunc?.localRefs?.unit_attributes;
    if (attribute !== undefined) {
      attributes.push(processAttribute(folder, globalData, attribute));
    }
  });
  if (attributes.length > 0) returnStats.attributes = attributes;

  const abilities: Array<AbilityInterface> = [];
  landUnit.foreignRefs?.land_units_to_unit_abilites_junctions?.forEach((abilityJunc) => {
    const tempAbility = processAbility(folder, globalData, abilityJunc, true);
    if (tempAbility.unit_ability.requires_effect_enabling !== undefined && !tempAbility.unit_ability.requires_effect_enabling) {
      delete tempAbility.unit_ability.requires_effect_enabling;
      abilities.push(tempAbility);
    }
  });
  if (abilities.length > 0) returnStats.abilities = abilities;

  const mountEntity = landUnit?.localRefs?.mounts?.localRefs?.battle_entities;
  if (mountEntity !== undefined) {
    returnStats.hit_points = parseInteger(mountEntity.hit_points);
    returnStats.mass = parseInteger(mountEntity.mass);
    returnStats.run_speed = parseInteger(mountEntity.run_speed);
    returnStats.size = mountEntity.size;
    if (mountEntity.fly_speed !== '0') returnStats.fly_speed = parseFloating(mountEntity.fly_speed);
    if (missileWeapon !== undefined) {
      returnStats.fire_arc = parseInteger(mountEntity.fire_arc_close);
    }
  }

  return returnStats;
};

export default processUnitStats;
