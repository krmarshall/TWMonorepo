import BuildInterface from '../@types/BuildInterface.ts';
import {
  AbilityInterface,
  AttributeInterface,
  CharacterInterface,
  EffectInterface,
  PhaseInterface,
  SkillInterface,
  UnitStatsInterface,
} from '../@types/CharacterInterfaceRef.ts';
import { splitCharacterKey } from './urlFunctions.ts';

const createEmptyCharacterBuild = (
  characterData: CharacterInterface,
  gameKey: string,
  factionKey: string,
  characterKey: string,
) => {
  let localCharacterData: CharacterInterface;
  const { cleanCharacter, cleanFaction } = splitCharacterKey(characterKey);
  if (cleanFaction !== '' && characterData.altFactionNodeSets !== undefined) {
    localCharacterData = addFactionVariantNodes(characterData.altFactionNodeSets[cleanFaction].nodes, characterData);
  } else {
    localCharacterData = characterData;
  }
  const emptyBuildArray: Array<Array<number>> = [];
  let rank = 1;
  let startingSkillPoints = 0;
  const selectedSkills: Array<string> = [];
  localCharacterData.skillTree.forEach((skillRow, yIndex) => {
    emptyBuildArray[yIndex] = [];
    skillRow.forEach((skill, xIndex) => {
      emptyBuildArray[yIndex][xIndex] = skill.points_on_creation;
      rank += skill.points_on_creation;
      startingSkillPoints += skill.points_on_creation;
      if (skill.points_on_creation > 0) {
        selectedSkills.push(skill.character_skill_key);
        selectedSkills.push(skill.key);
      }
    });
  });

  const emptyCharacterBuild: BuildInterface = {
    game: gameKey,
    faction: factionKey,
    character: cleanCharacter,
    buildData: emptyBuildArray,
    rank,
    startingSkillPoints,
    autoUnlockSkillPoints: 0,
    selectedSkills,
    blockedSkills: [],
  };
  return emptyCharacterBuild;
};

// Skills can be quest items that dont cost a rank (use_quest_for_prefix), or start with skill points already assigned (points_on_creation)
const createCharacterBuildFromArray = (
  arrayBuild: Array<Array<number>>,
  characterData: CharacterInterface,
  game: string,
  factionKey: string,
  characterKey: string,
) => {
  let localCharacterData: CharacterInterface;
  const { cleanCharacter, cleanFaction } = splitCharacterKey(characterKey);
  if (cleanFaction !== '' && characterData.altFactionNodeSets?.[cleanFaction] !== undefined) {
    localCharacterData = addFactionVariantNodes(characterData.altFactionNodeSets[cleanFaction].nodes, characterData);
  } else {
    localCharacterData = characterData;
  }

  let rank = 1;
  let startingSkillPoints = 0;
  let autoUnlockSkillPoints = 0;
  const selectedSkills: Array<string> = [];
  const blockedSkills: Array<string> = [];

  arrayBuild.forEach((row, y) => {
    row.forEach((skill, x) => {
      if (skill > 0) {
        rank += skill;

        selectedSkills.push(localCharacterData.skillTree[y][x].character_skill_key);
        selectedSkills.push(localCharacterData.skillTree[y][x].key);

        if (localCharacterData.skillTree[y][x].points_on_creation > 0) {
          startingSkillPoints += localCharacterData.skillTree[y][x].points_on_creation;
        }

        localCharacterData.skillTree[y][x].levels?.forEach((level, index) => {
          if (index + 1 <= skill) {
            if (level.blocks_skill_node_keys !== undefined) {
              blockedSkills.push(...level.blocks_skill_node_keys);
            }
          }

          if (level.auto_unlock_at_rank !== undefined) {
            autoUnlockSkillPoints++;
          }
        });
      }
    });
  });
  const newCharacterBuild: BuildInterface = {
    game,
    faction: factionKey,
    character: cleanCharacter,
    buildData: arrayBuild,
    rank,
    startingSkillPoints,
    autoUnlockSkillPoints,
    selectedSkills,
    blockedSkills,
  };
  return newCharacterBuild;
};

