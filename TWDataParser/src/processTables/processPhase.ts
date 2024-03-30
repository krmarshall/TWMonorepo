import { GlobalDataInterface, TableRecord } from '../interfaces/GlobalDataInterface';
import { AttributeInterface, PhaseInterface, StatEffectInterface } from '../interfaces/ProcessedTreeInterface';
import findImage from '../utils/findImage';
import numberPrepend from '../utils/numberPrepend';
import { parseBoolean, parseFloating, parseInteger } from '../utils/parseStringToTypes';
import stringInterpolator from '../utils/stringInterpolator';
import processAttribute from './processAttribute';

const processPhase = (folder: string, globalData: GlobalDataInterface, phaseJunc: TableRecord, phase: TableRecord) => {
  const returnPhase: PhaseInterface = {
    icon: findPhaseImage(folder, globalData, phase.id),
    order: parseInteger(phaseJunc.order),
    target_enemies: parseBoolean(phaseJunc.target_enemies),
    target_self: parseBoolean(phaseJunc.target_self),
    target_friends: parseBoolean(phaseJunc.target_friends),
    duration: parseInteger(phase.duration),
    effect_type: phase.effect_type,
    onscreen_name: stringInterpolator(phase.onscreen_name, globalData.parsedData[folder].text),
    is_hidden_in_ui: parseBoolean(phase.is_hidden_in_ui),
    ability_recharge_change: parseFloating(phase.ability_recharge_change),
    barrier_heal_amount: parseFloating(phase.barrier_heal_amount),
    cant_move: parseBoolean(phase.cant_move),
    damage_amount: parseFloating(phase.damage_amount),
    fatigue_change_ratio: parseFloating(phase.fatigue_change_ratio),
    heal_amount: parseFloating(phase.heal_amount),
    hp_change_frequency: parseFloating(phase.hp_change_frequency),
    imbue_magical: parseBoolean(phase.imbue_magical),
    mana_max_depletion_mod: parseFloating(phase.mana_max_depletion_mod),
    mana_regen_mod: parseFloating(phase.mana_regen_mod),
    remove_magical: parseBoolean(phase.remove_magical),
    replenish_ammo: parseFloating(phase.replenish_ammo),
    resurrect: parseBoolean(phase.resurrect),
    unbreakable: parseBoolean(phase.unbreakable),
  };

  // execute_ratio
  if (phase.execute_ratio !== undefined) returnPhase.execute_ratio = parseFloating(phase.execute_ratio);

  [
    'onscreen_name',
    'ability_recharge_change',
    'barrier_heal_amount',
    'cant_move',
    'damage_amount',
    'fatigue_change_ratio',
    'heal_amount',
    'hp_change_frequency',
    'imbue_magical',
    'mana_max_depletion_mod',
    'mana_regen_mod',
    'remove_magical',
    'replenish_ammo',
    'resurrect',
    'unbreakable',
    'execute_ratio',
  ].forEach((field) => {
    const phaseField = returnPhase[field as keyof typeof returnPhase];
    if (typeof phaseField === 'boolean' && phaseField === false) {
      delete returnPhase[field as keyof typeof returnPhase];
    } else if (typeof phaseField === 'number' && phaseField === 0) {
      delete returnPhase[field as keyof typeof returnPhase];
    } else if (typeof phaseField === 'string' && phaseField === '') {
      delete returnPhase[field as keyof typeof returnPhase];
    }
  });

  const max_damaged_entities = parseInteger(phase.max_damaged_entities);
  if (max_damaged_entities !== -1 && max_damaged_entities !== 0) returnPhase.max_damaged_entities = max_damaged_entities;

  // imbue_contact
  if (phase.localRefs?.special_ability_phases !== undefined) {
    returnPhase.imbue_contact = processPhase(
      folder,
      globalData,
      { order: '1', target_enemies: 'true', target_self: 'false', target_friends: 'false' },
      phase.localRefs?.special_ability_phases as TableRecord,
    );
  }
  // imbue_ignition
  if (parseInteger(phase.imbue_ignition) >= 1) returnPhase.imbue_ignition = true;
  // spreading
  if (phase.localRefs?.special_ability_spreadings !== undefined) {
    returnPhase.spread_radius = parseInteger(phase.localRefs?.special_ability_spreadings.spread_radius);
  }
  // stat_effects
  const statEffects: Array<StatEffectInterface> = [];
  phase.foreignRefs?.special_ability_phase_stat_effects?.forEach((phaseStat) => {
    const statLoc = phaseStat.localRefs?.modifiable_unit_stats?.localRefs?.unit_stat_localisations as TableRecord;
    let uiUnitStat = statLoc.foreignRefs?.ui_unit_stats?.[0] as TableRecord;
    if (uiUnitStat === undefined) {
      uiUnitStat = { icon: 'ui/skins/default/icon_stat_bracing.png', order: '0' };
    }
    statEffects.push({
      value: parseFloating(phaseStat.value),
      stat: phaseStat.stat,
      how: phaseStat.how,
      description: numberPrepend(
        stringInterpolator(statLoc.onscreen_name, globalData.parsedData[folder].text),
        parseFloating(phaseStat.value),
        phaseStat.how,
      ),
      icon: 'vanilla3/' + uiUnitStat.icon.replace(/^ui\//, '').replace('.png', '').replace(' ', '_').toLowerCase(),
      sort_order: parseInteger(uiUnitStat.sort_order as string),
    });
  });
  if (statEffects.length > 0) {
    statEffects.sort((a, b) => (a.sort_order as number) - (b.sort_order as number)).forEach((statEffect) => delete statEffect.sort_order);
    returnPhase.stat_effects = statEffects;
  }
  // attributes
  const attributeEffects: Array<AttributeInterface> = [];
  phase.foreignRefs?.special_ability_phase_attribute_effects?.forEach((attributePhase) => {
    const attribute = attributePhase?.localRefs?.unit_attributes;
    if (attribute !== undefined) {
      attributeEffects.push(processAttribute(folder, globalData, attribute, attributePhase.attribute_type));
    }
  });
  if (attributeEffects.length > 0) returnPhase.attributes = attributeEffects;

  return returnPhase;
};

export default processPhase;

const findPhaseImage = (folder: string, globalData: GlobalDataInterface, icon_path: string) => {
  const icon = icon_path.replace('.png', '').trim();
  const searchArray = [`battle_ui/ability_icons/${icon}`, `battle_ui/ability_icons/${icon.toLowerCase()}`];

  return findImage(folder, globalData, searchArray, icon);
};
