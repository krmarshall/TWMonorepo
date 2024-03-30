import { toast } from 'react-hot-toast';
import { ActionInterface, AppContextActions, ContextStateInterface } from '../contexts/AppContext';
import StorageInterface from '../types/interfaces/StorageInterface';
import { createCharacterBuildFromArray, createEmptyCharacterBuild } from './sharedFunctions';
import { isValidSkillTree } from './skillVerification';

const initializeBuildsFromStorage = (state: ContextStateInterface, dispatch: (action: ActionInterface) => void) => {
  const storageBuilds: StorageInterface = loadBuildsFromStorage(state);
  const newBuildKeys = Object.keys(storageBuilds);
  dispatch({ type: AppContextActions.changeLocalStorageBuildKeys, payload: { localStorageBuildKeys: newBuildKeys } });
};

const saveBuildToStorage = (
  state: ContextStateInterface,
  dispatch: (action: ActionInterface) => void,
  buildName: string,
) => {
  const storageBuilds: StorageInterface = loadBuildsFromStorage(state);
  const newBuildKeys = [...state.localStorageBuildKeys];
  const saveBuildIndex = newBuildKeys.indexOf(buildName);
  if (saveBuildIndex === -1) {
    newBuildKeys.push(buildName);
  }
  if (!state.characterBuild) {
    return;
  }
  storageBuilds[buildName] = state.characterBuild.buildData;

  localStorage.setItem(
    `${state.characterBuild?.game}/${state.characterBuild?.faction}/${state.characterBuild?.character}${
      state.selectedAltFactionNodeSet !== '' ? `$${state.selectedAltFactionNodeSet}` : ''
    }`,
    JSON.stringify(storageBuilds),
  );
  dispatch({ type: AppContextActions.changeLocalStorageBuildKeys, payload: { localStorageBuildKeys: newBuildKeys } });
};

const deleteBuildFromStorage = (
  state: ContextStateInterface,
  dispatch: (action: ActionInterface) => void,
  buildName: string,
) => {
  const storageBuilds: StorageInterface = loadBuildsFromStorage(state);
  const newBuildKeys = [...state.localStorageBuildKeys];
  const deleteBuildIndex = newBuildKeys.indexOf(buildName);
  if (deleteBuildIndex === -1) {
    return;
  }
  newBuildKeys.splice(deleteBuildIndex, 1);
  delete storageBuilds[buildName];

  localStorage.setItem(
    `${state.characterBuild?.game}/${state.characterBuild?.faction}/${state.characterBuild?.character}${
      state.selectedAltFactionNodeSet !== '' ? `$${state.selectedAltFactionNodeSet}` : ''
    }`,
    JSON.stringify(storageBuilds),
  );
  dispatch({ type: AppContextActions.changeLocalStorageBuildKeys, payload: { localStorageBuildKeys: newBuildKeys } });
};

const setActiveBuildFromStorage = (
  state: ContextStateInterface,
  dispatch: (action: ActionInterface) => void,
  buildName: string,
  game: string,
  faction: string,
  character: string,
) => {
  const storageBuilds: StorageInterface = loadBuildsFromStorage(state);
  const loadBuild = storageBuilds[buildName];
  if (loadBuild === undefined || state.characterData === null) {
    return;
  }
  const newCharacterBuild = createCharacterBuildFromArray(loadBuild, state.characterData, game, faction, character);
  dispatch({ type: AppContextActions.changeCharacterBuild, payload: { characterBuild: newCharacterBuild } });

  if (isValidSkillTree(newCharacterBuild, state.characterData)) {
    dispatch({ type: AppContextActions.changeCharacterBuild, payload: { characterBuild: newCharacterBuild } });
  } else {
    toast.error(
      'The build you are trying to load is invalid, this may have been caused by an update or bugfix to the character tree. Sorry!',
      { id: `${buildName} set storage build`, duration: 6000 },
    );
    const emptyCharacterBuild = createEmptyCharacterBuild(state.characterData, game, faction, character);
    dispatch({ type: AppContextActions.changeCharacterBuild, payload: { characterBuild: emptyCharacterBuild } });
  }
};

const loadBuildsFromStorage = (state: ContextStateInterface) => {
  const storageBuilds = localStorage.getItem(
    `${state.characterBuild?.game}/${state.characterBuild?.faction}/${state.characterBuild?.character}${
      state.selectedAltFactionNodeSet !== '' ? `$${state.selectedAltFactionNodeSet}` : ''
    }`,
  );
  if (storageBuilds === null) {
    return {};
  } else {
    return JSON.parse(storageBuilds);
  }
};

const loadAdvancedToggleFromStorage = () => {
  const curValue = localStorage.getItem('plannerAdvancedStatsToggle');
  if (curValue === null) {
    return false;
  } else {
    return 'true' === curValue;
  }
};

const saveAdvancedToggleToStorage = (value: boolean) => {
  localStorage.setItem('plannerAdvancedStatsToggle', JSON.stringify(value));
};

const loadExtrasDrawerOpenFromStorage = () => {
  const curValue = localStorage.getItem('plannerExtrasDrawerOpen');
  if (curValue === null) {
    return true;
  } else {
    return 'true' === curValue;
  }
};

const saveExtrasDrawerOpenToStorage = (value: boolean) => {
  localStorage.setItem('plannerExtrasDrawerOpen', JSON.stringify(value));
};

const loadStatsDrawerOpenFromStorage = () => {
  const curValue = localStorage.getItem('plannerStatsDrawerOpen');
  if (curValue === null) {
    return true;
  } else {
    return 'true' === curValue;
  }
};

const saveStatsDrawerOpenToStorage = (value: boolean) => {
  localStorage.setItem('plannerStatsDrawerOpen', JSON.stringify(value));
};

export {
  loadBuildsFromStorage,
  saveBuildToStorage,
  deleteBuildFromStorage,
  setActiveBuildFromStorage,
  initializeBuildsFromStorage,
  loadAdvancedToggleFromStorage,
  saveAdvancedToggleToStorage,
  loadExtrasDrawerOpenFromStorage,
  saveExtrasDrawerOpenToStorage,
  loadStatsDrawerOpenFromStorage,
  saveStatsDrawerOpenToStorage,
};
