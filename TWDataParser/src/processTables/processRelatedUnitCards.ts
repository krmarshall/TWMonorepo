import type { GlobalDataInterface, TableRecord } from '../@types/GlobalDataInterface.ts';

const processRelatedUnitCards = (folder: string, globalData: GlobalDataInterface, effect: TableRecord) => {
  const related_unit_cards: Set<string> = new Set();

  effect?.foreignRefs?.effect_bonus_value_agent_subtype_junctions?.forEach((junc) =>
    addMainUnit(junc?.localRefs?.agent_subtypes?.localRefs?.main_units, related_unit_cards),
  );

  effect?.foreignRefs?.effect_bonus_value_ids_unit_sets?.forEach((set) =>
    set?.localRefs?.unit_sets?.foreignRefs?.unit_set_to_unit_junctions?.forEach((unitJunc) =>
      addMainUnit(unitJunc?.localRefs?.main_units, related_unit_cards),
    ),
  );

  effect?.foreignRefs?.effect_bonus_value_missile_weapon_junctions?.forEach((junc) =>
    addMainUnit(junc?.localRefs?.unit_missile_weapon_junctions?.localRefs?.main_units, related_unit_cards),
  );

  effect?.foreignRefs?.effect_bonus_value_unit_list_junctions?.forEach((junc) =>
    junc?.localRefs?.unit_lists?.foreignRefs?.unit_to_unit_list_junctions?.forEach((listJunc) =>
      addMainUnit(listJunc?.localRefs?.main_units, related_unit_cards),
    ),
  );

  effect?.foreignRefs?.effect_bonus_value_unit_record_junctions?.forEach((junc) =>
    addMainUnit(junc?.localRefs?.main_units, related_unit_cards),
  );

  effect?.foreignRefs?.effect_bonus_value_unit_set_special_ability_phase_junctions?.forEach((effectJunc) =>
    effectJunc?.localRefs?.unit_set_special_ability_phase_junctions?.localRefs?.unit_sets?.foreignRefs?.unit_set_to_unit_junctions?.forEach(
      (unitJunc) => addMainUnit(unitJunc?.localRefs?.main_units, related_unit_cards),
    ),
  );

  effect?.foreignRefs?.effect_bonus_value_unit_set_unit_ability_junctions?.forEach((effectJunc) =>
    effectJunc?.localRefs?.unit_set_unit_ability_junctions?.localRefs?.unit_sets?.foreignRefs?.unit_set_to_unit_junctions?.forEach(
      (unitJunc) => addMainUnit(unitJunc?.localRefs?.main_units, related_unit_cards),
    ),
  );

  effect?.foreignRefs?.effect_bonus_value_unit_set_unit_attribute_junctions?.forEach((effectJunc) =>
    effectJunc?.localRefs?.unit_set_unit_attribute_junctions?.localRefs?.unit_sets?.foreignRefs?.unit_set_to_unit_junctions?.forEach(
      (unitJunc) => addMainUnit(unitJunc?.localRefs?.main_units, related_unit_cards),
    ),
  );

  // Some lord/hero portraits seem to be linked through a diff folder? Just remove the card if its not found/placeholder
  related_unit_cards.forEach((card) => {
    if (globalData.imgPaths[folder][`units/icons/${card}`] === undefined) {
      related_unit_cards.delete(card);
    } else if (card === 'placeholder') {
      related_unit_cards.delete(card);
    }
  });

  return related_unit_cards;
};

const addMainUnit = (mainUnit: TableRecord | undefined, related_unit_cards: Set<string>) => {
  mainUnit?.localRefs?.land_units?.foreignRefs?.unit_variants?.forEach((unitVariant) =>
    related_unit_cards.add(unitVariant.unit_card),
  );
};

export default processRelatedUnitCards;
