import { useState } from 'react';
import { SkillInterface } from '../../types/interfaces/CharacterInterface';
import SkillTooltip from './Tooltips/SkillTooltip';
import TooltipWrapper from '../TooltipWrapper';

interface SkillPointSelectorPropInterface {
  key: number;
  skill: SkillInterface | undefined;
  index: number;
  skillPoints: number;
  thisSkillsCurrentPoints: number;
  selectable: boolean;
  currentRank: number | undefined;
  blocked: boolean;
}

const SkillPointSelector = ({
  skill,
  index,
  skillPoints,
  thisSkillsCurrentPoints,
  selectable,
  currentRank,
  blocked,
}: SkillPointSelectorPropInterface) => {
  const [ctrCounter, setCtrCounter] = useState(0);

  let containerClassName = 'w-5 h-5 bg-contain ';
  const selected = thisSkillsCurrentPoints >= index + 1 ? true : false;
  let rankLocked = false;
  if (
    currentRank !== undefined &&
    skill?.levels?.[index].unlocked_at_rank !== undefined &&
    (skill?.levels?.[index].unlocked_at_rank as number) > currentRank + 1
  ) {
    rankLocked = true;
  }

  if (selected) {
    containerClassName +=
      'brightness-125 bg-[url(/imgs/other/checkbox_round_selected.webp)] hover:bg-[url(/imgs/other/checkbox_round_selected_hover.webp)]';
  } else if ((selectable && rankLocked) || (thisSkillsCurrentPoints > 0 && rankLocked)) {
    containerClassName += 'bg-[url(/imgs/other/icon_padlock.webp)] hover:brightness-125';
  } else {
    containerClassName +=
      'bg-[url(/imgs/other/checkbox_round_active.webp)] hover:brightness-125 hover:bg-[url(/imgs/other/checkbox_round_hover.webp)]';
  }

  return (
    <TooltipWrapper
      tooltip={
        <SkillTooltip
          skill={skill}
          skillPoints={skillPoints}
          blocked={blocked}
          ctrCounter={ctrCounter}
          setCtrCounter={setCtrCounter}
        />
      }
    >
      <div className={containerClassName}></div>
    </TooltipWrapper>
  );
};

export default SkillPointSelector;
