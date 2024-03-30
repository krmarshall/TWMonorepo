import { GlobalDataInterface, TableRecord } from '../interfaces/GlobalDataInterface';
import { ItemInterface, SkillInterface, SkillLevelInterface } from '../interfaces/ProcessedTreeInterface';
import findImage from '../utils/findImage';
import log from '../utils/log';
import { parseBoolean, parseInteger } from '../utils/parseStringToTypes';
import stringInterpolator from '../utils/stringInterpolator';
import processAncillary from './processAncillary';
import processEffect from './processEffect';
import processUnitStats from './processUnitStats';

const processSkillNode = (
  folder: string,
  globalData: GlobalDataInterface,
  skillNode: TableRecord,
  skillNodeKeys: { [key: string]: boolean },
  items: Array<ItemInterface>,
  subsetRequiredMap: { [key: string]: Array<SkillInterface> },
  requiredMap: { [key: string]: Array<SkillInterface> },
) => {
  const skill = skillNode.localRefs?.character_skills as TableRecord;
  if (skill.key === 'wh3_main_skill_agent_action_success_scaling' || skill.key === 'wh3_dlc20_skill_path_to_glory_cost_modifier') {
    return;
  }
  const returnSkill: SkillInterface = {
    key: skillNode.key,
    image_path: findSkillImage(folder, globalData, skill.image_path),
    character_skill_key: skillNode.character_skill_key,
    tier: parseInteger(skillNode.tier),
    indent: parseInteger(skillNode.indent),
    points_on_creation: parseInteger(skillNode.points_on_creation),
    required_num_parents: parseInteger(skillNode.required_num_parents),
    visible_in_ui: parseBoolean(skillNode.visible_in_ui),
    is_background_skill: parseBoolean(skill.is_background_skill),
    localised_name: stringInterpolator(skill.localised_name, globalData.parsedData[folder].text),
    localised_description: stringInterpolator(skill.localised_description, globalData.parsedData[folder].text),
  };

  if (skillNode.subculture !== '') returnSkill.subculture = skillNode.subculture;
  if (skillNode.faction_key !== '') returnSkill.faction = skillNode.faction_key;

  // character_skill_level_to_effects_junctions
  skill.foreignRefs?.character_skill_level_to_effects_junctions?.forEach((effectJunc) => {
    // Most skills have a hidden effect that increases or decreases agent action chances, dont add these
    if (
      (effectJunc.effect_key === 'wh_main_effect_agent_action_success_chance_enemy_skill' &&
        effectJunc.localRefs?.effects?.priority === '0') ||
      (effectJunc.effect_key === 'wh_main_effect_agent_action_success_chance_skill' && effectJunc.localRefs?.effects?.priority === '0')
    ) {
      return;
    }
    const skillLevel = parseInteger(effectJunc.level) - 1;
    returnSkill.levels = checkSkillLevelExists(returnSkill.levels, skillLevel);
    returnSkill.levels[skillLevel]?.effects?.push(processEffect(folder, globalData, effectJunc as TableRecord));
  });
  // character_skill_level_to_ancillaries_junctions
  skill.foreignRefs?.character_skill_level_to_ancillaries_junctions?.forEach((ancillaryJunc) => {
    const ancillaryEffects = ancillaryJunc.localRefs?.ancillaries?.localRefs?.ancillary_info?.foreignRefs?.ancillary_to_effects;
    const skillLevel = parseInteger(ancillaryJunc.level) - 1;
    if (ancillaryEffects !== undefined) {
      ancillaryEffects.forEach((effectJunc) => {
        returnSkill.levels = checkSkillLevelExists(returnSkill.levels, skillLevel);
        returnSkill.levels[skillLevel]?.effects?.push(processEffect(folder, globalData, effectJunc as TableRecord));
      });
    }
    if (ancillaryJunc.localRefs?.ancillaries?.category === 'mount') {
      const main_unit = ancillaryJunc.localRefs?.ancillaries?.localRefs?.main_units;
      if (main_unit !== undefined) {
        returnSkill.levels = checkSkillLevelExists(returnSkill.levels, skillLevel);
        returnSkill.levels[skillLevel].mount_unit_stats = processUnitStats(folder, globalData, main_unit);
      }
    }
  });
  // character_skills_to_quest_ancillaries
  skill.foreignRefs?.character_skills_to_quest_ancillaries?.forEach((quest) => {
    returnSkill.use_quest_for_prefix = parseBoolean(quest.use_quest_for_prefix);
    if (quest?.localRefs?.ancillaries?.category !== undefined && quest?.localRefs?.ancillaries?.category !== 'mount') {
      items.push(processAncillary(folder, globalData, quest, undefined));
    }
  });
  // character_skill_level_details
  skill.foreignRefs?.character_skill_level_details?.forEach((skillLevelDetails) => {
    const skillLevel = parseInteger(skillLevelDetails.level) - 1;
    const item = items.find((item) => item.character_skill === skillLevelDetails.skill_key);
    if (item !== undefined) {
      item.unlocked_at_rank = parseInteger(skillLevelDetails.unlocked_at_rank) + 1;
    } else {
      if (returnSkill.levels === undefined) returnSkill.levels = [];
      if (returnSkill.levels[skillLevel] === undefined) returnSkill.levels[skillLevel] = {};
      returnSkill.levels[skillLevel].unlocked_at_rank = parseInteger(skillLevelDetails.unlocked_at_rank) + 1;
    }
  });
  // character_skills_to_level_reached_criterias WH3
  skill.foreignRefs?.character_skills_to_level_reached_criterias?.forEach((levelReached) => {
    if (levelReached.character_level === '0') {
      returnSkill.points_on_creation = 1;
    } else {
      const upgradeToSkillLevel = parseInteger(levelReached.upgrade_to_skill_level) - 1;
      const item = items.find((item) => item.character_skill === levelReached.character_skill);
      if (item !== undefined) {
        item.unlocked_at_rank = parseInteger(levelReached.character_level) + 1;
      } else {
        if (returnSkill.levels === undefined) returnSkill.levels = [];
        if (returnSkill.levels[upgradeToSkillLevel] === undefined) returnSkill.levels[upgradeToSkillLevel] = {};
        returnSkill.levels[upgradeToSkillLevel].auto_unlock_at_rank = parseInteger(levelReached.character_level) + 1;
        delete returnSkill.levels?.[upgradeToSkillLevel].unlocked_at_rank;
      }
    }
  });
  // character_skill_nodes_skill_locks
  skill.foreignRefs?.character_skill_nodes_skill_locks?.forEach((lock) => {
    const skillLevel = parseInteger(lock.level) - 1;
    if (returnSkill.levels?.[skillLevel] === undefined) {
      log(`Skill node lock missing its skill level: ${returnSkill.key}`, 'red');
    } else if (skillNodeKeys[lock.character_skill_node] === true) {
      if (returnSkill.levels[skillLevel].blocks_skill_node_keys === undefined) returnSkill.levels[skillLevel].blocks_skill_node_keys = [];
      if (!returnSkill.levels[skillLevel].blocks_skill_node_keys?.includes(lock.character_skill_node)) {
        returnSkill.levels[skillLevel].blocks_skill_node_keys?.push(lock.character_skill_node);
      }
    }
  });
  // character_skill_node_links
  const parent_required: Array<string> = [];
  const parent_subset_required: Array<string> = [];
  skillNode.foreignRefs?.character_skill_node_links?.forEach((link) => {
    if (skillNodeKeys[link.parent_key] === undefined || skillNodeKeys[link.child_key] === undefined) {
      // If one of the nodes the links refer to isnt in the node set then ignore it
    } else {
      if (skillNode.key === link.parent_key) {
        if (link.link_type === 'REQUIRED') {
          returnSkill.right_arrow = true;
        }
        if (link.link_type === 'SUBSET_REQUIRED') {
          if (subsetRequiredMap[link.child_key] === undefined) subsetRequiredMap[link.child_key] = [];
          subsetRequiredMap[link.child_key].push(returnSkill);
        }
      }
      if (skillNode.key === link.child_key) {
        if (link.link_type === 'REQUIRED') {
          parent_required.push(link.parent_key);
          if (requiredMap[link.parent_key] === undefined) requiredMap[link.parent_key] = [];
          requiredMap[link.parent_key].push(returnSkill);
        }
        if (link.link_type === 'SUBSET_REQUIRED') {
          parent_subset_required.push(link.parent_key);
        }
      }
    }
  });
  if (parent_required.length > 0) returnSkill.parent_required = parent_required;
  if (parent_subset_required.length > 0) returnSkill.parent_subset_required = parent_subset_required;

  // sort effects by priority and delete them after
  returnSkill.levels?.forEach((level) => {
    level.effects?.sort((a, b) => (a.priority as number) - (b.priority as number)).forEach((effect) => delete effect.priority);
  });
  // remove duplicate abilities on the same level
  returnSkill.levels?.forEach((level) => {
    const levelAbilitiesSet: Set<string> = new Set();
    level.effects?.forEach((effect) => {
      const deleteIndexes: Array<number> = [];
      effect.related_abilities?.forEach((ability, index) => {
        if (levelAbilitiesSet.has(ability.unit_ability.key)) {
          deleteIndexes.push(index);
        } else {
          levelAbilitiesSet.add(ability.unit_ability.key);
        }
      });

      deleteIndexes.reverse().forEach((deleteIndex) => effect.related_abilities?.splice(deleteIndex, 1));
      if (effect.related_abilities?.length === 0) delete effect.related_abilities;
    });
  });

  return returnSkill;
};

export default processSkillNode;

const findSkillImage = (folder: string, globalData: GlobalDataInterface, image_path: string) => {
  const icon = image_path.replace('.png', '').trim();
  const searchArray = [
    `campaign_ui/skills/${icon}`,
    `campaign_ui/skills/${icon.toLowerCase()}`,
    // WH2 has pretty much all the skill icons in campaign_ui, WH3 has many of the spells/abilities under battle_ui
    `battle_ui/ability_icons/${icon}`,
    `battle_ui/ability_icons/${icon.toLowerCase()}`,
    // SFO2 some ability icons have _active in the icon_name, but not actual image name
    `campaign_ui/skills/${icon.replace('_active', '')}`,
    `campaign_ui/skills/${icon.replace('_active', '').toLowerCase()}`,
  ];

  return findImage(folder, globalData, searchArray, icon);
};

const checkSkillLevelExists = (levels: Array<SkillLevelInterface> | undefined, skillLevel: number) => {
  if (levels === undefined) levels = [];
  if (levels[skillLevel] === undefined) levels[skillLevel] = {};
  if (levels[skillLevel].effects === undefined) levels[skillLevel].effects = [];
  return levels;
};
