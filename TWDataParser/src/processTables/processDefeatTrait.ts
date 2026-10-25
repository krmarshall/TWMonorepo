import processEffect from './processEffect.ts';
import type { SkillInterface } from '../@types/CharacterInterface.ts';
import type { GlobalDataInterface, TableRecord } from '../@types/GlobalDataInterface.ts';

const processDefeatTrait = (folder: string, globalData: GlobalDataInterface, trait: TableRecord) => {
  const traitLevel = (trait?.foreignRefs?.character_trait_levels as TableRecord[])[0];
  const effects = traitLevel?.foreignRefs?.trait_level_effects?.map((traitEffect) =>
    processEffect(folder, globalData, traitEffect),
  );
  if (effects?.length === 0 || effects === undefined) {
    return;
  }
  const defeatTrait: SkillInterface = {
    key: traitLevel.key as string,
    image_path: 'vanilla3/campaign_ui/skills/character_wound_time',
    is_background_skill: true,
    localised_name: traitLevel.onscreen_name as string,
    localised_description: traitLevel.colour_text as string,
    character_skill_key: traitLevel.key as string,
    tier: 6,
    indent: 98,
    points_on_creation: 0,
    required_num_parents: 0,
    visible_in_ui: true,
    levels: [{ effects: effects }],
  };
  return defeatTrait;
};

export default processDefeatTrait;
