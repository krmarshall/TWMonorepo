import { createContext, ReactElement, useReducer } from 'react';
import BuildInterface from '../@types/BuildInterface.ts';
import { CharacterInterface } from '../@types/CharacterInterfaceRef.ts';
import { TechSetInterface } from '../@types/TechInterface.ts';
import {
  loadExtrasDrawerOpenFromStorage,
  loadStatsDrawerOpenFromStorage,
  saveExtrasDrawerOpenToStorage,
  saveStatsDrawerOpenToStorage,
} from '../utils/storageFunctions.ts';
import { HighlightArrayInterface } from '../utils/searchFunctions.ts';

interface ContextStateInterface {
  selectedMod: string;
  selectedModTech: string;
  selectedFaction: string;
  characterData: CharacterInterface | null;
  characterBuild: BuildInterface | null;
  techData: TechSetInterface | null;
  localStorageBuildKeys: Array<string>;
  selectedCompGroups: Array<string>;
  showedHomeToast: boolean;
  showedTechToast: boolean;
  cleanCharacterData: CharacterInterface | null;
  selectedAltFactionNodeSet: string;
  selectedStartPosTrait: string;
  extrasDrawerOpen: boolean;
  statsDrawerOpen: boolean;
  highlightArray?: HighlightArrayInterface | null;
  highlightArrayTech?: Array<Array<boolean>> | null;
  searchString: string | null;
}

const initialState: ContextStateInterface = {
  selectedMod: 'vanilla3',
  selectedModTech: 'vanilla3',
  selectedFaction: 'bst_beastmen',
  characterData: null,
  characterBuild: null,
  techData: null,
  localStorageBuildKeys: [],
  selectedCompGroups: [],
  showedHomeToast: false,
  showedTechToast: false,
  cleanCharacterData: null,
  selectedAltFactionNodeSet: '',
  selectedStartPosTrait: '',
  extrasDrawerOpen: loadExtrasDrawerOpenFromStorage(),
  statsDrawerOpen: loadStatsDrawerOpenFromStorage(),
  highlightArray: null,
  highlightArrayTech: null,
  searchString: null,
};

interface ActionInterface {
  type: string;
  payload: {
    selectedMod?: string;
    selectedModTech?: string;
    selectedFaction?: string;
    characterData?: CharacterInterface | null;
    characterBuild?: BuildInterface | null;
    techData?: TechSetInterface | null;
    localStorageBuildKeys?: Array<string>;
    selectedCompGroups?: Array<string>;
    showedHomeToast?: boolean;
    showedTechToast?: boolean;
    cleanCharacterData?: CharacterInterface | null;
    selectedAltFactionNodeSet?: string;
    selectedStartPosTrait?: string;
    extrasDrawerOpen?: boolean;
    statsDrawerOpen?: boolean;
    highlightArray?: HighlightArrayInterface | null;
    highlightArrayTech?: Array<Array<boolean>> | null;
    searchString?: string | null;
  };
}

enum AppContextActions {
  changeGame = 'changeGame',
  changeMod = 'changeMod',
  changeModTech = 'changeModTech',
  changeFaction = 'changeFaction',
  changeCharacterData = 'changeCharacterData',
  changeCharacterBuild = 'changeCharacterBuild',
  changeTechData = 'changeTechData',
  changeLocalStorageBuildKeys = 'changeLocalStorageBuildKeys',
  changeModFaction = 'changeModFaction',
  changeSelectedCompGroups = 'changeSelectedCompGroups',
  changeShowedHomeToast = 'changeShowedHomeToast',
  changeShowedTechToast = 'changeShowedTechToast',
  changeCleanCharacterData = 'changeCleanCharacterData',
  changeSelectedAltFactionNodeSet = 'changeSelectedAltFactionNodeSet',
  changeSelectedStartPosTrait = 'changeSelectedStartPosTrait',
  changeExtrasDrawerOpen = 'changeExtrasDrawerOpen',
  changeStatsDrawerOpen = 'changeStatsDrawerOpen',
  changeSearchString = 'changeSearchString',
}

