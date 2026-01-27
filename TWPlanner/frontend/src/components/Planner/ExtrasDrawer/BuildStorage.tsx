import { useContext, useEffect, useState, MouseEvent } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../contexts/AppContext.tsx';
import {
  deleteBuildFromStorage,
  initializeBuildsFromStorage,
  saveBuildToStorage,
  setActiveBuildFromStorage,
} from '../../../utils/storageFunctions.ts';
import { splitCharacterKey } from '../../../utils/urlFunctions.ts';

import deleteIcon from '../../../imgs/other/icon_delete.webp';
import saveIcon from '../../../imgs/other/icon_quick_save.webp';

const BuildStorage = () => {
  const [buildNameInput, setBuildNameInput] = useState('');
  const { state, dispatch } = useContext(AppContext);
  const { characterBuild, selectedAltFactionNodeSet } = state;
  const { mod, faction, character } = useParams();
  const { cleanCharacter } = splitCharacterKey(character as string);

  useEffect(() => {
    if (!characterBuild?.character) {
      return;
    }
    initializeBuildsFromStorage(state, dispatch);
  }, [state.characterBuild?.character, selectedAltFactionNodeSet]);

  const saveClickHandler = () => {
    saveBuildToStorage(state, dispatch, buildNameInput);
    setBuildNameInput('');
  };

  const deleteClickHandler = (buildName: string, event: MouseEvent) => {
    // Might not be necessary? Stop event from bubbling up to the setBuildHandler as well
    event.stopPropagation();
    deleteBuildFromStorage(state, dispatch, buildName);
  };

  const setBuildHandler = (buildName: string) => {
    setActiveBuildFromStorage(state, dispatch, buildName, mod as string, faction as string, cleanCharacter);
  };

  return (
    <div className="h-auto min-w-58 mx-1 flex flex-col place-content-between shadow-lg bg-gray-700 border border-gray-500 rounded ">
      <div className="flex flex-col justify-center">
        <h2 className="text-center text-3xl mt-1 text-gray-200 text-shadow">Builds</h2>
      </div>
      <ul className="grow pr-2 pb-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600">
        {state.localStorageBuildKeys.map((buildKey, index) => {
          return (
            <li
              key={index}
              className="bg-gray-600 hover:bg-gray-500 w-fit min-w-[10vw] max-w-[22vw] rounded p-0.5 pl-2 mx-auto my-1 flex flex-row place-content-between cursor-pointer"
              onClick={() => {
                setBuildHandler(buildKey);
              }}
            >
              <p className="overflow-hidden whitespace-nowrap text-ellipsis text-2xl mx-auto text-gray-200">
                {buildKey}
              </p>
              <img
                src={deleteIcon}
                alt="deleteIcon"
                className="w-9 h-9 grayscale hover:grayscale-0"
                onClick={(event) => {
                  deleteClickHandler(buildKey, event);
                }}
                width="40"
                height="40"
              />
            </li>
          );
        })}
      </ul>
      <div className="flex flex-row my-2 place-content-center">
        <input
          type="text"
          placeholder="Build Name"
          value={buildNameInput}
          onChange={(event) => {
            setBuildNameInput(event.target.value);
          }}
          onKeyUp={(event) => {
            if (event.key === 'Enter') {
              saveClickHandler();
            }
          }}
          className="w-32 rounded m-1 px-1 text-xl text-center focus:outline-none placeholder-opacity-60 placeholder-black bg-gray-200"
        />
        <button
          className="flex flex-row place-content-center w-18 h-min my-auto py-0.5 pl-1 pr-2 bg-green-800 hover:bg-green-700 border rounded-xl hover-scale"
          onClick={saveClickHandler}
        >
          <img src={saveIcon} alt="saveIcon" width="26" height="26" className="m-auto" draggable={false} />
          <p className="text-center text-gray-200 text-xl my-auto ml-0.5">Save</p>
        </button>
      </div>
    </div>
  );
};

export default BuildStorage;
