import { useContext, useEffect, useState } from 'react';
import { AppContext, AppContextActions } from '../../contexts/AppContext.tsx';
import gameData from '../../data/gameData.ts';
import factionImages from '../../imgs/factions/factionImages.ts';
import ReactImage from '../ReactImage.tsx';
import { AnimatePresence, motion } from 'motion/react';
import placeholderImg from '../../imgs/other/0placeholder.webp';
import shareIcon from '../../imgs/other/icon_button_external_link.webp';
import TooltipWrapper from '../TooltipWrapper.tsx';
import { toast } from 'react-hot-toast';

const FactionSelector = () => {
  const { state, dispatch } = useContext(AppContext);
  const { selectedMod, selectedFaction, selectedCompGroups } = state;
  const [currentModFactions, setCurrentModFactions] = useState(Object.keys(gameData[selectedMod].factions));

  useEffect(() => {
    if (gameData[selectedMod].compilationGroups !== undefined && selectedCompGroups.length > 0) {
      const filteredFactionKeys = Object.keys(filterCurrentModFactions());
      setCurrentModFactions(filteredFactionKeys);
      if (!filteredFactionKeys.includes(selectedFaction)) {
        dispatch({ type: AppContextActions.changeFaction, payload: { selectedFaction: filteredFactionKeys[0] } });
      }
    } else {
      setCurrentModFactions(Object.keys(gameData[selectedMod].factions));
    }
  }, [selectedMod, selectedCompGroups]);

  const filterCurrentModFactions = () => {
    const gameCompGroups = gameData[selectedMod].compilationGroups;
    if (gameCompGroups === undefined) {
      return gameData[selectedMod].factions;
    } else {
      const validFactions: { [key: string]: string } = {};
      const currentModCharacters = gameData[selectedMod].characters;

      Object.keys(currentModCharacters).forEach((subcultureKey) => {
        Object.values(currentModCharacters[subcultureKey].lords).forEach((lord) => {
          if (lord.folder !== undefined && selectedCompGroups.includes(lord.folder)) {
            validFactions[subcultureKey] = subcultureKey;
          }
        });
      });
      // Remove invalid factions while preserving manual ordering
      const cloneFaction = JSON.parse(JSON.stringify(gameData[selectedMod].factions));
      Object.keys(cloneFaction).forEach((factionKey) => {
        if (validFactions[factionKey] === undefined) {
          delete cloneFaction[factionKey];
        }
      });
      return cloneFaction;
    }
  };

  const shareHandler = () => {
    let url = import.meta.env.DEV ? 'http://localhost:5173/' : 'https://totalwarhammerplanner.com/';
    url += `${selectedMod}/${selectedFaction}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success('Link copied to clipboard!', { id: 'success clipboard' });
      })
      .catch(() => {
        toast.error('Error copying link to the clipboard...', { id: 'error clipboard' });
      });
  };

  return (
    <div className="justify-self-center px-2 w-full">
      <div className="flex flex-row place-content-center mx-auto">
        <hr className="grow mt-5 opacity-50 border-gray-200" />
        <h1 className="w-max text-center text-4xl mx-2 text-gray-200 text-shadow">Factions</h1>
        <TooltipWrapper
          tooltip={
            <span className="text-center flex flex-row">
              <div className="h-fit p-2 rounded border border-gray-400 shadow-lg text-gray-50 text-xl bg-gray-600">
                <h3 className="text-gray-50">Copy link to currently selected mod/faction</h3>
              </div>
            </span>
          }
        >
          <img
            src={shareIcon}
            className="w-6 h-6 m-auto cursor-pointer"
            width="24"
            height="24"
            onClick={shareHandler}
          />
        </TooltipWrapper>
        <hr className="grow mt-5 opacity-50 border-gray-200" />
      </div>
      <ul className="flex flex-row flex-wrap justify-center py-1">
        {currentModFactions?.map((factionKey) => {
          if (
            gameData[selectedMod].characters[factionKey]?.lords === undefined &&
            gameData[selectedMod].characters[factionKey]?.lords === undefined
          ) {
            return null;
          }

          if (
            gameData[selectedMod].characters[factionKey]?.lords !== undefined &&
            Object.keys(gameData[selectedMod].characters[factionKey].lords).length === 0 &&
            gameData[selectedMod].characters[factionKey]?.heroes !== undefined &&
            Object.keys(gameData[selectedMod].characters[factionKey].heroes).length === 0
          ) {
            return null;
          }

          const factionName = gameData[selectedMod]?.factions[factionKey];
          let liClassName = 'flex-col m-1 p-1.5 border border-gray-500 shadow-lg shadow-gray-800/60 rounded-lg';

          if (factionKey === selectedFaction) {
            liClassName += ' bg-gray-600 hover:bg-gray-500/80';
          } else {
            liClassName += ' hover:bg-gray-600';
          }

          return (
            <AnimatePresence key={factionKey}>
              <motion.li
                key={factionKey}
                className={liClassName}
                onClick={() => {
                  dispatch({ type: AppContextActions.changeFaction, payload: { selectedFaction: factionKey } });
                }}
                layoutScroll
                layoutId={factionKey}
                initial={{ scale: 0.25 }}
                animate={{ scale: selectedFaction === factionKey ? 1.05 : 1 }}
                exit={{ scale: 0.25 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.05 } }}
              >
                <h2 className="text-center h-7 text-gray-200 text-2xl text-shadow mb-2">{factionName}</h2>
                <div className="flex flex-row justify-center">
                  <ReactImage
                    srcList={[factionImages[factionKey as keyof typeof factionImages], placeholderImg]}
                    alt={`${factionName} icon`}
                    className="w-20 h-auto drop-shadow-[0.1rem_0.1rem_0.35rem_rgba(0,0,0,0.7)]"
                    w="96"
                    h="96"
                  />
                </div>
              </motion.li>
            </AnimatePresence>
          );
        })}
      </ul>
    </div>
  );
};

export default FactionSelector;
