import { useContext } from 'react';
import { FactionEffectInterface } from '../../../types/interfaces/CharacterInterface';
import BaseCell from '../BaseCell';
import { AppContext } from '../../../contexts/AppContext';

interface PropInterface {
  factionEffect: FactionEffectInterface;
}

const FactionEffects = ({ factionEffect }: PropInterface) => {
  const { state } = useContext(AppContext);
  const { highlightArray } = state;
  const srcList = [
    `/imgs/${factionEffect.ui_icon.replace('.png', '')}.webp`,
    `/imgs/vanilla3/campaign_ui/skills/0_placeholder_skill.webp`,
  ];
  return (
    <div className="flex flex-col mx-1 mt-1.5 min-w-[14.5rem] max-w-[35rem] shadow-lg border border-gray-500 rounded">
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
