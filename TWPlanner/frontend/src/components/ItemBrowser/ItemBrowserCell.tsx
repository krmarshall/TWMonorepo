import { useContext, useRef } from 'react';
import { ExtendedItemInterface } from '../../@types/ItemInterfaceRef.ts';
import ItemSetTooltip from '../Planner/Tooltips/ItemSetTooltip.tsx';
import SkillEffect from '../Planner/Tooltips/SubToolTips/SkillEffect.tsx';
import ReactImage from '../ReactImage.tsx';
import TooltipWrapper from '../TooltipWrapper.tsx';
import { AppContext } from '../../contexts/AppContext.tsx';

import itemSetIcon from '../../imgs/other/icon_item_set.webp';
import FactionAvailability from './FactionAvailability.tsx';

interface PropsInterface {
  item?: ExtendedItemInterface;
}

const ItemBrowserCell = ({ item }: PropsInterface) => {
  const { state } = useContext(AppContext);
  const { selectedModItem } = state;

  const itemSetParentRef = useRef<HTMLDivElement>(null);

  const srcList = [
    `/imgs/vanilla3/${item?.ui_icon}.webp`,
    `/imgs/vanilla3/${item?.ui_icon.toLowerCase()}.webp`,
    `/imgs/${selectedModItem}/${item?.ui_icon}.webp`,
    `/imgs/${selectedModItem}/${item?.ui_icon.toLowerCase()}.webp`,
    `/imgs/vanilla3/campaign_ui/skills/0_placeholder_skill.webp`,
  ];
  let bgColor = '';
  if (item?.rarity === 'Unique') {
    bgColor = 'bg-[#831C9F]';
  } else if (item?.rarity === 'Rare') {
    bgColor = 'bg-[#202BC1]';
  } else if (item?.rarity === 'Uncommon') {
    bgColor = 'bg-[#370D2D]';
  } else if (item?.rarity === 'Common') {
    bgColor = 'bg-[#C8C8C8]';
  } else if (item?.rarity === 'Crafted') {
    bgColor = 'bg-[#808000]';
  } else if (item?.rarity === 'Rune') {
    bgColor = 'bg-[#00FAFA]';
  }

  const setImgClassName = 'absolute w-8 h-8 top-2 right-2 z-10 hover-scale-large';
  // if (highlightArray?.items?.[index].set) {
  //   setImgClassName += ' rounded-full outline outline-offset-2 outline-yellow-400';
  // }
  return (
    <li
      key={item?.key}
      className="w-92 mx-auto h-fit p-2 rounded border border-gray-400 shadow-lg bg-gray-600 text-gray-50 text-center relative"
    >
      <TooltipWrapper
        tooltip={
          <div className="rounded border border-gray-400 shadow-lg bg-gray-600 text-gray-50 p-2">
            <p className="text-left text-lg">Rarity: {item?.rarity}</p>
            <p className="text-left text-lg">Category: {item?.category}</p>
          </div>
        }
      >
        <div className="flex flex-row -my-2 relative">
          <ReactImage
            srcList={srcList}
            className="w-14 h-14 my-auto -ml-3 -mr-1 drop-shadow-lg z-20"
            alt="itemIcon"
            w="64"
            h="64"
          />

          <div className={bgColor + ' w-10 h-10 absolute rounded-full z-10 mt-2 -ml-1'}></div>
          <h3 className="text-2xl text-left my-auto mr-auto">{item?.onscreen_name}</h3>
        </div>
      </TooltipWrapper>

      {item?.item_set !== undefined && (
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

      <h4 className="mx-auto my-0.5 text-lg opacity-70">{item?.colour_text}</h4>

      {item?.agent_subtypes !== undefined && <p className="text-xl">{item?.agent_subtypes.join(', ')}</p>}
      {item?.unlocked_at_rank !== undefined && (
        <p className="text-yellow-300 text-lg">Unlocked at Rank: {item?.unlocked_at_rank}</p>
      )}

      <ul>
        {item?.effects?.map((effect, index) => {
          return <SkillEffect key={index} skillEffect={effect} />;
        })}
      </ul>

      {(item?.subcategory !== undefined ||
        item?.agent_types !== undefined ||
        item?.randomly_dropped ||
        item?.unavailable !== undefined ||
        // If all is true then the rest of available is empty, so only display when all is undefined
        (item?.available !== undefined && item?.available?.all === undefined)) && <FactionAvailability item={item} />}
    </li>
  );
};

export default ItemBrowserCell;
