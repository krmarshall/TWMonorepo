import { useContext, useEffect, useRef, useState } from 'react';
import { ItemInterface } from '../../../@types/CharacterInterfaceRef';
import BaseCell from '../BaseCell';
import { AppContext } from '../../../contexts/AppContext';
import TooltipWrapper from '../../TooltipWrapper';
import ItemSetTooltip from '../Tooltips/ItemSetTooltip';

import questBattle from '../../../imgs/other/icon_quest_battle.webp';

interface PropInterface {
  item: ItemInterface;
  index: number;
}

const ItemCell = ({ item, index }: PropInterface) => {
  const { state } = useContext(AppContext);
  const { selectedMod, highlightArray } = state;

  const [tooltipScrollable, setTooltipScrollable] = useState(false);
  const [ctrCounter, setCtrCounter] = useState(0);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);

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

  let divClassName = 'm-auto relative';
  if (highlightArray?.items?.[index].item) {
    divClassName += ' rounded searchOutline m-auto';
  }
  return (
    <div key={item.key} className={divClassName} ref={cellRef}>
      <BaseCell
        item={item}
        srcList={[
          `/imgs/vanilla3/${item.ui_icon}.webp`,
          `/imgs/vanilla3/${item.ui_icon.toLowerCase()}.webp`,
          `/imgs/${selectedMod}/${item.ui_icon}.webp`,
          `/imgs/${selectedMod}/${item.ui_icon.toLowerCase()}.webp`,
          `/imgs/vanilla3/campaign_ui/skills/0_placeholder_skill.webp`,
        ]}
      />
      {item.unlocked_at_rank !== undefined && (
        <TooltipWrapper
          tooltip={
            <div className="w-max p-2 rounded border border-gray-400 shadow-lg text-gray-50 bg-gray-600">
              <p className="text-yellow-300 text-xl">Available via Quest/Rank unlock at Rank {item.unlocked_at_rank}</p>
            </div>
          }
        >
          <img
            className="absolute w-6 h-6 bottom-1 left-1 z-10 bg-black rounded-full hover-scale-large"
            src={questBattle}
            draggable={false}
            alt="questBattleIcon"
            width="32"
            height="32"
          ></img>
        </TooltipWrapper>
      )}
      {item.item_set !== undefined && (
        <ItemSetTooltip
          itemSet={item.item_set}
          index={index}
          ctrCounter={ctrCounter}
          setCtrCounter={setCtrCounter}
          setTooltipScrollable={setTooltipScrollable}
          tooltipRef={tooltipRef}
        />
      )}
    </div>
  );
};

export default ItemCell;
