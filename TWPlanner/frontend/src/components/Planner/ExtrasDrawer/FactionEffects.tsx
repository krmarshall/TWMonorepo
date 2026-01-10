import { useContext } from 'react';
import { FactionEffectsInterface } from '../../../@types/CharacterInterfaceRef.ts';
import BaseCell from '../BaseCell.tsx';
import { AppContext } from '../../../contexts/AppContext.tsx';

interface PropInterface {
  factionEffect: FactionEffectsInterface;
}

const FactionEffects = ({ factionEffect }: PropInterface) => {
  const { state } = useContext(AppContext);
  const { highlightArray } = state;
  const srcList = [
    `/imgs/${factionEffect.ui_icon.replace('.png', '')}.webp`,
    `/imgs/vanilla3/campaign_ui/skills/0_placeholder_skill.webp`,
  ];
  return (
    <div className="flex flex-col mx-1 mt-1.5 min-w-58 max-w-140 shadow-lg border border-gray-500 rounded">
      <h2 className="text-center text-3xl mt-1 text-gray-200 text-shadow">Faction Effects</h2>
      <div
        className={highlightArray?.factionEffects ? 'w-full m-auto pb-1 rounded searchOutline' : 'w-full m-auto pb-1'}
      >
        <BaseCell factionEffect={factionEffect} srcList={srcList} />
      </div>
    </div>
  );
};

export default FactionEffects;
