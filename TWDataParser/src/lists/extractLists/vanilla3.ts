import { v2DbList, v2LocList } from './vanilla2';

const v3DbList = [
  ...v2DbList,
  'character_ancillary_quest_ui_details',
  'character_skills_to_level_reached_criterias',
  'faction_starting_general_effects',
  'special_ability_spreadings',
  'campaign_character_art_sets',
  'character_skill_node_set_items',
  'trait_info',
  'trait_categories',
  'character_trait_levels',
  'character_traits',
  'trait_level_effects',
  'names',
  'start_pos_factions',
  'campaigns',
  'ancillaries_included_agent_subtypes',
  'ancillary_sets',
  'ancillary_set_ancillary_junctions',
  'ancillary_set_effect_junctions',

  // Tech
  'technology_ui_group_links',
] as const;

// If adding new loc table delete old extracted_files to force a re-extract
const v3LocList = [...v2LocList, 'character_trait_levels__', 'names__', 'campaigns__', 'units_custom_battle_mounts__', 'ancillary_sets__'];

export { v3DbList, v3LocList };
