import ancillaries_tables from './ancillaries.ts';
import battle_vortexs_tables from './battleVortexes.ts';
import character_skill_level_details_tables from './characterSkillLevelDetails.ts';
import character_skills_tables from './characterSkills.ts';
import effect_bundles_tables from './effectBundles.ts';
import effect_bundles_to_effects_junctions_tables from './effectBundlesToEffectsJunctions.ts';
import projectile_bombardments_tables from './projectileBombardments.ts';
import projectiles_tables from './projectiles.ts';
import projectiles_explosions_tables from './projectilesExplosions.ts';
import special_ability_phases_tables from './specialAbilityPhases.ts';
import unit_abilities_tables from './unitAbilities.ts';
import unit_special_abilities_tables from './unitSpecialAbilities.ts';

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
