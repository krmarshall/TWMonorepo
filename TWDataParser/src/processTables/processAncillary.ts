import { GlobalDataInterface, TableRecord } from '../@types/GlobalDataInterface.ts';
import { EffectInterface, ItemInterface } from '../@types/CharacterInterface.ts';
import { parseInteger } from '../utils/parseStringToTypes.ts';
import stringInterpolator from '../utils/stringInterpolator.ts';
import processEffect from './processEffect.ts';

const processAncillary = (
  folder: string,
  globalData: GlobalDataInterface,
  ancillaryJunc: TableRecord,
  unlocked_at_rank: string | undefined,
) => {
  const ancillary = ancillaryJunc.localRefs?.ancillaries as TableRecord;
  const ancillaryInfo = ancillary.localRefs?.ancillary_info as TableRecord;
  const returnItem: ItemInterface = {
    key: ancillaryInfo.ancillary,
    onscreen_name: stringInterpolator(ancillary.onscreen_name, globalData.parsedData[folder].text),
    colour_text: stringInterpolator(ancillary.colour_text, globalData.parsedData[folder].text),
    ui_icon: ancillaryImage(ancillary),
  };

  if (unlocked_at_rank !== undefined && unlocked_at_rank !== '')
    returnItem.unlocked_at_rank = parseInteger(unlocked_at_rank);

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
          name: ancJunc?.localRefs?.ancillaries?.onscreen_name ?? 'Unknown',
          icon: ancillaryImage(ancJunc?.localRefs?.ancillaries),
        };
      });
      const effects = ancSet.foreignRefs?.ancillary_set_effect_junctions?.map((setEffect) => {
        return processEffect(folder, globalData, setEffect);
      });

      returnItem.item_set = {
        key: ancSet.key,
        name: ancSet.name,
        description: ancSet.description,
        contains,
        effects,
      };
    }
  });
  return returnItem;
};

const ancillaryImage = (ancillary: TableRecord | undefined) => {
  return (ancillary?.localRefs?.ancillary_types?.ui_icon ?? '')
    .replaceAll(' ', '_')
    .replace('.png', '')
    .replace(/^ui\/|^UI\/|^Ui\//, '');
};

export default processAncillary;