const reducer = (state: ContextStateInterface, action: ActionInterface) => {
  switch (action.type) {
    case AppContextActions.changeMod: {
      const newState = { ...state };
      if (action.payload.selectedMod === undefined) {
        return state;
      }
      newState.selectedMod = action.payload.selectedMod;
      newState.selectedCompGroups = [];
      return newState;
    }

    case AppContextActions.changeModTech: {
      const newState = { ...state };
      if (action.payload.selectedModTech === undefined) {
        return state;
      }
      newState.selectedModTech = action.payload.selectedModTech;
      return newState;
    }

    case AppContextActions.changeFaction: {
      const newState = { ...state };
      if (action.payload.selectedFaction === undefined) {
        return state;
      }
      newState.selectedFaction = action.payload.selectedFaction;
      return newState;
    }

    case AppContextActions.changeModFaction: {
      const newState = { ...state };

      if (action.payload.selectedMod === undefined) {
        return state;
      }
      newState.selectedMod = action.payload.selectedMod;
      newState.selectedCompGroups = [];

      if (action.payload.selectedFaction === undefined) {
        return state;
      }
      newState.selectedFaction = action.payload.selectedFaction;
      return newState;
    }

    case AppContextActions.changeCharacterData: {
      const newState = { ...state };
      if (action.payload.characterData === undefined) {
        return state;
      }
      newState.characterData = action.payload.characterData;
      return newState;
    }

    case AppContextActions.changeCharacterBuild: {
      const newState = { ...state };
      if (action.payload.characterBuild === undefined) {
        return state;
      }
      newState.characterBuild = action.payload.characterBuild;
      return newState;
    }

    case AppContextActions.changeTechData: {
      const newState = { ...state };
      if (action.payload.techData === undefined) {
        return state;
      }
      newState.techData = action.payload.techData;
      return newState;
    }

    case AppContextActions.changeLocalStorageBuildKeys: {
      const newState = { ...state };
      if (action.payload.localStorageBuildKeys === undefined) {
        return state;
      }
      newState.localStorageBuildKeys = action.payload.localStorageBuildKeys;
      return newState;
    }

    case AppContextActions.changeSelectedCompGroups: {
      const newState = { ...state };
      if (action.payload.selectedCompGroups === undefined) {
        return state;
      }
      newState.selectedCompGroups = action.payload.selectedCompGroups;
      return newState;
    }

    case AppContextActions.changeShowedHomeToast: {
      const newState = { ...state };
      if (action.payload.showedHomeToast === undefined) {
        return state;
      }
      newState.showedHomeToast = action.payload.showedHomeToast;
      return newState;
    }

    case AppContextActions.changeShowedTechToast: {
      const newState = { ...state };
      if (action.payload.showedTechToast === undefined) {
        return state;
      }
      newState.showedTechToast = action.payload.showedTechToast;
      return newState;
    }

    case AppContextActions.changeCleanCharacterData: {
      const newState = { ...state };
      if (action.payload.cleanCharacterData === undefined) {
        return state;
      }
      newState.cleanCharacterData = action.payload.cleanCharacterData;
      return newState;
    }

    case AppContextActions.changeSelectedAltFactionNodeSet: {
      const newState = { ...state };
      if (
        action.payload.selectedAltFactionNodeSet === undefined ||
        action.payload.characterBuild === undefined ||
        action.payload.characterData === undefined
      ) {
        return state;
      }
      newState.selectedAltFactionNodeSet = action.payload.selectedAltFactionNodeSet;
      newState.characterBuild = action.payload.characterBuild;
      newState.characterData = action.payload.characterData;
      return newState;
    }

    case AppContextActions.changeSelectedStartPosTrait: {
      const newState = { ...state };
      if (action.payload.selectedStartPosTrait === undefined) {
        return state;
      }
      newState.selectedStartPosTrait = action.payload.selectedStartPosTrait;
      return newState;
    }

    case AppContextActions.changeExtrasDrawerOpen: {
      const newState = { ...state };
      if (action.payload.extrasDrawerOpen === undefined) {
        return state;
      }
      saveExtrasDrawerOpenToStorage(action.payload.extrasDrawerOpen);
      newState.extrasDrawerOpen = action.payload.extrasDrawerOpen;
      return newState;
    }

    case AppContextActions.changeStatsDrawerOpen: {
      const newState = { ...state };
      if (action.payload.statsDrawerOpen === undefined) {
        return state;
      }
      saveStatsDrawerOpenToStorage(action.payload.statsDrawerOpen);
      newState.statsDrawerOpen = action.payload.statsDrawerOpen;
      return newState;
    }

    case AppContextActions.changeSearchString: {
      const newState = { ...state };
      if (action.payload.searchString === undefined) {
        return state;
      }
      newState.searchString = action.payload.searchString;
      newState.highlightArray = action.payload.highlightArray;
      newState.highlightArrayTech = action.payload.highlightArrayTech;
      return newState;
    }

    default: {
      return state;
    }
  }
};

const AppContext = createContext<{ state: ContextStateInterface; dispatch: (action: ActionInterface) => void }>({
  state: initialState,
  dispatch: () => {},
});

interface InputProps {
  children: ReactElement;
}

const AppProvider: React.FC<InputProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export { AppProvider, AppContext, AppContextActions };
export type { ContextStateInterface, ActionInterface };