const trimString = (string: string, length = 75) => {
  let trimmedString = string;
  if (trimmedString.length > length) {
    trimmedString = trimmedString.substring(0, length);
    trimmedString += '...';
  }
  return trimmedString;
};

const getRelatedAbilities = (effectsArray: Array<EffectInterface> | undefined) => {
  const relatedAbilities: Array<AbilityInterface> = [];
  const relatedAbilitiesKeys: Array<string> = [];

  effectsArray?.forEach((effect) => {
    if (effect.related_abilities) {
      effect.related_abilities.forEach((ability) => {
        let keyCheck = ability.unit_ability.key;
        if (keyCheck.endsWith('_upgraded')) {
          keyCheck = keyCheck.replace(/_upgraded$/, '');
        }
        if (!relatedAbilitiesKeys.includes(keyCheck)) {
          relatedAbilities.push(ability);
          relatedAbilitiesKeys.push(keyCheck);
        }
      });
    }
  });

  return relatedAbilities;
};

const getRelatedContactPhases = (ability: AbilityInterface | undefined, effects?: Array<EffectInterface>) => {
  const relatedPhases: Array<PhaseInterface> = [];
  const relatedPhaseKeys: Array<string> = [];

  effects?.forEach((effect) =>
    effect.related_phases?.forEach((phase) => {
      if (!relatedPhaseKeys.includes(phase.icon)) {
        relatedPhases.push(phase);
        relatedPhaseKeys.push(phase.icon);
      }
    }),
  );

  if (ability === undefined) {
    return relatedPhases;
  }

  if (ability.unit_ability.activated_projectile?.contact_stat_effect !== undefined) {
    const keyCheck = ability.unit_ability.activated_projectile?.contact_stat_effect.icon;
    if (!relatedPhaseKeys.includes(keyCheck)) {
      relatedPhases.push(ability.unit_ability.activated_projectile?.contact_stat_effect);
      relatedPhaseKeys.push(keyCheck);
    }
  }

  if (ability.unit_ability.activated_projectile?.explosion_type?.contact_phase_effect !== undefined) {
    const keyCheck = ability.unit_ability.activated_projectile?.explosion_type?.contact_phase_effect.icon;
    if (!relatedPhaseKeys.includes(keyCheck)) {
      relatedPhases.push(ability.unit_ability.activated_projectile?.explosion_type?.contact_phase_effect);
      relatedPhaseKeys.push(keyCheck);
    }
  }

  if (ability.unit_ability.vortex?.contact_effect !== undefined) {
    const keyCheck = ability.unit_ability.vortex?.contact_effect.icon;
    if (!relatedPhaseKeys.includes(keyCheck)) {
      relatedPhases.push(ability.unit_ability.vortex?.contact_effect);
      relatedPhaseKeys.push(keyCheck);
    }
  }

  if (ability.unit_ability?.bombardment?.projectile_type?.contact_stat_effect !== undefined) {
    const keyCheck = ability.unit_ability?.bombardment?.projectile_type?.contact_stat_effect.icon;
    if (!relatedPhaseKeys.includes(keyCheck)) {
      relatedPhases.push(ability.unit_ability?.bombardment?.projectile_type?.contact_stat_effect);
      relatedPhaseKeys.push(keyCheck);
    }
  }

  ability.unit_ability.phases?.forEach((phase) => {
    if (phase.imbue_contact !== undefined) {
      const keyCheck = phase.imbue_contact.icon;
      if (!relatedPhaseKeys.includes(keyCheck)) {
        relatedPhases.push(phase.imbue_contact);
        relatedPhaseKeys.push(keyCheck);
      }
    }
  });

  return relatedPhases;
};

