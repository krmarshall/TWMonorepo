import { Table } from '../generateTables';
import { GlobalDataInterface, RefKey, TableRecord } from '../interfaces/GlobalDataInterface';
import { EffectInterface, StartPosTraitInterface } from '../interfaces/ProcessedTreeInterface';
import processEffect from './processEffect';

const processStartPosTraits = (
  folder: string,
  globalData: GlobalDataInterface,
  tables: { [key in RefKey]?: Table },
  agent: TableRecord,
  subcultureKey: string,
): undefined | StartPosTraitInterface => {
  const variants: StartPosTraitInterface = {};

  agent?.foreignRefs?.start_pos_characters?.forEach((spChar) =>
    spChar?.foreignRefs?.start_pos_character_traits?.forEach((spCharTrait) => {
      const startPosFaction = spChar?.localRefs?.start_pos_factions;
      if (startPosFaction?.localRefs?.factions?.subculture !== subcultureKey) {
        return;
      }

      const effects: Array<EffectInterface> = [];
      const traitLevel = spCharTrait?.localRefs?.character_trait_levels;
      if (traitLevel === undefined) {
        return;
      }

      traitLevel.foreignRefs?.trait_level_effects?.forEach((traitEffect) => {
        // Bunch of LL have hidden traits that just give titles, skip these
        if (traitEffect.localRefs?.effects?.description.includes('[HIDDEN]') && traitEffect.effect !== 'wh2_dlc11_enable_immortal_hidden') {
          return;
        }
        effects.push(processEffect(folder, globalData, traitEffect));
      });
      // If no linked effects trait is prob LL title trait, so skip
      if (effects.length === 0) {
        return;
      }

      // Both name and surname link to names_tables, so localRef would only be one of them
      const first = tables.names?.findRecordByKey('id', spChar.Name).name.trim() ?? 'MISSING';
      const last = tables.names?.findRecordByKey('id', spChar.Surname)?.name.trim() ?? '';
      const faction = startPosFaction?.localRefs?.factions?.screen_name ?? 'MISSING';
      const campaign = startPosFaction?.localRefs?.campaigns?.onscreen_name ?? 'MISSING';
      const imgPath =
        'vanilla3' +
        traitLevel?.localRefs?.trait_info?.foreignRefs?.character_traits?.[0]?.localRefs?.trait_categories?.icon_path
          .replace('campaign ui', 'campaign_ui')
          .replace(/^ui/, '')
          .replace('.png', '');

      variants[spChar.ID] = {
        name: `${first}${last.length === 0 ? '' : ' '}${last}`,
        campaign: campaign,
        faction: faction,
        trait: {
          key: traitLevel.key,
          image_path: imgPath,
          is_background_skill: true,
          localised_name: traitLevel.onscreen_name,
          localised_description: traitLevel.colour_text,
          character_skill_key: traitLevel.trait,
          tier: 6,
          indent: 99,
          points_on_creation: 0,
          required_num_parents: 0,
          visible_in_ui: true,
          levels: [{ effects: effects }],
        },
      };
    }),
  );

  if (Object.keys(variants).length !== 0) {
    return variants;
  }
  return undefined;
};

export default processStartPosTraits;
