import type { GlobalDataInterface, TableRecord } from '../@types/GlobalDataInterface.ts';
import type { AbilityInterface, PhaseInterface, UiEffectInterface } from '../@types/CharacterInterface.ts';
import findImage from '../utils/findImage.ts';
import stringInterpolator from '../utils/stringInterpolator.ts';
import processBombardment from './processBombardment.ts';
import processPhase from './processPhase.ts';
import processProjectile from './processProjectile.ts';
import processVortex from './processVortex.ts';
import log from '../utils/log.ts';

const processAbility = (
  folder: string,
  globalData: GlobalDataInterface,
  abilityJunc: TableRecord,
  effectEnabling: boolean | undefined = false,
) => {
  const unitAbility =
    (abilityJunc.localRefs?.unit_abilities as TableRecord) ??
    (abilityJunc.localRefs?.unit_set_unit_ability_junctions?.localRefs?.unit_abilities as TableRecord) ??
    (abilityJunc.localRefs?.army_special_abilities?.localRefs?.unit_special_abilities?.localRefs
      ?.unit_abilities as TableRecord) ??
    (abilityJunc.localRefs?.battle_context_unit_ability_junctions?.localRefs?.unit_abilities as TableRecord);

  if (unitAbility === undefined) {
    log(`Ability Junc Missing Ability: ${abilityJunc.effect} | ${folder}`, 'yellow');
    const earlyReturn: AbilityInterface = {
      effect: abilityJunc.effect as string,
      bonus_value_id: abilityJunc.bonus_value_id as string,
      unit_ability: {
        key: 'MISSING',
        icon_name: 'MISSING',
        overpower_option: 'MISSING',
        type: {
          key: 'MISSING',
          icon_path: 'MISSING',
          onscreen_name: 'MISSING',
        },
        is_hidden_in_ui: false,
        onscreen_name: 'MISSING',
        effect_range: 0,
        target_enemies: false,
        target_friends: false,
        target_ground: false,
        target_self: false,
        target_intercept_range: 0,
      },
    };
    return earlyReturn;
  }
  const unitAbilityType = unitAbility.localRefs?.unit_ability_types as TableRecord;
  const unitSpecialAbility = unitAbility.foreignRefs?.unit_special_abilities?.[0] as TableRecord;

  const returnAbility: AbilityInterface = {
    effect: abilityJunc.effect as string,
    bonus_value_id: abilityJunc.bonus_value_id as string,
    unit_ability: {
      key: unitAbility.key as string,
      icon_name: findAbilityImage(folder, globalData, unitAbility.icon_name as string),
      overpower_option: unitAbility.overpower_option as string,
      type: {
        key: unitAbilityType.key as string,
        icon_path: findAbilityTypeImage(folder, globalData, unitAbilityType.icon_path as string),
        onscreen_name: stringInterpolator(unitAbilityType.onscreen_name as string, globalData.parsedData[folder].text),
      },
      is_hidden_in_ui: unitAbility.is_hidden_in_ui as boolean,
      onscreen_name: stringInterpolator(unitAbility.onscreen_name as string, globalData.parsedData[folder].text),
      active_time: unitSpecialAbility.active_time as number,
      effect_range: unitSpecialAbility.effect_range as number,
      mana_cost: unitSpecialAbility.mana_cost as number,
      min_range: unitSpecialAbility.min_range as number,
      miscast_chance: unitSpecialAbility.miscast_chance as number,
      num_effected_enemy_units: unitSpecialAbility.num_effected_enemy_units as number,
      num_effected_friendly_units: unitSpecialAbility.num_effected_friendly_units as number,
      num_uses: unitSpecialAbility.num_uses as number,
      recharge_time: unitSpecialAbility.recharge_time as number,
      shared_recharge_time: unitSpecialAbility.shared_recharge_time as number,
      target_enemies: unitSpecialAbility.target_enemies as boolean,
      target_friends: unitSpecialAbility.target_friends as boolean,
      target_ground: unitSpecialAbility.target_ground as boolean,
      target_self: unitSpecialAbility.target_self as boolean,
      target_intercept_range: unitSpecialAbility.target_intercept_range as number,
      wind_up_time: unitSpecialAbility.wind_up_time as number,
    },
  };
  if (effectEnabling)
    returnAbility.unit_ability.requires_effect_enabling = unitAbility.requires_effect_enabling as boolean;

  [
    'active_time',
    'mana_cost',
    'min_range',
    'miscast_chance',
    'num_effected_enemy_units',
    'num_effected_friendly_units',
    'num_uses',
    'recharge_time',
    'shared_recharge_time',
    'wind_up_time',
  ].forEach((field) => {
    if ((returnAbility.unit_ability[field as keyof typeof returnAbility.unit_ability] as number) <= 0) {
      delete returnAbility.unit_ability[field as keyof typeof returnAbility.unit_ability];
    }
  });

  if (unitSpecialAbility.behaviour === 'random_phases') returnAbility.unit_ability.random_phases = true;

  // enabled_if
  const enabled_if: Array<string> = [];
  unitSpecialAbility.foreignRefs?.special_ability_to_auto_deactivate_flags?.forEach((enable) => {
    enabled_if.push(
      stringInterpolator(
        lookupKillThresholds(
          enable.localRefs?.special_ability_invalid_usage_flags?.flag_key as string,
          enable.localRefs?.special_ability_invalid_usage_flags?.alt_description as string,
          folder,
          globalData,
        ),
        globalData.parsedData[folder].text,
      ),
    );
  });
  if (enabled_if.length > 0) returnAbility.unit_ability.enabled_if = enabled_if;

  // target_if
  const target_if: Array<string> = [];
  unitSpecialAbility.foreignRefs?.special_ability_to_invalid_target_flags?.forEach((target) => {
    target_if.push(
      stringInterpolator(
        lookupKillThresholds(
          target.localRefs?.special_ability_invalid_usage_flags?.flag_key as string,
          target.localRefs?.special_ability_invalid_usage_flags?.alt_description as string,
          folder,
          globalData,
        ),
        globalData.parsedData[folder].text,
      ),
    );
  });
  if (target_if.length > 0) returnAbility.unit_ability.target_if = target_if;

  // ui_effects
  const ui_effects: Array<UiEffectInterface> = [];
  unitAbility.foreignRefs?.unit_abilities_to_additional_ui_effects_juncs?.forEach((uiEffectJunc) => {
    const uiEffect = uiEffectJunc.localRefs?.unit_abilities_additional_ui_effects as TableRecord;
    const returnUiEffect = {
      key: uiEffect.key as string,
      sort_order: uiEffect.sort_order as number,
      localised_text: stringInterpolator(uiEffect.localised_text as string, globalData.parsedData[folder].text),
      effect_state: uiEffect.effect_state as string,
    };
    if (uiEffect.effect_state !== undefined) returnUiEffect.effect_state = uiEffect.effect_state as string;
    ui_effects.push(returnUiEffect);
  });
  if (ui_effects.length > 0) {
    ui_effects
      .sort((a, b) => (a.sort_order as number) - (b.sort_order as number))
      .forEach((effect) => delete effect.sort_order);
    returnAbility.unit_ability.ui_effects = ui_effects;
  }

  // phases
  const phases: Array<PhaseInterface> = [];
  unitSpecialAbility.foreignRefs?.special_ability_to_special_ability_phase_junctions?.forEach((phaseJunc) => {
    phases.push(
      processPhase(folder, globalData, phaseJunc, phaseJunc.localRefs?.special_ability_phases as TableRecord),
    );
  });
  if (phases.length > 0) returnAbility.unit_ability.phases = phases.sort((a, b) => a.order - b.order);

  // activated_projectile
  if (unitSpecialAbility.localRefs?.projectiles !== undefined) {
    returnAbility.unit_ability.activated_projectile = processProjectile(
      folder,
      globalData,
      unitSpecialAbility.localRefs?.projectiles,
    );
  }

  // bombardment
  if (unitSpecialAbility.localRefs?.projectile_bombardments !== undefined) {
    returnAbility.unit_ability.bombardment = processBombardment(
      folder,
      globalData,
      unitSpecialAbility.localRefs?.projectile_bombardments,
    );
  }

  // vortex
  const battleVortex = unitSpecialAbility.localRefs?.battle_vortexs;
  if (battleVortex !== undefined) {
    if (battleVortex.damage === '0' && battleVortex.damage_ap === '0' && battleVortex.contact_effect === '') {
      // some vortices are purely there for vfx, dont add these
    } else {
      returnAbility.unit_ability.vortex = processVortex(folder, globalData, battleVortex);
    }
  }

  return returnAbility;
};

