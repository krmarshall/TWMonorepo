import type { GlobalDataInterface, TableRecord } from '../@types/GlobalDataInterface.ts';
import type { EffectInterface, ItemInterface } from '../@types/CharacterInterface.ts';
import stringInterpolator from '../utils/stringInterpolator.ts';
import processEffect from './processEffect.ts';

const processAncillary = (
  folder: string,
  globalData: GlobalDataInterface,
  ancillaryJunc: TableRecord,
  unlocked_at_rank: number | undefined,
) => {
  const ancillary = ancillaryJunc.localRefs?.ancillaries as TableRecord;
  const ancillaryInfo = ancillary.localRefs?.ancillary_info as TableRecord;
  const returnItem: ItemInterface = {
    key: ancillaryInfo.ancillary as string,
    onscreen_name: stringInterpolator(ancillary.onscreen_name as string, globalData.parsedData[folder].text),
    colour_text: stringInterpolator(ancillary.colour_text as string, globalData.parsedData[folder].text),
    ui_icon: ancillaryImage(ancillary),
  };

  if (unlocked_at_rank !== undefined) returnItem.unlocked_at_rank = unlocked_at_rank;

  const effects: Array<EffectInterface> = [];
  // Standard Item Effects
  ancillaryInfo.foreignRefs?.ancillary_to_effects?.forEach((effectJunc) => {
    effects.push(processEffect(folder, globalData, effectJunc));
  });
  // Banner Effects
  ancillary.localRefs?.banners?.localRefs?.effect_bundles?.foreignRefs?.effect_bundles_to_effects_junctions?.forEach(
    (effectJunc) => {
      effects.push(processEffect(folder, globalData, effectJunc));
    },
  );
  effects.sort((a, b) => (a.priority as number) - (b.priority as number)).forEach((effect) => delete effect.priority);
  if (effects.length > 0) returnItem.effects = effects;

  // Item Set Effects
  ancillary?.foreignRefs?.ancillary_set_ancillary_junctions?.forEach((setJunc) => {
    const ancSet = setJunc?.localRefs?.ancillary_sets;
    if (ancSet !== undefined) {
      const contains = ancSet.foreignRefs?.ancillary_set_ancillary_junctions?.map((ancJunc) => {
        return {
          name: (ancJunc?.localRefs?.ancillaries?.onscreen_name as string) ?? 'Unknown',
          icon: ancillaryImage(ancJunc?.localRefs?.ancillaries),
        };
      });
      const effects = ancSet.foreignRefs?.ancillary_set_effect_junctions?.map((setEffect) => {
        return processEffect(folder, globalData, setEffect);
      });

      returnItem.item_set = {
        key: ancSet.key as string,
        name: ancSet.name as string,
        description: ancSet.description as string,
        contains,
        effects,
      };
    }
  });

  // Unit Cards
  const effects_related_unit_cards: Set<string> = new Set();
  returnItem.effects?.forEach((effect) => {
    effect.related_unit_cards_PARSER_ONLY?.forEach((card) => effects_related_unit_cards.add(card));
    delete effect.related_unit_cards_PARSER_ONLY;
  });
  if (effects_related_unit_cards.size > 0) returnItem.related_unit_cards = Array.from(effects_related_unit_cards);

  const set_related_unit_cards: Set<string> = new Set();
  returnItem.item_set?.effects?.forEach((effect) => {
    effect.related_unit_cards_PARSER_ONLY?.forEach((card) => set_related_unit_cards.add(card));
    delete effect.related_unit_cards_PARSER_ONLY;
  });
  if (set_related_unit_cards.size > 0) returnItem.item_set.related_unit_cards = Array.from(set_related_unit_cards);

  return returnItem;
};

const ancillaryImage = (ancillary: TableRecord | undefined) => {
  return ((ancillary?.localRefs?.ancillary_types?.ui_icon as string) ?? '')
    .replaceAll(' ', '_')
    .replace('.png', '')
    .replace(/^ui\/|^UI\/|^Ui\//, '');
};

export default processAncillary;
