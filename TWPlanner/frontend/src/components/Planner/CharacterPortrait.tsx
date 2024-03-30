import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import gameData from '../../data/gameData';

// import portholeFrame from '../imgs/other/porthole_frame_battle_load.webp';

const CharacterPortrait = () => {
  const { state } = useContext(AppContext);
  const { selectedMod, characterData } = state;

  const imgSrc = gameData[selectedMod].characterImages[characterData?.key as string];
  return (
    <div className="absolute place-self-center top-2 bg-gray-700 rounded-full border border-gray-500 drop-shadow-[0.1rem_0.1rem_0.5rem_rgba(0,0,0,0.7)]">
      <img
        src={imgSrc}
        className="w-[9.5rem] h-[9.5rem] rounded-full drop-shadow-[0.1rem_0.1rem_0.5rem_rgba(0,0,0,0.7)]"
        draggable={false}
        width="164"
        height="164"
        alt="Character Portrait"
      />
    </div>
  );
};

export default CharacterPortrait;