const getRelatedAttributes = (ability: AbilityInterface | undefined, effects?: Array<EffectInterface>) => {
  const relatedAttributes: Array<AttributeInterface> = [];
  const relatedAttributeKeys: Array<string> = [];

  const addAttribute = (attribute: AttributeInterface) => {
    if (!relatedAttributeKeys.includes(attribute.key)) {
      relatedAttributes.push(attribute);
      relatedAttributeKeys.push(attribute.key);
    }
  };

  effects?.forEach((effect) => {
    effect?.related_attributes?.forEach((attribute) => addAttribute(attribute));
  });

  if (ability === undefined) {
    return relatedAttributes;
  }

  ability.unit_ability?.phases?.forEach((phase) => phase.attributes?.forEach((attribute) => addAttribute(attribute)));
  ability.unit_ability?.activated_projectile?.contact_stat_effect?.attributes?.forEach((attribute) =>
    addAttribute(attribute),
  );
  ability.unit_ability?.activated_projectile?.explosion_type?.contact_phase_effect?.attributes?.forEach((attribute) =>
    addAttribute(attribute),
  );
  ability.unit_ability?.activated_projectile?.spawned_vortex?.contact_effect?.attributes?.forEach((attribute) =>
    addAttribute(attribute),
  );
  ability.unit_ability?.bombardment?.projectile_type?.contact_stat_effect?.attributes?.forEach((attribute) =>
    addAttribute(attribute),
  );
  ability.unit_ability?.bombardment?.projectile_type?.explosion_type?.contact_phase_effect?.attributes?.forEach(
    (attribute) => addAttribute(attribute),
  );
  ability.unit_ability?.bombardment?.projectile_type?.spawned_vortex?.contact_effect?.attributes?.forEach((attribute) =>
    addAttribute(attribute),
  );
  ability.unit_ability?.vortex?.contact_effect?.attributes?.forEach((attribute) => addAttribute(attribute));

  return relatedAttributes;
};

const getUnitStatSets = (characterData: CharacterInterface | null) => {
  const unitStatSets: Array<{ name: string; stats: UnitStatsInterface }> = [];
  const unitStatNames: Array<string> = [];

  if (characterData?.unitStats !== undefined) {
    unitStatSets.push({ name: 'Base', stats: characterData?.unitStats });
  }
  characterData?.skillTree.forEach((skillLine) =>
    skillLine.forEach((skill) =>
      skill.levels?.forEach((skillLevel) => {
        if (skillLevel.mount_unit_stats !== undefined && !unitStatNames.includes(skill.localised_name)) {
          unitStatNames.push(skill.localised_name);
          unitStatSets.push({ name: skill.localised_name, stats: skillLevel.mount_unit_stats });
        }
      }),
    ),
  );

  characterData?.backgroundSkills?.forEach((bgSkill) =>
    bgSkill.levels?.forEach((skillLevel) => {
      if (skillLevel?.mount_unit_stats !== undefined && !unitStatNames.includes(bgSkill.localised_name)) {
        unitStatNames.push(bgSkill.localised_name);
        unitStatSets.push({ name: bgSkill.localised_name, stats: skillLevel.mount_unit_stats });
      }
    }),
  );

  return unitStatSets;
};

const addFactionVariantNodes = (factionNodes: Array<SkillInterface>, characterData: CharacterInterface) => {
  const derefCharacterData: CharacterInterface = JSON.parse(JSON.stringify(characterData));
  const sortIndents = new Set<number>();
  factionNodes.forEach((node) => {
    const replaceIndex = derefCharacterData.skillTree[node.indent].findIndex(
      (genericNode) => genericNode.tier === node.tier,
    );
    if (replaceIndex === -1) {
      derefCharacterData.skillTree[node.indent].push(node);
      sortIndents.add(node.indent);
    } else {
      derefCharacterData.skillTree[node.indent][replaceIndex] = node;
    }
  });

  sortIndents.forEach((indent) => derefCharacterData.skillTree[indent].sort((a, b) => a.tier - b.tier));
  return derefCharacterData;
};

