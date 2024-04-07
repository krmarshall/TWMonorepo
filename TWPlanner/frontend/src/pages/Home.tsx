import ModSelector from '../components/CharacterSelect/ModSelector';
import FactionSelector from '../components/CharacterSelect/FactionSelector';
import CharacterSelector from '../components/CharacterSelect/CharacterSelector';
import { useParams } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AppContext, AppContextActions } from '../contexts/AppContext';
import { useMediaQuery } from 'react-responsive';
import gameData from '../data/gameData';
import CompilationFilter from '../components/CharacterSelect/CompilationFilter';
import { CompilationGroupsInterface } from '../@types/CompilationGroupsInterfaceRef';

const Home = () => {
  const { state, dispatch } = useContext(AppContext);
  const { selectedMod } = state;
  const { mod, faction } = useParams();

  const isTabletOrMobileWidth = useMediaQuery({ maxWidth: 1365 });
  const isMobileWidth = useMediaQuery({ maxWidth: 1023 });

  // Info toast example
  // let toastId: any;
  // useEffect(() => {
  //   if (toastId === undefined && !showedHomeToast) {
  //     toastId = toast.custom(
  //       <div className="p-3 bg-gray-600 border rounded-xl border-gray-500 text-gray-50 flex flex-row place-content-around">
  //         <h1 className="text-4xl mx-6 my-auto">ℹ</h1>
  //         <p className="text-3xl m-auto w-[40rem] text-center">
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

  let modContainerWidth;
  if (isMobileWidth) {
    modContainerWidth = 'w-[100%] mt-3';
  } else if (isTabletOrMobileWidth) {
    modContainerWidth = 'w-[100%] mt-3';
  } else {
    modContainerWidth = 'w-[45%] mt-3';
  }
  const factionContainerWidth = isTabletOrMobileWidth ? 'w-[100%]' : 'w-[55%] mt-3';

  return (
    <div className="grow mt-1 bg-gray-700 w-full border border-gray-500 rounded-md px-3 pb-2 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600">
      <div className="flex flex-row flex-wrap place-content-center">
        <ModSelector containerWidth={modContainerWidth} />
        <div
          className={
            'flex flex-col flex-nowrap max-h-[33rem] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-60 ' +
            factionContainerWidth
          }
        >
          {gameData[selectedMod].compilationGroups !== undefined && (
            <CompilationFilter compGroups={gameData[selectedMod].compilationGroups as CompilationGroupsInterface} />
          )}
          <FactionSelector />
        </div>

        <CharacterSelector />
      </div>
    </div>
  );
};

export default Home;
