import ancillaries from './ancillaries.ts';
import battle_vortexs from './battleVortexes.ts';
import character_skill_level_details from './characterSkillLevelDetails.ts';
import character_skills from './characterSkills.ts';
import effect_bundles from './effectBundles.ts';
import effect_bundles_to_effects_junctions from './effectBundlesToEffectsJunctions.ts';
import projectile_bombardments from './projectileBombardments.ts';
import projectiles from './projectiles.ts';
import projectiles_explosions from './projectilesExplosions.ts';
import special_ability_phases from './specialAbilityPhases.ts';
import unit_abilities from './unitAbilities.ts';
import unit_special_abilities from './unitSpecialAbilities.ts';

const cleanLists: { [key: string]: Array<string> } = {
  ancillaries,
  character_skill_level_details,
  character_skills,
  special_ability_phases,
  unit_abilities,
  unit_special_abilities,
  battle_vortexs,
  effect_bundles_to_effects_junctions,
  effect_bundles,
  projectile_bombardments,
  projectiles_explosions,
  projectiles,
};

export default cleanLists;
