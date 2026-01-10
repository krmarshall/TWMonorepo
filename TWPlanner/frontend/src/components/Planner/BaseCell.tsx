import { RefObject, useContext, useEffect, useRef, useState } from 'react';
import { replaceKeepCaps, setFontSize, trimString } from '../../utils/sharedFunctions.ts';
import ReactImage from '../ReactImage.tsx';
import TooltipWrapper from '../TooltipWrapper.tsx';
import SkillPointSelector from './SkillPointSelector.tsx';
import SkillTooltip from './Tooltips/SkillTooltip.tsx';
import { FactionEffectsInterface, ItemInterface, SkillInterface } from '../../@types/CharacterInterfaceRef.ts';
import blockedSkillOverlay from '../../imgs/other/skill_locked_rank.webp';
import { AppContext } from '../../contexts/AppContext.tsx';
import DOMPurify from 'dompurify';

interface PropInterface {
  skill?: SkillInterface;
  item?: ItemInterface;
  factionEffect?: FactionEffectsInterface;
  thisSkillsCurrentPoints?: number;
  selectable?: boolean;
  previewSkillPoints?: number;
  blocked?: boolean;
  srcList: Array<string>;
  showRanks?: boolean;
}

const BaseCell = ({
  skill,
  item,
  factionEffect,
  thisSkillsCurrentPoints = 0,
  selectable = true,
  previewSkillPoints = 0,
  blocked = false,
  srcList,
  showRanks = false,
}: PropInterface) => {
  const { state } = useContext(AppContext);
  const { characterBuild, searchString } = state;

  const [tooltipScrollable, setTooltipScrollable] = useState(false);
  const [ctrCounter, setCtrCounter] = useState(0);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);

  const cellTitle = skill?.localised_name ?? item?.onscreen_name ?? factionEffect?.localised_title ?? '';

  useEffect(() => {
    const passScrollEvent = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (tooltipRef.current !== null) {
        const tooltipScrollPosition = tooltipRef.current.scrollTop ?? 0;
        tooltipRef.current.scrollTo({
          top: tooltipScrollPosition + event.deltaY,
        });
      }
    };

    if (tooltipScrollable && cellRef.current !== null) {
      cellRef.current.addEventListener('wheel', passScrollEvent);
    }

    return () => {
      if (cellRef.current !== null) {
        cellRef.current.removeEventListener('wheel', passScrollEvent);
      }
    };
  }, [tooltipScrollable]);

  let divClassName = 'flex flex-row rounded-lg drop-shadow-lg hover-scale bg-no-repeat bg-cover';

  if (!showRanks) {
    divClassName += ' mx-auto';
  }

  if (thisSkillsCurrentPoints > 0) {
    divClassName +=
      ' filter-none bg-[url(/imgs/other/skills_tab_frame_selected.webp)] hover:bg-[url(/imgs/other/skills_tab_frame_selected_hover.webp)]';
  } else if (thisSkillsCurrentPoints === 0 && selectable) {
    divClassName +=
      ' filter-none bg-[url(/imgs/other/skills_tab_frame.webp)] hover:bg-[url(/imgs/other/skills_tab_frame_hover.webp)]';
  } else if (thisSkillsCurrentPoints === 0 && !selectable) {
    divClassName +=
      ' bg-[url(/imgs/other/skills_tab_frame.webp)] hover:bg-[url(/imgs/other/skills_tab_frame_hover.webp)] brightness-70 filter grayscale hover:filter-none hover:grayscale-0';
  }

  const fontSize = setFontSize(cellTitle);
  return (
    <div className={divClassName} ref={cellRef}>
      <TooltipWrapper
        tooltip={
          <SkillTooltip
            skill={skill}
            item={item}
            factionEffect={factionEffect}
            skillPoints={previewSkillPoints}
            blocked={blocked}
            ctrCounter={ctrCounter}
            setCtrCounter={setCtrCounter}
            setTooltipScrollable={setTooltipScrollable}
            tooltipRef={tooltipRef as RefObject<HTMLSpanElement>}
          />
        }
      >
        <div className="flex flex-row">
          {blocked && (
            <img
              src={blockedSkillOverlay}
              className="w-auto absolute top-0 right-8 z-0"
              draggable={false}
              alt="blockedSkillOverlay"
              width="135"
              height="72"
            />
          )}
          <ReactImage
            srcList={srcList}
            className={`w-18 h-18 my-auto drop-shadow-lg ${factionEffect !== undefined && 'p-2'}`}
            alt="skillIcon"
            w="64"
            h="64"
          />

          <div className="flex flex-col justify-center">
            <h2
              className={`w-34 text-center text-gray-200 text-shadow z-10 wrap-break-word ${fontSize}`}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(replaceKeepCaps(trimString(cellTitle), searchString)),
              }}
            ></h2>
          </div>
        </div>
      </TooltipWrapper>

      {showRanks ? (
        <div className="w-4 flex flex-col justify-center pl-0.5 text-sm text-gray-200">
          {skill?.levels?.map((rankKey, index) => {
            if (index < 3) {
              return (
                <SkillPointSelector
                  key={index}
                  index={index}
                  skill={skill}
                  skillPoints={index}
                  thisSkillsCurrentPoints={thisSkillsCurrentPoints}
                  selectable={selectable}
                  currentRank={
                    (characterBuild?.rank as number) -
                    (characterBuild?.startingSkillPoints as number) -
                    (characterBuild?.autoUnlockSkillPoints as number)
                  }
                  blocked={blocked}
                />
              );
            }
          })}
        </div>
      ) : (
        <div className="invisible w-4 pl-0.5">spacer</div>
      )}
    </div>
  );
};

export default BaseCell;
