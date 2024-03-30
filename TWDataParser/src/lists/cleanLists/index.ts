import ancillaries_tables from './ancillaries';
import battle_vortexs_tables from './battleVortexes';
import character_skill_level_details_tables from './characterSkillLevelDetails';
import character_skills_tables from './characterSkills';
import effect_bundles_tables from './effectBundles';
import effect_bundles_to_effects_junctions_tables from './effectBundlesToEffectsJunctions';
import projectile_bombardments_tables from './projectileBombardments';
import projectiles_tables from './projectiles';
import projectiles_explosions_tables from './projectilesExplosions';
import special_ability_phases_tables from './specialAbilityPhases';
import unit_abilities_tables from './unitAbilities';
import unit_special_abilities_tables from './unitSpecialAbilities';

const cleanLists: { [key: string]: Array<string> } = {
  ancillaries_tables,
  character_skill_level_details_tables,
  character_skills_tables,
  special_ability_phases_tables,
  unit_abilities_tables,
  unit_special_abilities_tables,
  battle_vortexs_tables,
  effect_bundles_to_effects_junctions_tables,
  effect_bundles_tables,
  projectile_bombardments_tables,
  projectiles_explosions_tables,
  projectiles_tables,
};

export default cleanLists;