export default processAbility;

const lookupKillThresholds = (
  key: string | undefined,
  text: string | undefined,
  folder: string,
  globalData: GlobalDataInterface,
) => {
  if (key === 'unit_tier1_kills' || key === 'unit_tier2_kills' || key === 'unit_tier3_kills') {
    const killsRule = globalData.parsedData[folder].db['_kv_rules_tables'].find((rule) => rule.key === key);
    if (killsRule !== undefined) {
      return `More than ${killsRule.value as number} kills`;
    }
  }
  return text ?? '';
};

const findAbilityImage = (folder: string, globalData: GlobalDataInterface, icon_name: string) => {
  const icon = icon_name.replace('.png', '').trim();
  const searchArray = [
    `battle_ui/ability_icons/${icon}`,
    `battle_ui/ability_icons/${icon.toLowerCase()}`,
    // WH2 has most of the ability icons in campaign_ui
    `campaign_ui/skills/${icon}`,
    `campaign_ui/skills/${icon.toLowerCase()}`,
    // SFO2 some ability icons have _active in the icon_name, but not actual image name
    `campaign_ui/skills/${icon.replace('_active', '')}`,
    `campaign_ui/skills/${icon.replace('_active', '').toLowerCase()}`,
  ];

  return findImage(folder, globalData, searchArray, icon);
};

const findAbilityTypeImage = (folder: string, globalData: GlobalDataInterface, icon_path: string) => {
  const vanillaGame = folder.includes('2') ? 'vanilla2' : 'vanilla3';
  const icon = icon_path.replace('.png', '').trim().replaceAll(' ', '_').replace(/^ui\//, '');

  const modIcon = globalData.imgPaths[folder][icon];
  if (modIcon !== undefined) {
    return `${folder}/${modIcon}`;
  }

  const vanillaIcon = globalData.imgPaths[vanillaGame][icon];
  if (vanillaIcon !== undefined) {
    return `${vanillaGame}/${vanillaIcon}`;
  }

  return icon;
};
