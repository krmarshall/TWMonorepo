import { ExtendedItemInterface } from '../../@types/ItemInterfaceRef.ts';
import SkillEffect from '../Planner/Tooltips/SubToolTips/SkillEffect.tsx';
import ReactImage from '../ReactImage.tsx';
import TooltipWrapper from '../TooltipWrapper.tsx';

interface PropsInterface {
  item?: ExtendedItemInterface;
}

const ItemCell = ({ item }: PropsInterface) => {
  const srcList = [
    `/imgs/vanilla3/${item?.ui_icon}.webp`,
    `/imgs/vanilla3/${item?.ui_icon.toLowerCase()}.webp`,
    // `/imgs/${selectedMod}/${item?.ui_icon}.webp`,
    // `/imgs/${selectedMod}/${item?.ui_icon.toLowerCase()}.webp`,
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
  return (
    <li
      key={item?.key}
      className="w-92 h-fit p-2 rounded border border-gray-400 shadow-lg bg-gray-600 text-gray-50 text-center"
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

      <h4 className="mx-auto text-lg opacity-70">{item?.colour_text}</h4>
      {item?.unlocked_at_rank !== undefined && (
        <p className="text-yellow-300 text-lg">Unlocked at Rank: {item?.unlocked_at_rank}</p>
      )}
      <ul>
        {item?.effects?.map((effect, index) => {
          return <SkillEffect key={index} skillEffect={effect} />;
        })}
      </ul>

      {item?.subcategory !== undefined && <p className="text-left text-lg">Subcategory: {item?.subcategory}</p>}
    </li>
  );
};

export default ItemCell;
