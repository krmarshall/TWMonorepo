import type { GlobalDataInterface, TableRecord } from '../@types/GlobalDataInterface.ts';
import type { AttributeInterface, PhaseInterface, StatEffectInterface } from '../@types/CharacterInterface.ts';
import findImage from '../utils/findImage.ts';
import numberPrepend from '../utils/numberPrepend.ts';
import stringInterpolator from '../utils/stringInterpolator.ts';
import processAttribute from './processAttribute.ts';

const processPhase = (folder: string, globalData: GlobalDataInterface, phaseJunc: TableRecord, phase: TableRecord) => {
  const returnPhase: PhaseInterface = {
    icon: findPhaseImage(folder, globalData, phase.id as string),
    order: phaseJunc.order as number,
    target_enemies: phaseJunc.target_enemies as boolean,
    target_self: phaseJunc.target_self as boolean,
    target_friends: phaseJunc.target_friends as boolean,
    duration: phase.duration as number,
    effect_type: phase.effect_type as string,
    onscreen_name: stringInterpolator(phase.onscreen_name as string, globalData.parsedData[folder].text),
    is_hidden_in_ui: phase.is_hidden_in_ui as boolean,
    ability_recharge_change: phase.ability_recharge_change as number,
    barrier_heal_amount: phase.barrier_heal_amount as number,
    cant_move: phase.cant_move as boolean,
    damage_amount: phase.damage_amount as number,
    fatigue_change_ratio: phase.fatigue_change_ratio as number,
    heal_amount: phase.heal_amount as number,
    hp_change_frequency: phase.hp_change_frequency as number,
    imbue_magical: phase.imbue_magical as boolean,
    mana_max_depletion_mod: phase.mana_max_depletion_mod as number,
    mana_regen_mod: phase.mana_regen_mod as number,
    remove_magical: phase.remove_magical as boolean,
    replenish_ammo: phase.replenish_ammo as number,
    resurrect: phase.resurrect as boolean,
    unbreakable: phase.unbreakable as boolean,
  };

  // execute_ratio
  if (phase.execute_ratio !== undefined) returnPhase.execute_ratio = phase.execute_ratio as number;

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

  const max_damaged_entities = phase.max_damaged_entities as number;
  if (max_damaged_entities !== -1 && max_damaged_entities !== 0)
    returnPhase.max_damaged_entities = max_damaged_entities;

  // imbue_contact
  if (phase.localRefs?.special_ability_phases !== undefined) {
    returnPhase.imbue_contact = processPhase(
      folder,
      globalData,
      { order: 1, target_enemies: true, target_self: false, target_friends: false },
      phase.localRefs?.special_ability_phases as TableRecord,
    );
  }
  // imbue_ignition
  if ((phase.imbue_ignition as number) >= 1) returnPhase.imbue_ignition = true;
  // spreading
  if (phase.localRefs?.special_ability_spreadings !== undefined) {
    returnPhase.spread_radius = phase.localRefs?.special_ability_spreadings.spread_radius as number;
  }
  // stat_effects
  const statEffects: Array<StatEffectInterface> = [];
  phase.foreignRefs?.special_ability_phase_stat_effects?.forEach((phaseStat) => {
    const statLoc = phaseStat.localRefs?.modifiable_unit_stats?.localRefs?.unit_stat_localisations as TableRecord;
    let uiUnitStat = statLoc.foreignRefs?.ui_unit_stats?.[0] as TableRecord;
    if (uiUnitStat === undefined) {
      uiUnitStat = { icon: 'ui/skins/default/icon_stat_bracing.png', order: 0 };
    }
    statEffects.push({
      value: phaseStat.value as number,
      stat: phaseStat.stat as string,
      how: phaseStat.how as string,
      description: numberPrepend(
        stringInterpolator(statLoc.onscreen_name as string, globalData.parsedData[folder].text),
        phaseStat.value as number,
        phaseStat.how as string,
      ),
      icon:
        'vanilla3/' +
        (uiUnitStat.icon as string).replace(/^ui\//, '').replace('.png', '').replaceAll(' ', '_').toLowerCase(),
      sort_order: uiUnitStat.sort_order as number,
    });
  });
  if (statEffects.length > 0) {
    statEffects
      .sort((a, b) => (a.sort_order as number) - (b.sort_order as number))
      .forEach((statEffect) => delete statEffect.sort_order);
    returnPhase.stat_effects = statEffects;
  }
  // attributes
  const attributeEffects: Array<AttributeInterface> = [];
  phase.foreignRefs?.special_ability_phase_attribute_effects?.forEach((attributePhase) => {
    const attribute = attributePhase?.localRefs?.unit_attributes;
    if (attribute !== undefined) {
      attributeEffects.push(processAttribute(folder, globalData, attribute, attributePhase.attribute_type as string));
    }
  });
  if (attributeEffects.length > 0) returnPhase.attributes = attributeEffects;

  return returnPhase;
};

export default processPhase;

const findPhaseImage = (folder: string, globalData: GlobalDataInterface, icon_path: string) => {
  const icon = icon_path.replace('.png', '').trim();
  const searchArray = [`battle_ui/ability_icons/${icon.toLowerCase()}`];

  return findImage(folder, globalData, searchArray, icon);
};
