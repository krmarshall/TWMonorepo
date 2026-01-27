import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext.tsx';
import gameData from '../../data/gameData.ts';
import placeholderImg from '../../imgs/other/0placeholderInvis.webp';
import ReactImage from '../ReactImage.tsx';

// import portholeFrame from '../imgs/other/porthole_frame_battle_load.webp';

const CharacterPortrait = () => {
  const { state } = useContext(AppContext);
  const { selectedMod, selectedFaction, characterData } = state;

  const srcList = [
    `/portraits/${gameData[selectedMod].characters[selectedFaction].lords?.[characterData?.key as string]?.portrait}`,
    `/portraits/${gameData[selectedMod].characters[selectedFaction].lords?.[characterData?.key as string]?.portrait.replace(selectedMod, 'vanilla3')}`,
    `/portraits/${gameData[selectedMod].characters[selectedFaction].heroes?.[characterData?.key as string]?.portrait}`,
    `/portraits/${gameData[selectedMod].characters[selectedFaction].heroes?.[characterData?.key as string]?.portrait.replace(selectedMod, 'vanilla3')}`,
    placeholderImg,
  ];

  return (
    <div className="absolute place-self-center top-2 bg-gray-700 rounded-full border border-gray-500 drop-shadow-[0.1rem_0.1rem_0.5rem_rgba(0,0,0,0.7)]">
      <ReactImage
        srcList={srcList}
        className="w-36 h-36 rounded-full drop-shadow-[0.1rem_0.1rem_0.5rem_rgba(0,0,0,0.7)]"
        w="164"
        h="164"
        alt=""
      />
    </div>
  );
};

export default CharacterPortrait;
