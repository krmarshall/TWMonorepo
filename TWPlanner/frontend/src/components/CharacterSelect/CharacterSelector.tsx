import { Fragment, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import api from '../../api/api.ts';
import { AppContext, AppContextActions } from '../../contexts/AppContext.tsx';
import gameData from '../../data/gameData.ts';
import spellLoreIcons from '../../imgs/spellLoreIcons/spellLoreIcons.ts';
import { createEmptyCharacterBuild } from '../../utils/sharedFunctions.ts';
import CharacterCell from './CharacterCell.tsx';

const CharacterSelector = () => {
  const { state, dispatch } = useContext(AppContext);
  const { selectedMod, selectedFaction, selectedCompGroups } = state;
  const navigate = useNavigate();

  const gameCharacters = gameData[selectedMod]?.characters;

  // Grab all the lord and hero keys from the currently selected game characters
  const [lordKeys, setLordKeys] = useState<Array<string>>();
  const [heroKeys, setHeroKeys] = useState<Array<string>>();

  // Whenever the faction/characters change refresh the lord/hero keys
  useEffect(() => {
    if (checkFactionUndefined()) {
      const factionCharKeys = Object.keys(gameCharacters);
      const firstFactionKey = factionCharKeys[0];
      dispatch({ type: AppContextActions.changeFaction, payload: { selectedFaction: firstFactionKey } });
    } else {
      if (gameData[selectedMod].compilationGroups !== undefined && selectedCompGroups.length > 0) {
        const { filteredLords, filteredHeroes } = filterCharLists();
        setLordKeys(Object.keys(filteredLords));
        setHeroKeys(Object.keys(filteredHeroes));
      } else {
        setLordKeys(Object.keys(gameCharacters[selectedFaction].lords));
        setHeroKeys(Object.keys(gameCharacters[selectedFaction].heroes));
      }
    }
  }, [selectedMod, selectedFaction, selectedCompGroups]);

  const checkFactionUndefined = () => {
    return gameCharacters[selectedFaction] === undefined;
  };

  const handleCharacterSelect = (event: React.MouseEvent, characterKey: string) => {
    if (event.button === 0 && !event.ctrlKey && !event.shiftKey) {
      event.preventDefault();

      const apiPromise = api
        .getCharacterSkillTree(selectedMod, selectedFaction, characterKey, false)
        .then((response) => {
          dispatch({ type: AppContextActions.changeCharacterData, payload: { characterData: response } });
          const emptyCharacterBuild = createEmptyCharacterBuild(response, selectedMod, selectedFaction, characterKey);
          dispatch({ type: AppContextActions.changeCharacterBuild, payload: { characterBuild: emptyCharacterBuild } });
          navigate(`/planner/${selectedMod}/${selectedFaction}/${characterKey}`);
        });
      toast.promise(
        apiPromise,
        {
          loading: 'Loading',
          success: 'Success',
          error: (err) => `${err}`,
        },
        { loading: { duration: 5000 } },
      );
    }
  };

  const filterCharLists = () => {
    const filteredLords: {
      [key: string]: {
        name: string;
        spellLore?: string | undefined;
      };
    } = {};
    const filteredHeroes: {
      [key: string]: {
        name: string;
        spellLore?: string | undefined;
      };
    } = {};

    Object.keys(gameCharacters[selectedFaction].lords).forEach((lordKey) => {
      const lordMod = gameData[selectedMod].compilationGroups?.nodeSets[lordKey];
      if (lordMod !== undefined && selectedCompGroups.includes(lordMod)) {
        filteredLords[lordKey] = gameCharacters[selectedFaction].lords[lordKey];
      }
    });
    Object.keys(gameCharacters[selectedFaction].heroes).forEach((heroKey) => {
      const heroMod = gameData[selectedMod].compilationGroups?.nodeSets[heroKey];
      if (heroMod !== undefined && selectedCompGroups.includes(heroMod)) {
        filteredHeroes[heroKey] = gameCharacters[selectedFaction].heroes[heroKey];
      }
    });

    return { filteredLords, filteredHeroes };
  };

  return (
    <Fragment>
      {lordKeys !== undefined && lordKeys.length > 0 && (
        <div className="justify-self-center">
          <div className="flex flex-row place-content-center w-[80vw] mx-auto mt-2">
            <hr className="grow mt-5 opacity-50" />
            <h1 className="w-max text-center text-4xl mx-2 text-gray-200 text-shadow">Lords</h1>
            <hr className="grow mt-5 opacity-50" />
          </div>
          <ul className="flex flex-row flex-wrap justify-center">
            {lordKeys?.map((lordKey) => {
              if (checkFactionUndefined()) {
                return;
              }
              const lord = gameCharacters[selectedFaction].lords[lordKey];
              const lordImage = `/portraits/${lord?.portrait}`;
              const lordMod = gameData[selectedMod].compilationGroups?.nodeSets[lordKey];

              let spellLore = undefined;
              if (lord?.spellLore !== undefined) {
                spellLore = spellLoreIcons[lord.spellLore as keyof typeof spellLoreIcons];
              }
              return (
                <AnimatePresence key={lordKey}>
                  <CharacterCell
                    key={lordKey}
                    charKey={lordKey}
                    char={lord}
                    charImage={lordImage}
                    spellLore={spellLore}
                    charMod={lordMod}
                    handleCharacterSelect={handleCharacterSelect}
                  />
                </AnimatePresence>
              );
            })}
          </ul>
        </div>
      )}
      {heroKeys !== undefined && heroKeys.length > 0 && (
        <div className="justify-self-center">
          <div className="flex flex-row place-content-center w-[80vw] mx-auto mt-2">
            <hr className="grow mt-5 opacity-50" />
            <h1 className="w-max text-center text-4xl mx-2 text-gray-200 text-shadow">Heroes</h1>
            <hr className="grow mt-5 opacity-50" />
          </div>
          <ul className="flex flex-row flex-wrap justify-center mb-4">
            {heroKeys?.map((heroKey) => {
              if (checkFactionUndefined()) {
                return;
              }
              const hero = gameCharacters[selectedFaction].heroes[heroKey];
              const heroImage = `/portraits/${hero?.portrait}`;
              const heroMod = gameData[selectedMod].compilationGroups?.nodeSets[heroKey];

              let spellLore = undefined;
              if (hero?.spellLore !== undefined) {
                spellLore = spellLoreIcons[hero.spellLore as keyof typeof spellLoreIcons];
              }
              return (
                <AnimatePresence key={heroKey}>
                  <CharacterCell
                    key={heroKey}
                    charKey={heroKey}
                    char={hero}
                    charImage={heroImage}
                    spellLore={spellLore}
                    charMod={heroMod}
                    handleCharacterSelect={handleCharacterSelect}
                  />
                </AnimatePresence>
              );
            })}
          </ul>
        </div>
      )}
    </Fragment>
  );
};

export default CharacterSelector;
