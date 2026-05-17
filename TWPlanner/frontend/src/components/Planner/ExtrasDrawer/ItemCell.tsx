import { useContext, useRef } from 'react';
import { ItemInterface } from '../../../@types/ItemInterfaceRef.ts';
import BaseCell from '../BaseCell.tsx';
import { AppContext } from '../../../contexts/AppContext.tsx';
import TooltipWrapper from '../../TooltipWrapper.tsx';
import ItemSetTooltip from '../Tooltips/ItemSetTooltip.tsx';
import useBulkMediaQueries from '../../../hooks/useBulkMediaQueries.tsx';

import questBattle from '../../../imgs/other/icon_quest_battle.webp';
import itemSetIcon from '../../../imgs/other/icon_item_set.webp';

interface PropInterface {
  item: ItemInterface;
  index: number;
}

const ItemCell = ({ item, index }: PropInterface) => {
  const { state } = useContext(AppContext);
  const { selectedMod, highlightArray } = state;
  const { isMobile } = useBulkMediaQueries();

  const itemSetParentRef = useRef<HTMLDivElement>(null);

  let divClassName = 'm-auto relative';
  if (highlightArray?.items?.[index].item) {
    divClassName += ' rounded searchOutline m-auto';
  }

  let setImgClassName = 'absolute w-6 h-6 bottom-1 right-0 z-10 hover-scale-large';
  if (highlightArray?.items?.[index].set) {
    setImgClassName += ' rounded-full outline outline-offset-2 outline-yellow-400';
  }

  const tooltipLayoutContext = isMobile ? 'w-full max-h-full my-auto' : 'w-max';
  return (
    <div key={item.key} className={divClassName}>
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
          noSkillRanks={true}
          tooltip={
            <div
              className={
                tooltipLayoutContext + ' p-2 rounded border border-gray-400 shadow-lg text-gray-50 bg-gray-600'
              }
            >
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
        <div ref={itemSetParentRef}>
          <TooltipWrapper
            noSkillRanks={true}
            tooltip={
              <ItemSetTooltip itemSet={item.item_set} parentRef={itemSetParentRef as React.RefObject<HTMLDivElement>} />
            }
          >
            <img
              className={setImgClassName}
              src={itemSetIcon}
              draggable={false}
              alt="questBattleIcon"
              width="32"
              height="32"
            />
          </TooltipWrapper>
        </div>
      )}
    </div>
  );
};

export default ItemCell;
