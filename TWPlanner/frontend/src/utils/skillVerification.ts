import { toast } from 'react-hot-toast';
import BuildInterface from '../@types/BuildInterface.ts';
import { CharacterInterface, SkillInterface } from '../@types/CharacterInterfaceRef.ts';

const isRequiredLevel = (
  characterBuild: BuildInterface | null,
  thisSkillsCurrentPoints: number,
  skill: SkillInterface,
) => {
  const skillCheckRank = skill?.levels?.[thisSkillsCurrentPoints];
  if (!skillCheckRank?.unlocked_at_rank) {
    return true;
  }
  if (characterBuild?.rank) {
    if (skill.points_on_creation > 0 && thisSkillsCurrentPoints + 1 <= skill.points_on_creation) {
      return true;
    }

    if (
      characterBuild?.rank - characterBuild?.startingSkillPoints - characterBuild?.autoUnlockSkillPoints >=
      skillCheckRank?.unlocked_at_rank - 1
    ) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};

const hasRequiredSkill = (
  skill: SkillInterface,
  characterBuild: BuildInterface | null,
  backgroundSkills: Array<SkillInterface> | undefined,
) => {
  if (skill.parent_required === undefined) {
    return true;
  }

  let includesParentRequired = false;
  if (characterBuild?.selectedSkills && characterBuild?.selectedSkills.length > 0) {
    skill.parent_required?.forEach((parent) => {
      if (characterBuild?.selectedSkills.includes(parent)) {
        includesParentRequired = true;
      }
    });
    if (includesParentRequired) {
      return includesParentRequired;
    }
  }

  if (backgroundSkills !== undefined && backgroundSkills.length > 0) {
    skill.parent_required?.forEach((parent) => {
      backgroundSkills.forEach((bgSkill) => {
        if (bgSkill.key === parent || bgSkill.character_skill_key === parent) {
          includesParentRequired = true;
        }
      });
    });
    if (includesParentRequired) {
      return includesParentRequired;
    }
  }

  return false;
};

const skillIsBlocked = (skillNodeKey: string, characterBuild: BuildInterface | null) => {
  if (characterBuild?.blockedSkills.length === 0) {
    return false;
  }
  if (characterBuild?.blockedSkills) {
    if (characterBuild.blockedSkills.includes(skillNodeKey)) {
      return true;
    } else {
      return false;
    }
  }
  return true;
};

const missingRequiredPoints = (
  characterData: CharacterInterface | null,
  characterBuild: BuildInterface | null,
  skill: SkillInterface,
) => {
  if (skill.required_num_parents === 0) {
    return false;
  }
  if (
    skill.required_num_parents > 0 &&
    skill.parent_subset_required === undefined &&
    skill.parent_required === undefined
  ) {
    return;
  }

  if (characterBuild?.buildData && skill.parent_subset_required) {
    let spentPoints = 0;
    for (let i = 0; i < skill.parent_subset_required.length; i++) {
      const parentSkill = findSkill(characterData, characterBuild, skill.parent_subset_required[i]);
      if (parentSkill === undefined) {
        // Some skills like Kairos Bewitching Potency have parent subset required entries that dont exist in the tree.
        // console.log(`${skill.parent_subset_required[i]} not in tree.`);
      } else {
        spentPoints += parentSkill.points;
      }
    }
    if (spentPoints >= skill.required_num_parents) {
      return false;
    } else {
      return true;
    }
  }

  if (characterBuild?.buildData && skill.parent_required) {
    let spentPoints = 0;
    for (let i = 0; i < skill.parent_required.length; i++) {
      const parentSkill = findSkill(characterData, characterBuild, skill.parent_required[i]);
      if (parentSkill === undefined) {
        return true;
      }
      if (
        (characterData?.skillTree[parentSkill.yIndex][parentSkill.xIndex].levels?.length as number) <
        skill.required_num_parents
      ) {
        return false;
      }
      spentPoints += parentSkill.points;
    }
    if (spentPoints >= skill.required_num_parents) {
      return false;
    } else {
      return true;
    }
  }
  return true;
};

const findSkill = (
  characterData: CharacterInterface | null,
  characterBuild: BuildInterface | null,
  skillKey: string,
) => {
  let returnValue: undefined | { xIndex: number; yIndex: number; points: number };
  characterData?.skillTree.forEach((row, yIndex) => {
    row.forEach((skill, xIndex) => {
      if (skill.key === skillKey) {
        returnValue = { xIndex, yIndex, points: characterBuild?.buildData[yIndex][xIndex] as number };
      }
    });
  });
  if (returnValue === undefined) {
    console.log('Could not find skill in data tree');
  }
  return returnValue;
};

const skillIsValid = (
  characterBuild: BuildInterface | null,
  skill: SkillInterface,
  thisSkillsCurrentPoints: number,
  skillKey: string,
  characterData: CharacterInterface | null,
) => {
  // Check Required Level
  if (!isRequiredLevel(characterBuild, thisSkillsCurrentPoints - 1, skill)) {
    return false;
  }
  // Check Required Skills
  if (!hasRequiredSkill(skill, characterBuild, characterData?.backgroundSkills)) {
    return false;
  }
  // Check Blocked skills
  if (skillIsBlocked(skill.key, characterBuild)) {
    return false;
  }
  // Check x points in last y skills
  if (missingRequiredPoints(characterData, characterBuild, skill)) {
    return false;
  }
  return true;
};

const skillIncreaseIsValid = (
  characterBuild: BuildInterface | null,
  characterData: CharacterInterface | null,
  skill: SkillInterface,
  thisSkillsCurrentPoints: number,
  skillKey: string,
  printError: boolean,
) => {
  // Check if skill has higher rank than already selected
  if (!skill.levels?.[thisSkillsCurrentPoints]) {
    if (printError) {
      toast.error('A higher skill rank does not exist.', { id: `${skillKey} higher rank` });
    }
    return false;
  }
  // Check Required Level
  if (!isRequiredLevel(characterBuild, thisSkillsCurrentPoints, skill)) {
    if (printError) {
      toast.error(`Requires rank ${skill.levels?.[thisSkillsCurrentPoints]?.unlocked_at_rank}`, {
        id: `${skillKey} requires rank`,
      });
    }
    return false;
  }
  // Check Required Skills
  if (!hasRequiredSkill(skill, characterBuild, characterData?.backgroundSkills)) {
    if (printError) {
      const skillLocation = findSkill(characterData, characterBuild, skill?.parent_required?.[0] as string);
      const skillName =
        characterData?.skillTree[skillLocation?.yIndex as number][skillLocation?.xIndex as number].localised_name;
      toast.error(`Requires ${skillName}`, { id: `${skillKey} requires` });
    }
    return false;
  }
  // Check Blocked skills
  if (skillIsBlocked(skill.key, characterBuild)) {
    if (printError) {
      toast.error(`Skill is blocked by another skill.`, { id: `${skillKey} blocked` });
    }
    return false;
  }
  // Check x points in last y skills
  if (missingRequiredPoints(characterData, characterBuild, skill)) {
    if (printError) {
      toast.error(`Requires more points in required skills.`, { id: `${skillKey} more points` });
    }
    return false;
  }
  return true;
};

const isValidSkillTree = (characterBuild: BuildInterface, characterData: CharacterInterface) => {
  const skillBuildArray = characterBuild?.buildData;
  // Should probably size this dynamically
  const skillKeyArray = [...Array(characterData.skillTree.length)].map(() => Array(35).fill(''));
  const skillDataArray = characterData.skillTree.map((skillRow, yIndex) => {
    return skillRow.map((skill, xIndex) => {
      skillKeyArray[yIndex][xIndex] = skill.key;
      return skill;
    });
  });

  let valid = true;
  for (let y = 0; y < skillBuildArray?.length && valid; y++) {
    if (skillBuildArray[y].length === 0) {
      continue;
    }
    for (let x = 0; x < skillBuildArray[y].length && valid; x++) {
      if (skillBuildArray[y][x] > 0) {
        if (
          !skillIsValid(characterBuild, skillDataArray[y][x], skillBuildArray[y][x], skillKeyArray[y][x], characterData)
        ) {
          valid = false;
        }
      }
    }
  }
  return valid;
};

export {
  isRequiredLevel,
  hasRequiredSkill,
  skillIsBlocked,
  missingRequiredPoints,
  findSkill,
  skillIsValid,
  skillIncreaseIsValid,
  isValidSkillTree,
};
