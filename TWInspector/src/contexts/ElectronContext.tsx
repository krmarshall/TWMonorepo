import { ReactElement, createContext, useReducer } from 'react';
import {
  loadLastSelectedModPaths,
  loadRpfmPath,
  loadSchemaPath,
  loadWarhammer3Location,
  loadWorkspacePath,
  saveLastSelectedModPaths,
  saveRpfmPath,
  saveSchemaPath,
  saveWarhammer3Location,
  saveWorkspacePath,
} from '../utils/renderer/localStorage';

interface ElectronContextStateInterface {
  rpfmPath: string;
  schemaPath: string;
  workspacePath: string;
  lastSelectedModPaths: Array<string>;
  warhammer3Location: string;
}

const initialState: ElectronContextStateInterface = {
  rpfmPath: loadRpfmPath(),
  schemaPath: loadSchemaPath(),
  workspacePath: loadWorkspacePath(),
  lastSelectedModPaths: loadLastSelectedModPaths(),
  warhammer3Location: loadWarhammer3Location(),
};

interface ElectronActionInterface {
  type: string;
  payload: {
    rpfmPath?: string;
    schemaPath?: string;
    workspacePath?: string;
    lastSelectedModPaths?: Array<string>;
    warhammer3Location?: string;
  };
}

enum ElectronContextActions {
  changeRpfmPath = 'changeRpfmPath',
  changeSchemaPath = 'changeSchemaPath',
  changeWorkspacePath = 'changeWorkspacePath',
  changeWarhammer3Location = 'changeWarhammer3Location',
  changeLastSelectedModPaths = 'changeLastSelectedModPaths',
}

const reducer = (state: ElectronContextStateInterface, action: ElectronActionInterface) => {
  switch (action.type) {
    case ElectronContextActions.changeRpfmPath: {
      const newState = { ...state };
      if (action.payload.rpfmPath === undefined) {
        return state;
      }
      saveRpfmPath(action.payload.rpfmPath);
      newState.rpfmPath = action.payload.rpfmPath;
      return newState;
    }

    case ElectronContextActions.changeSchemaPath: {
      const newState = { ...state };
      if (action.payload.schemaPath === undefined) {
        return state;
      }
      saveSchemaPath(action.payload.schemaPath);
      newState.schemaPath = action.payload.schemaPath;
      return newState;
    }

    case ElectronContextActions.changeWorkspacePath: {
      const newState = { ...state };
      if (action.payload.workspacePath === undefined) {
        return state;
      }
      saveWorkspacePath(action.payload.workspacePath);
      newState.workspacePath = action.payload.workspacePath;
      return newState;
    }

    case ElectronContextActions.changeLastSelectedModPaths: {
      const newState = { ...state };
      if (action.payload.lastSelectedModPaths === undefined) {
        return state;
      }
      saveLastSelectedModPaths(action.payload.lastSelectedModPaths);
      newState.lastSelectedModPaths = action.payload.lastSelectedModPaths;
      return newState;
    }

    case ElectronContextActions.changeWarhammer3Location: {
      const newState = { ...state };
      if (action.payload.warhammer3Location === undefined) {
        return state;
      }
      saveWarhammer3Location(action.payload.warhammer3Location);
      newState.warhammer3Location = action.payload.warhammer3Location;
      return newState;
    }

    default: {
      return state;
    }
  }
};

const ElectronContext = createContext<{
  state: ElectronContextStateInterface;
  dispatch: (action: ElectronActionInterface) => void;
}>({
  state: initialState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {},
});

interface InputProps {
  children: ReactElement;
}

const ElectronProvider: React.FC<InputProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <ElectronContext.Provider value={{ state, dispatch }}>{children}</ElectronContext.Provider>;
};

export { ElectronProvider, ElectronContext, ElectronContextActions };
export type { ElectronActionInterface, ElectronContextStateInterface };
