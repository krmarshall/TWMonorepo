import type { GlobalDataInterface, TableRecord } from '../@types/GlobalDataInterface.ts';
import type { AbilityInterface, AttributeInterface, UnitStatsInterface } from '../@types/CharacterInterface.ts';
import processAbility from './processAbility.ts';
import processAttribute from './processAttribute.ts';
import processPhase from './processPhase.ts';
import processProjectile from './processProjectile.ts';

const processUnitStats = (folder: string, globalData: GlobalDataInterface, mainUnit: TableRecord) => {
  const landUnit = mainUnit.localRefs?.land_units as TableRecord;
  const battleEntity = landUnit?.localRefs?.battle_entities as TableRecord;
  const meleeWeapon = landUnit?.localRefs?.melee_weapons as TableRecord;
  const missileWeapon = landUnit?.localRefs?.missile_weapons;
  const attributeGroup = landUnit?.localRefs?.unit_attributes_groups;

  const returnStats: UnitStatsInterface = {
    run_speed: battleEntity.run_speed as number,
    mass: battleEntity.mass as number,
    size: battleEntity.size as string,

    hit_points: battleEntity.hit_points as number,
    bonus_hit_points: landUnit.bonus_hit_points as number,
    armour: landUnit?.localRefs?.unit_armour_types?.armour_value as number,
    missile_block_chance: landUnit?.localRefs?.unit_shield_types?.missile_block_chance as number,
    morale: landUnit.morale as number,
    damage_mod_flame: landUnit.damage_mod_flame as number,
    damage_mod_magic: landUnit.damage_mod_magic as number,
    damage_mod_physical: landUnit.damage_mod_physical as number,
    damage_mod_missile: landUnit.damage_mod_missile as number,
    damage_mod_all: landUnit.damage_mod_all as number,

    melee_attack: landUnit.melee_attack as number,
    melee_defence: landUnit.melee_defence as number,
    charge_bonus: landUnit.charge_bonus as number,
    bonus_v_large: meleeWeapon.bonus_v_large as number,
    bonus_v_infantry: meleeWeapon.bonus_v_infantry as number,
    damage: meleeWeapon.damage as number,
    ap_damage: meleeWeapon.ap_damage as number,
    splash_target_size_limit: meleeWeapon.splash_attack_target_size as string,
    splash_attack_max_attacks: meleeWeapon.splash_attack_max_attacks as number,
    melee_attack_interval: meleeWeapon.melee_attack_interval as number,
  };

  if (mainUnit.barrier_health !== undefined && mainUnit.barrier_health !== 0)
    returnStats.barrier = mainUnit.barrier_health as number;
  if (mainUnit.can_siege) returnStats.can_siege = true;
  if (landUnit.can_skirmish) returnStats.can_skirmish = true;
  if (battleEntity.fly_speed !== 0) returnStats.fly_speed = battleEntity.fly_speed as number;
  if ((meleeWeapon.ignition_amount as number) >= 1) returnStats.is_flaming = true;
  if (meleeWeapon.is_magical) returnStats.is_magical = true;
  if (meleeWeapon.localRefs?.special_ability_phases !== undefined) {
    returnStats.contact_phase = processPhase(
      folder,
      globalData,
      { order: 1, target_enemies: true, target_self: false, target_friends: false },
      meleeWeapon.localRefs?.special_ability_phases,
    );
  }

  if (missileWeapon !== undefined) {
    returnStats.projectile = processProjectile(folder, globalData, missileWeapon.localRefs?.projectiles as TableRecord);
    returnStats.accuracy = landUnit.accuracy as number;
    returnStats.reload = landUnit.reload as number;
    returnStats.primary_ammo = landUnit.primary_ammo as number;
    if (landUnit.secondary_ammo !== 0) returnStats.secondary_ammo = landUnit.secondary_ammo as number;
    returnStats.fire_arc = battleEntity.fire_arc_close as number;
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
    if (
      tempAbility.unit_ability.requires_effect_enabling !== undefined &&
      !tempAbility.unit_ability.requires_effect_enabling
    ) {
      delete tempAbility.unit_ability.requires_effect_enabling;
      abilities.push(tempAbility);
    }
  });
  if (abilities.length > 0) returnStats.abilities = abilities;

  const mountEntity = landUnit?.localRefs?.mounts?.localRefs?.battle_entities;
  if (mountEntity !== undefined) {
    returnStats.hit_points = mountEntity.hit_points as number;
    returnStats.mass = mountEntity.mass as number;
    returnStats.run_speed = mountEntity.run_speed as number;
    returnStats.size = mountEntity.size as string;
    if (mountEntity.fly_speed !== 0) returnStats.fly_speed = mountEntity.fly_speed as number;
    if (missileWeapon !== undefined) {
      returnStats.fire_arc = mountEntity.fire_arc_close as number;
    }
  }

  return returnStats;
};

export default processUnitStats;
