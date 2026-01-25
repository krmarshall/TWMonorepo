import { useContext, useEffect } from 'react';
import TechModSelector from '../components/Techs/TechModSelector.tsx';
import TechSelector from '../components/Techs/TechSelector.tsx';
import { AppContext, AppContextActions } from '../contexts/AppContext.tsx';

const TechHome = () => {
  const { state, dispatch } = useContext(AppContext);
  const { techData } = state;
  useEffect(() => {
    document.title = 'Total Warhammer Planner';
  }, []);

  useEffect(() => {
    if (techData !== null) {
      dispatch({
        type: AppContextActions.changeTechData,
        payload: { techData: null },
      });
      dispatch({
        type: AppContextActions.changeSearchString,
        payload: { searchString: null, highlightArray: null, highlightArrayTech: null },
      });
    }
  }, []);

  return (
    <div className="w-full h-full p-2 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600">
      <div className="flex flex-col">
        <TechModSelector />
        <TechSelector />
      </div>
    </div>
  );
};

export default TechHome;
