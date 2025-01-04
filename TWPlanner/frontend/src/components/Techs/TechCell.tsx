import { useContext, useEffect, useRef, useState } from 'react';
import { useXarrow } from 'react-xarrows';
import { AppContext } from '../../contexts/AppContext.tsx';
import { TechNodeInterface } from '../../@types/TechInterface.ts';
import { setFontSize, trimString } from '../../utils/sharedFunctions.ts';
import TooltipWrapper from '../TooltipWrapper.tsx';
import ReactImage from '../ReactImage.tsx';
import TechTooltip from './TechTooltip.tsx';

import buildingRequired from '../../imgs/other/building_required.webp';
import timerFrame from '../../imgs/other/timer_frame.webp';

interface PropInterface {
  tech: TechNodeInterface;
  yIndex: number;
  xIndex: number;
  borderClass: string;
}

const TechCell = ({ tech, yIndex, xIndex, borderClass }: PropInterface) => {
  const { state } = useContext(AppContext);
  const { selectedModTech, highlightArrayTech } = state;
  const [ctrCounter, setCtrCounter] = useState(0);
  const [tooltipScrollable, setTooltipScrollable] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const cellRef = useRef<HTMLTableCellElement>(null);
  const updateXarrow = useXarrow();

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
  }, [tooltipScrollable, tooltipRef?.current]);

  const fontSize = setFontSize(tech.technology.onscreen_name);

  let tdClassName = 'flex flex-row w-max h-auto py-2 pr-6' + borderClass;
  if (highlightArrayTech?.[tech.indent]?.[tech.tier]) {
    tdClassName += ' searchOutline';
  }

  const imgPadding = selectedModTech.includes('2') ? ' p-0 scale-110' : ' p-1.5';

  const imgPath = tech.technology.icon_name + '.webp';
  return (
    <td
      ref={cellRef}
      className={tdClassName}
      style={{ backgroundColor: `#${tech.ui_group_colour}50` }}
      onContextMenu={(event) => {
        event.preventDefault();
      }}
      onScroll={updateXarrow}
    >
      <div
        id={tech.key}
        className="flex flex-row relative z-10 rounded-lg drop-shadow-lg hover-scale bg-no-repeat bg-cover filter-none bg-[url(/imgs/other/skills_tab_frame.webp)] hover:bg-[url(/imgs/other/skills_tab_frame_hover.webp)]"
      >
        <TooltipWrapper
          tooltip={
            <TechTooltip
              tech={tech}
              ctrCounter={ctrCounter}
              setCtrCounter={setCtrCounter}
              setTooltipScrollable={setTooltipScrollable}
              tooltipRef={tooltipRef}
            />
          }
        >
          <div className="flex flex-row">
            {tech.research_points_required > 0 && (
              <div className="">
                <img
                  src={timerFrame}
                  className="w-12 absolute top-[-0.3rem] right-[-1rem] z-20"
                  draggable={false}
                  alt="timer frame"
                  width="46"
                  height="27"
                />
                <p className="text-gray-50 text-lg absolute top-[-0.25rem] right-[-0.2rem] z-30">
                  {Math.ceil(tech.research_points_required / 100)}
                </p>
              </div>
            )}
            {tech.technology?.required_buildings !== undefined && tech.technology?.required_buildings?.length > 0 && (
              <img
                src={buildingRequired}
                className="w-8 h-8 absolute top-[1.3rem] right-[-0.45rem] z-20 contrast-125"
                draggable={false}
                alt="building required icon"
                width="38"
                height="38"
              />
            )}
            <ReactImage
              srcList={[`/imgs/${imgPath}`, `/imgs/vanilla3/campaign_ui/skills/0_placeholder_skill.webp`]}
              className={'w-[4.5rem] h-[4.5rem] my-auto drop-shadow-lg' + imgPadding}
              alt="techIcon"
              w="64"
              h="64"
            />
            <div className="flex flex-col justify-center mr-4">
              <h2 className={`w-[8.5rem] text-center text-gray-200 text-shadow z-10 break-words ${fontSize}`}>
                {trimString(tech.technology.onscreen_name)}
              </h2>
            </div>
          </div>
        </TooltipWrapper>
      </div>
    </td>
  );
};

export default TechCell;