const setFontSize = (string: string) => {
  let fontSize;
  if (string.length > 52) {
    fontSize = 'text-xs';
  } else if (string.length > 37) {
    fontSize = 'text-sm';
  } else if (string.length > 25) {
    fontSize = 'text-base';
  } else {
    fontSize = 'text-xl';
  }

  return fontSize;
};

const replaceKeepCaps = (string: string, search: string | null = '') => {
  return string.replace(new RegExp('(' + search + ')', 'ig'), '<span class="searchHighlight">$1</span>');
};

// Really verbose way of doing this, but tailwind needs the whole class present to generate it
const getBgUrl = (selectedFaction: string | undefined) => {
  let returnUrl = ' bg-[url(/imgs/other/bgs/default/bg.webp)]';
  switch (selectedFaction) {
    case 'brt_bretonnia':
      returnUrl = ' bg-[url(/imgs/other/bgs/brt_bretonnia/bg.webp)]';
      break;
    case 'bst_beastmen':
      returnUrl = ' bg-[url(/imgs/other/bgs/bst_beastmen/bg.webp)]';
      break;
    case 'chs_chaos':
      returnUrl = ' bg-[url(/imgs/other/bgs/chs_chaos/bg.webp)]';
      break;
    case 'cst_vampire_coast':
      returnUrl = ' bg-[url(/imgs/other/bgs/cst_vampire_coast/bg.webp)]';
      break;
    case 'cth_cathay':
      returnUrl = ' bg-[url(/imgs/other/bgs/cth_cathay/bg.webp)]';
      break;
    case 'dae_daemons':
      returnUrl = ' bg-[url(/imgs/other/bgs/dae_daemons/bg.webp)]';
      break;
    case 'def_dark_elves':
      returnUrl = ' bg-[url(/imgs/other/bgs/def_dark_elves/bg.webp)]';
      break;
    case 'grn_greenskins':
      returnUrl = ' bg-[url(/imgs/other/bgs/grn_greenskins/bg.webp)]';
      break;
    case 'kho_khorne':
      returnUrl = ' bg-[url(/imgs/other/bgs/kho_khorne/bg.webp)]';
      break;
    case 'ksl_kislev':
      returnUrl = ' bg-[url(/imgs/other/bgs/ksl_kislev/bg.webp)]';
      break;
    case 'lzd_lizardmen':
      returnUrl = ' bg-[url(/imgs/other/bgs/lzd_lizardmen/bg.webp)]';
      break;
    case 'nur_nurgle':
      returnUrl = ' bg-[url(/imgs/other/bgs/nur_nurgle/bg.webp)]';
      break;
    case 'ogr_ogre_kingdoms':
      returnUrl = ' bg-[url(/imgs/other/bgs/ogr_ogre_kingdoms/bg.webp)]';
      break;
    case 'skv_skaven':
      returnUrl = ' bg-[url(/imgs/other/bgs/skv_skaven/bg.webp)]';
      break;
    case 'sla_slaanesh':
      returnUrl = ' bg-[url(/imgs/other/bgs/sla_slaanesh/bg.webp)]';
      break;
    case 'tmb_tomb_kings':
      returnUrl = ' bg-[url(/imgs/other/bgs/tmb_tomb_kings/bg.webp)]';
      break;
    case 'tze_tzeentch':
      returnUrl = ' bg-[url(/imgs/other/bgs/tze_tzeentch/bg.webp)]';
      break;
    case 'vmp_vampire_counts':
      returnUrl = ' bg-[url(/imgs/other/bgs/vmp_vampire_counts/bg.webp)]';
      break;
    default:
      returnUrl = ' bg-[url(/imgs/other/bgs/default/bg.webp)]';
      break;
  }
  return returnUrl;
};

export {
  createEmptyCharacterBuild,
  createCharacterBuildFromArray,
  trimString,
  getRelatedAbilities,
  getRelatedContactPhases,
  getRelatedAttributes,
  getUnitStatSets,
  setFontSize,
  getBgUrl,
  addFactionVariantNodes,
  replaceKeepCaps,
};
