import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext.tsx';
import techGameData from '../../data/techGameData.ts';

const FactionPortrait = () => {
  const { state } = useContext(AppContext);
  const { selectedModTech, techData } = state;

  const imgSrc = techGameData[selectedModTech].techTrees[techData?.key as string]?.image;
  return (
    <div className="absolute place-self-center top-2 p-4">
      <img
        src={imgSrc}
        className="w-32 h-32 drop-shadow-[0.1rem_0.1rem_0.5rem_rgba(0,0,0,0.7)]"
        draggable={false}
        width="256"
        height="256"
        alt="Faction Portrait"
      />
    </div>
  );
};

export default FactionPortrait;
