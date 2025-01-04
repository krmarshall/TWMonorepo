import { MouseEvent, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { AppContext, AppContextActions } from '../../contexts/AppContext.tsx';
import { skillIncreaseIsValid, isValidSkillTree } from '../../utils/skillVerification.ts';
import BuildInterface from '../../@types/BuildInterface.ts';
import { CharacterInterface, SkillInterface } from '../../@types/CharacterInterfaceRef.ts';
import TooltipWrapper from '../TooltipWrapper.tsx';

import autoSkillIcon from '../../imgs/other/skill_auto_unlock_rank.webp';
import BaseCell from './BaseCell.tsx';

interface SkillCellPropsInterface {
  skill: SkillInterface;
  skillKey: string;
  yIndex: number;
  xIndex: number;
  boxedType: string;
}

const SkillCell = ({ skill, skillKey, yIndex, xIndex, boxedType }: SkillCellPropsInterface) => {
  const { state, dispatch } = useContext(AppContext);
  const { characterBuild, characterData, highlightArray, searchString } = state;
  const [selectable, setSelectable] = useState(false);
  const [previewSkillPoints, setPreviewSkillPoints] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [thisSkillsCurrentPoints, setThisSkillsCurrentPoints] = useState(
    characterBuild?.buildData?.[yIndex]?.[xIndex] as number,
  );

  useEffect(() => {
    let tempCurPoints = thisSkillsCurrentPoints;
    if (characterBuild?.buildData?.[yIndex]?.[xIndex] !== undefined) {
      setThisSkillsCurrentPoints(characterBuild?.buildData?.[yIndex]?.[xIndex] as number);
      tempCurPoints = characterBuild?.buildData?.[yIndex]?.[xIndex] as number;
    } else {
      setThisSkillsCurrentPoints(0);
      tempCurPoints = 0;
    }

    if (skill.levels?.[0].auto_unlock_at_rank !== undefined) {
      setSelectable(false);
    } else {
      const newSelectable = skillIncreaseIsValid(characterBuild, characterData, skill, tempCurPoints, skillKey, false);
      setSelectable(newSelectable);
    }
  }, [characterBuild?.buildData]);

  useEffect(() => {
    if (skill?.levels?.[thisSkillsCurrentPoints]) {
      setPreviewSkillPoints(thisSkillsCurrentPoints);
    } else {
      setPreviewSkillPoints(thisSkillsCurrentPoints - 1);
    }
  }, [thisSkillsCurrentPoints]);

  useEffect(() => {
    if (characterBuild?.blockedSkills.includes(skill.key)) {
      setBlocked(true);
    } else {
      setBlocked(false);
    }
  }, [characterBuild?.blockedSkills]);

  useEffect(() => {
    skill.levels?.forEach((skillLevel, index) => {
      if (skill.points_on_creation - 1 >= index) {
        // Ignore points on creation skills
      } else {
        if (
          characterBuild?.rank !== undefined &&
          characterBuild?.startingSkillPoints !== undefined &&
          characterBuild?.autoUnlockSkillPoints !== undefined &&
          skillLevel.auto_unlock_at_rank !== undefined
        ) {
          if (
            characterBuild.buildData[yIndex][xIndex] === index &&
            skillLevel.auto_unlock_at_rank <=
              characterBuild?.rank - characterBuild?.startingSkillPoints - characterBuild?.autoUnlockSkillPoints
          ) {
            rankUpSkill(true);
          } else if (
            characterBuild.buildData[yIndex][xIndex] > index &&
            skillLevel.auto_unlock_at_rank >
              characterBuild?.rank - characterBuild?.startingSkillPoints - characterBuild?.autoUnlockSkillPoints
          ) {
            rankDownSkill(true);
          }
        }
      }
    });
  }, [characterBuild?.rank]);

  const rankUpSkill = (autoRankSkill: boolean) => {
    if (!autoRankSkill) {
      if (!skillIncreaseIsValid(characterBuild, characterData, skill, thisSkillsCurrentPoints, skillKey, true)) {
        return;
      }
    }

    const newCharacterBuild = JSON.parse(JSON.stringify(characterBuild));
    // If new skill add to characterBuild.selectedSkills and blockedSkills references if needed
    if (thisSkillsCurrentPoints === 0) {
      newCharacterBuild?.selectedSkills.push(skill.character_skill_key);
      newCharacterBuild?.selectedSkills.push(skill.key);
      if (skill?.levels?.[0].blocks_skill_node_keys) {
        skill?.levels?.[0].blocks_skill_node_keys.forEach((blockedNode) => {
          newCharacterBuild?.blockedSkills.push(blockedNode);
        });
      }
    }
    // Add skill point to build array
    // Add 1 to character rank
    newCharacterBuild.buildData[yIndex][xIndex]++;
    newCharacterBuild.rank++;
    if (autoRankSkill) {
      newCharacterBuild.autoUnlockSkillPoints++;
    }

    dispatch({
      type: AppContextActions.changeCharacterBuild,
      payload: { characterBuild: newCharacterBuild as BuildInterface },
    });
  };

  const rankDownSkill = (autoRankSkill: boolean) => {
    // Check if skill has lower rank than already selected
    if (thisSkillsCurrentPoints === 0) {
      toast.error('Cannot remove unselected skill.', { id: `${skillKey} unselect` });
      return;
    }

    // Check skill doesn't start with more ranks than attempting
    if (thisSkillsCurrentPoints === skill.points_on_creation) {
      toast.error('Cannot remove starting skill points.', { id: `${skillKey} starting` });
      return;
    }

    const testCharacterBuild = JSON.parse(JSON.stringify(characterBuild));
    testCharacterBuild.buildData[yIndex][xIndex]--;
    if (autoRankSkill) {
      testCharacterBuild.autoUnlockSkillPoints--;
    }

    // If skill was entirely removed delete from characterBuild.selectedSkills and blockedSkills references if needed
    if (testCharacterBuild.buildData[yIndex][xIndex] === 0) {
      const selectedSkillKeyIndex = testCharacterBuild.selectedSkills.indexOf(skill.key);
      testCharacterBuild.selectedSkills.splice(selectedSkillKeyIndex, 1);
      const selectedCharSkillKeyIndex = testCharacterBuild.selectedSkills.indexOf(skill.character_skill_key);
      testCharacterBuild.selectedSkills.splice(selectedCharSkillKeyIndex, 1);

      let blocksSkill = false;
      const blockedSkillKeys: Array<string> = [];
      skill.levels?.forEach((level) => {
        if (level.blocks_skill_node_keys) {
          blocksSkill = true;
          blockedSkillKeys.push(...level.blocks_skill_node_keys);
        }
      });
      if (blocksSkill) {
        blockedSkillKeys.map((blockedSkill) => {
          const blockedSkillIndex = testCharacterBuild.blockedSkills.indexOf(blockedSkill);
          testCharacterBuild.blockedSkills.splice(blockedSkillIndex, 1);
        });
      }
    }

    if (!autoRankSkill) {
      // Remove 2 from character rank to check rank requirements on other skills
      testCharacterBuild.rank -= 2;

      if (!isValidSkillTree(testCharacterBuild, state.characterData as CharacterInterface)) {
        toast.error('This skill has dependents.', { id: `${skillKey} dependencies` });
        return;
      }

      // Add back the extra rank we took off to verify the skill tree
      testCharacterBuild.rank++;
    } else {
      testCharacterBuild.rank--;
    }

    dispatch({
      type: AppContextActions.changeCharacterBuild,
      payload: { characterBuild: testCharacterBuild as BuildInterface },
    });
  };

  const skillClickHandler = (event: MouseEvent) => {
    // 0 = LMB, 2 = RMB
    // Don't allow changing auto rank skills
    if (skill.levels?.[thisSkillsCurrentPoints]?.auto_unlock_at_rank !== undefined) {
      toast.error(
        `This skill is automatically leveled up/down at rank ${skill.levels?.[thisSkillsCurrentPoints]?.auto_unlock_at_rank}`,
        {
          id: `${skillKey} autorank`,
        },
      );
    } else if (skill.levels?.[thisSkillsCurrentPoints - 1]?.auto_unlock_at_rank !== undefined && event.button === 2) {
      toast.error(
        `This skill is automatically leveled up/down at rank ${skill.levels?.[thisSkillsCurrentPoints]?.auto_unlock_at_rank}`,
        {
          id: `${skillKey} autorank`,
        },
      );
      // Normal skill rank up
    } else if (event.button === 0) {
      rankUpSkill(false);
      // Normal skill rank down
    } else if (event.button === 2) {
      rankDownSkill(false);
    }
  };

  let tdClassName = 'flex flex-row w-max h-auto my-1 border relative';

  if (!skill.right_arrow) {
    tdClassName += ' pr-2';
  }

  switch (boxedType) {
    case 'start': {
      tdClassName += ' border-gray-400 border-r-0 rounded-l';
      break;
    }
    case 'center': {
      tdClassName += ' border-gray-400 border-l-0 border-r-0';
      break;
    }
    case 'end': {
      tdClassName += ' border-gray-400 border-l-0 rounded-r pr-2';
      break;
    }
    case 'none': {
      tdClassName += ' border-transparent rounded';
      break;
    }
    default: {
      break;
    }
  }

  if (highlightArray?.skillTree?.[skill?.indent as number]?.[skill?.tier as number]) {
    tdClassName += ' searchOutline';
  }

  const findAbilityImage = (includePassives: boolean) => {
    if (skill.levels?.[0].effects === undefined) {
      return '';
    }
    for (let i = 0; i < skill.levels?.[0].effects?.length; i++) {
      const effect = skill.levels?.[0].effects[i];
      if (effect.related_abilities?.[0].unit_ability.icon_name) {
        // Passives seem to generally not overwrite skill icons, but use as possible fallback
        if (!includePassives && !effect.description.toLowerCase().includes('passive ability:')) {
          return effect.related_abilities?.[0].unit_ability.icon_name;
        } else if (includePassives) {
          return effect.related_abilities?.[0].unit_ability.icon_name;
        }
      }
    }
  };

  const srcList = [
    // `/imgs/${abilityImagePath}.webp`, // Effective placement from below, avoids 404s
    `/imgs/${skill.image_path}.webp`,
    // `/imgs/${abilityImagePathPassive}.webp`, // Effective placement from below, avoids 404s
    // `/imgs/vanilla3/campaign_ui/skills/0_placeholder_skill.webp`, // Effective placement from below, avoids 404s
  ];

  const abilityImagePath = findAbilityImage(false);
  const abilityImagePathPassive = findAbilityImage(true);

  if (abilityImagePath !== undefined) {
    srcList.unshift(`/imgs/${abilityImagePath}.webp`);
  }
  if (abilityImagePathPassive !== undefined) {
    srcList.push(`/imgs/${abilityImagePathPassive}.webp`);
  }
  srcList.push(`/imgs/vanilla3/campaign_ui/skills/0_placeholder_skill.webp`);

  return (
    <td
      className={tdClassName}
      onMouseDown={(event: MouseEvent) => {
        skillClickHandler(event);
      }}
      onContextMenu={(event) => {
        event.preventDefault();
      }}
    >
      {skill.levels?.[0]?.auto_unlock_at_rank !== undefined && skill.levels?.[0]?.auto_unlock_at_rank !== 0 && (
        <TooltipWrapper
          tooltip={
            <div className="w-max p-2 rounded border border-gray-400 shadow-lg text-gray-50 bg-gray-600">
              <p className="text-yellow-300 text-xl">
                This skill automatically unlocks at rank {skill.levels?.[0]?.auto_unlock_at_rank}
              </p>
            </div>
          }
        >
          <img
            className="w-6 h-6 absolute bottom-1 left-1 z-10 hover-scale-large"
            src={autoSkillIcon}
            draggable={false}
            alt="autoUnlockIcon"
            width="32"
            height="32"
          />
        </TooltipWrapper>
      )}
      <BaseCell
        skill={skill}
        thisSkillsCurrentPoints={thisSkillsCurrentPoints}
        selectable={selectable}
        previewSkillPoints={previewSkillPoints}
        blocked={blocked}
        srcList={srcList}
        showRanks={true}
      />
    </td>
  );
};

export default SkillCell;
