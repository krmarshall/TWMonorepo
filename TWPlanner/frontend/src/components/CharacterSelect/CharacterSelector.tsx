import { Fragment, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import api from '../../api/api';
import { AppContext, AppContextActions } from '../../contexts/AppContext';
import gameData from '../../data/gameData';
import spellLoreIcons from '../../imgs/spellLoreIcons/spellLoreIcons';
import { CompGroupsInterface } from '../../types/interfaces/GameInterface';
import { createEmptyCharacterBuild } from '../../utils/sharedFunctions';
import CharacterCell from './CharacterCell';

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

  const invertCompGroups = (compGroups: CompGroupsInterface | undefined) => {
    if (compGroups !== undefined) {
      const invertedMap: { [key: string]: string } = {};
      Object.keys(compGroups).forEach((groupKey) => {
        Object.keys(compGroups[groupKey]).forEach((charKey) => {
          if (invertedMap[charKey] === undefined) {
            invertedMap[charKey] = groupKey;
          }
        });
      });
      return invertedMap;
    } else {
      return undefined;
    }
  };

  const compGroupsCharMap = invertCompGroups(gameData[selectedMod].compilationGroups);

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
      const lordMod = compGroupsCharMap?.[lordKey];
      if (lordMod !== undefined && selectedCompGroups.includes(lordMod)) {
        filteredLords[lordKey] = gameCharacters[selectedFaction].lords[lordKey];
      }
    });
    Object.keys(gameCharacters[selectedFaction].heroes).forEach((heroKey) => {
      const heroMod = compGroupsCharMap?.[heroKey];
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
            <hr className="grow mt-[1.25rem] opacity-50" />
            <h1 className="w-max text-center text-4xl mx-2 text-gray-200 text-shadow">Lords</h1>
            <hr className="grow mt-[1.25rem] opacity-50" />
          </div>
          <ul className="flex flex-row flex-wrap justify-center">
            <TransitionGroup component={null}>
              {lordKeys?.map((lordKey) => {
                if (checkFactionUndefined()) {
                  return;
                }
                const lord = gameCharacters[selectedFaction].lords[lordKey];
                const lordImage = gameData[selectedMod]?.characterImages[lordKey];
                const lordMod = compGroupsCharMap?.[lordKey];

                let spellLore = undefined;
                if (lord?.spellLore !== undefined) {
                  spellLore = spellLoreIcons[lord.spellLore as keyof typeof spellLoreIcons];
                }
                return (
                  <CSSTransition
                    key={lordKey}
                    classNames={{
                      enterActive: 'animate__animated animate__faster animate__zoomIn',
                      exitActive: 'hidden',
                    }}
                    timeout={500}
                  >
                    <CharacterCell
                      key={lordKey}
                      charKey={lordKey}
                      char={lord}
                      charImage={lordImage}
                      spellLore={spellLore}
                      charMod={lordMod}
                      handleCharacterSelect={handleCharacterSelect}
                    />
                  </CSSTransition>
                );
              })}
            </TransitionGroup>
          </ul>
        </div>
      )}
      {heroKeys !== undefined && heroKeys.length > 0 && (
        <div className="justify-self-center">
          <div className="flex flex-row place-content-center w-[80vw] mx-auto mt-2">
            <hr className="grow mt-[1.25rem] opacity-50" />
            <h1 className="w-max text-center text-4xl mx-2 text-gray-200 text-shadow">Heroes</h1>
            <hr className="grow mt-[1.25rem] opacity-50" />
          </div>
          <ul className="flex flex-row flex-wrap justify-center mb-4">
            <TransitionGroup component={null}>
              {heroKeys?.map((heroKey) => {
                if (checkFactionUndefined()) {
                  return;
                }
                const hero = gameCharacters[selectedFaction].heroes[heroKey];
                const heroImage = gameData[selectedMod]?.characterImages[heroKey];
                const heroMod = compGroupsCharMap?.[heroKey];

                let spellLore = undefined;
                if (hero?.spellLore !== undefined) {
                  spellLore = spellLoreIcons[hero.spellLore as keyof typeof spellLoreIcons];
                }
                return (
                  <CSSTransition
                    key={heroKey}
                    classNames={{
                      enterActive: 'animate__animated animate__faster animate__zoomIn',
                      exitActive: 'hidden',
                    }}
                    timeout={500}
                  >
                    <CharacterCell
                      key={heroKey}
                      charKey={heroKey}
                      char={hero}
                      charImage={heroImage}
                      spellLore={spellLore}
                      charMod={heroMod}
                      handleCharacterSelect={handleCharacterSelect}
                    />
                  </CSSTransition>
                );
              })}
            </TransitionGroup>
          </ul>
        </div>
      )}
    </Fragment>
  );
};

export default CharacterSelector;
