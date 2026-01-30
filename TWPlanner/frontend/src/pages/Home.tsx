import ModSelector from '../components/CharacterSelect/ModSelector.tsx';
import FactionSelector from '../components/CharacterSelect/FactionSelector.tsx';
import CharacterSelector from '../components/CharacterSelect/CharacterSelector.tsx';
import { useParams } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AppContext, AppContextActions } from '../contexts/AppContext.tsx';
import gameData from '../data/gameData.ts';
import CompilationFilter from '../components/CharacterSelect/CompilationFilter.tsx';
import { CompilationGroupsInterface } from '../@types/CompilationGroupsInterfaceRef.ts';
import useBulkMediaQueries from '../hooks/useBulkMediaQueries.tsx';

const Home = () => {
  const { state, dispatch } = useContext(AppContext);
  const { selectedMod } = state;
  const { mod, faction } = useParams();
  const { isMobile } = useBulkMediaQueries();

  // Info toast example
  // let toastId: any;
  // useEffect(() => {
  //   if (toastId === undefined && !showedHomeToast) {
  //     toastId = toast.custom(
  //       <div className="p-3 bg-gray-600 border rounded-xl border-gray-500 text-gray-50 flex flex-row place-content-around">
  //         <h1 className="text-4xl mx-6 my-auto">ℹ</h1>
  //         <p className="text-3xl m-auto w-160 text-center">
  //           Backend tooling has had an extensive overhaul, please report any regressions or new issues you encounter,
  //           see the Issues tab for instructions.
  //         </p>
  //         <button
  //           className="text-2xl bg-slate-500 rounded-2xl py-1 px-5 my-auto ml-4 shadow-md hover-scale"
  //           onClick={() => toast.remove(toastId)}
  //         >
  //           Dismiss
  //         </button>
  //       </div>,
  //       { position: 'bottom-center', duration: 20000 }
  //     );
  //     dispatch({ type: AppContextActions.changeShowedHomeToast, payload: { showedHomeToast: true } });
  //   }
  // }, []);

  useEffect(() => {
    if (mod !== undefined && faction !== undefined) {
      dispatch({
        type: AppContextActions.changeModFaction,
        payload: { selectedMod: mod, selectedFaction: faction },
      });
    }

    document.title = 'Total Warhammer Planner';
  }, []);

  useEffect(() => {
    if (state.characterData !== null) {
      dispatch({ type: AppContextActions.changeCleanCharacterData, payload: { cleanCharacterData: null } });
      dispatch({ type: AppContextActions.changeSelectedStartPosTrait, payload: { selectedStartPosTrait: '' } });
      dispatch({
        type: AppContextActions.changeSelectedAltFactionNodeSet,
        payload: { selectedAltFactionNodeSet: '', characterBuild: null, characterData: null },
      });
      dispatch({
        type: AppContextActions.changeSearchString,
        payload: { searchString: null, highlightArray: null, highlightArrayTech: null },
      });
    }
  }, []);

  return (
    <div className="w-full h-full p-2 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600">
      {!isMobile && ( // Desktop Layout
        <div className="flex flex-col">
          <div className="flex flex-row flex-nowrap w-full">
            <ModSelector />
            <div
              className={
                'w-full ml-2 p-1 flex flex-col flex-nowrap bg-gray-700 border rounded-md border-gray-500 max-h-112 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-60 '
              }
            >
              {gameData[selectedMod].compilationGroups !== undefined && (
                <CompilationFilter compGroups={gameData[selectedMod].compilationGroups as CompilationGroupsInterface} />
              )}
              <FactionSelector />
            </div>
          </div>

          <CharacterSelector />
        </div>
      )}
      {isMobile && ( // Mobile Layout
        <div className="flex flex-col">
          <ModSelector />
          <div className="w-full p-1 bg-gray-700 border rounded-md border-gray-500">
            {gameData[selectedMod].compilationGroups !== undefined && (
              <CompilationFilter compGroups={gameData[selectedMod].compilationGroups as CompilationGroupsInterface} />
            )}
            <FactionSelector />
          </div>

          <CharacterSelector />
        </div>
      )}
    </div>
  );
};

export default Home;
