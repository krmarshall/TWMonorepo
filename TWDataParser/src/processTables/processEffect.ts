import { GlobalDataInterface, TableRecord } from '../interfaces/GlobalDataInterface';
import { AbilityInterface, AttributeInterface, EffectInterface, PhaseInterface } from '../interfaces/ProcessedTreeInterface';
import findImage from '../utils/findImage';
import numberInsertion from '../utils/numberInsertion';
import { parseInteger } from '../utils/parseStringToTypes';
import stringInterpolator from '../utils/stringInterpolator';
import processAbility from './processAbility';
import processAttribute from './processAttribute';
import processPhase from './processPhase';

const processEffect = (folder: string, globalData: GlobalDataInterface, effectJunc: TableRecord) => {
  const effect = effectJunc.localRefs?.effects as TableRecord;
  if (effect === undefined) {
    return {
      key: 'invalid_effect',
      description: 'Invalid Effect',
      icon: 'vanilla3/campaign_ui/effect_bundles/0_placeholder_effect_bundle',
    };
  }
  const returnEffect: EffectInterface = {
    description: numberInsertion(
      stringInterpolator(effect.description, globalData.parsedData[folder].text),
      parseInteger(effectJunc.value),
    ),
    key: effect.effect,
    icon: findEffectImage(folder, globalData, effect.icon),
    priority: parseInteger(effect.priority),
  };
  if (effectJunc.scope === 'character_to_character_own') {
    returnEffect.scope = effectJunc.scope;
    returnEffect.value = parseInteger(effectJunc.value);
  }
  if (effectJunc.localRefs?.campaign_effect_scopes?.localised_text !== '') {
    returnEffect.description += stringInterpolator(
      effectJunc.localRefs?.campaign_effect_scopes?.localised_text as string,
      globalData.parsedData[folder].text,
    );
  }

  const wantedBonusValueIdList = ['enable', 'enable_overchage', 'uses_mod', 'effect_range_mod'];
  // Abilities
  const related_abilities: Array<AbilityInterface> = [];
  // unit_ability
  effect.foreignRefs?.effect_bonus_value_unit_ability_junctions?.forEach((abilityJunc, index) => {
    if (
      (abilityJunc.bonus_value_id === 'recharge_mod' && index < 4 && abilityJunc.localRefs?.unit_abilities?.overpower_option === '') ||
      wantedBonusValueIdList.includes(abilityJunc.bonus_value_id)
    ) {
      related_abilities.push(processAbility(folder, globalData, abilityJunc));
    }
  });
  // unit_ability recharge_mods can link to nearly every spell in the game, so limit the number we add for them, but allow everything for the rest
  wantedBonusValueIdList.push('recharge_mod');
  // unit_set_ability
  effect.foreignRefs?.effect_bonus_value_unit_set_unit_ability_junctions?.forEach((abilityJunc) => {
    if (wantedBonusValueIdList.includes(abilityJunc.bonus_value_id)) {
      related_abilities.push(processAbility(folder, globalData, abilityJunc));
    }
  });
  // army_special_ability
  effect.foreignRefs?.effect_bonus_value_military_force_ability_junctions?.forEach((abilityJunc) => {
    if (wantedBonusValueIdList.includes(abilityJunc.bonus_value_id)) {
      related_abilities.push(processAbility(folder, globalData, abilityJunc));
    }
  });
  // battle_context
  effect.foreignRefs?.effect_bonus_value_battle_context_unit_ability_junctions?.forEach((abilityJunc) => {
    if (wantedBonusValueIdList.includes(abilityJunc.bonus_value_id)) {
      related_abilities.push(processAbility(folder, globalData, abilityJunc));
    }
  });
  if (related_abilities.length > 0) returnEffect.related_abilities = related_abilities;

  // Attributes
  const related_attributes: Array<AttributeInterface> = [];
  effect.foreignRefs?.effect_bonus_value_unit_attribute_junctions?.forEach((attributeJunc) => {
    const attribute = attributeJunc?.localRefs?.unit_attributes;
    if (attribute !== undefined) {
      related_attributes.push(processAttribute(folder, globalData, attribute));
    }
  });
  effect.foreignRefs?.effect_bonus_value_unit_set_unit_attribute_junctions?.forEach((attributeJunc) => {
    const attribute = attributeJunc?.localRefs?.unit_set_unit_attribute_junctions?.localRefs?.unit_attributes;
    if (attribute !== undefined) {
      related_attributes.push(processAttribute(folder, globalData, attribute));
    }
  });
  effect?.foreignRefs?.effect_bonus_value_battle_context_unit_attribute_junctions?.forEach((attributeJunc) => {
    const attribute = attributeJunc?.localRefs?.battle_context_unit_attribute_junctions?.localRefs?.unit_attributes;
    if (attribute !== undefined) {
      related_attributes.push(processAttribute(folder, globalData, attribute));
    }
  });
  if (related_attributes.length > 0) returnEffect.related_attributes = related_attributes;

  // Phases
  const related_phases: Array<PhaseInterface> = [];
  effect?.foreignRefs?.effect_bonus_value_special_ability_phase_record_junctions?.forEach((phaseJunc) => {
    const phase = phaseJunc?.localRefs?.special_ability_phases;
    if (phase !== undefined) {
      related_phases.push(
        processPhase(folder, globalData, { order: '0', target_enemies: 'true', target_self: 'false', target_friends: 'false' }, phase),
      );
    }
  });
  effect?.foreignRefs?.effect_bonus_value_unit_set_special_ability_phase_junctions?.forEach((phaseJunc) => {
    const phase = phaseJunc?.localRefs?.unit_set_special_ability_phase_junctions?.localRefs?.special_ability_phases;
    if (phase !== undefined) {
      related_phases.push(
        processPhase(folder, globalData, { order: '0', target_enemies: 'true', target_self: 'false', target_friends: 'false' }, phase),
      );
    }
  });
  if (related_phases.length > 0) returnEffect.related_phases = related_phases;

  return returnEffect;
};

export default processEffect;

const findEffectImage = (folder: string, globalData: GlobalDataInterface, iconArg: string) => {
  const icon = iconArg.replace('.png', '').trim();
  const searchArray = [
    `campaign_ui/effect_bundles/${icon}`,
    `campaign_ui/effect_bundles/${icon.toLowerCase()}`,
    `battle_ui/ability_icons/${icon}`,
    `battle_ui/ability_icons/${icon.toLowerCase()}`,
  ];

  return findImage(folder, globalData, searchArray, icon);
};
