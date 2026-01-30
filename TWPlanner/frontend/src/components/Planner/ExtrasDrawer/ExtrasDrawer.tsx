import { useContext, useEffect } from 'react';
import { AppContext, AppContextActions } from '../../../contexts/AppContext.tsx';
import BuildStorage from './BuildStorage.tsx';
import CharacterItems from './CharacterItems.tsx';
import BackgroundSkills from './BackgroundSkills.tsx';
import useBulkMediaQueries from '../../../hooks/useBulkMediaQueries.tsx';
import FactionEffects from './FactionEffects.tsx';

const ExtrasDrawer = () => {
  const { state, dispatch } = useContext(AppContext);
  const { extrasDrawerOpen } = state;
  const { isShortWidth, isShortHeight, isThin, drawerAdWidth } = useBulkMediaQueries();

  const isShort = isShortWidth || isShortHeight ? true : false;

  useEffect(() => {
    if (isShort || isThin) {
      dispatch({ type: AppContextActions.changeExtrasDrawerOpen, payload: { extrasDrawerOpen: false } });
    }
  }, [isShort, isThin]);

  let drawerClass = 'mt-1.5 flex flex-row place-content-evenly slide-out-vert';
  if (extrasDrawerOpen) {
    drawerClass += ' show max-h-[20vh] min-h-32';
  } else {
    drawerClass += ' max-h-0 min-h-0';
  }

  const drawerClassShort =
    'flex flex-col mx-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600';

  return (
    <div className={isShort ? drawerClassShort : drawerClass}>
      {state.characterData?.items && state.characterData?.items.length > 0 && <CharacterItems />}
      {state.characterData?.backgroundSkills && state.characterData.backgroundSkills.length > 0 && <BackgroundSkills />}
      {state.characterData?.factionEffects !== undefined && (
        <FactionEffects factionEffect={state.characterData?.factionEffects} />
      )}
      {!isShort && <BuildStorage />}
      {drawerAdWidth && <div className="grow max-w-128 max-h-[18vh] border border-gray-400"></div>}
    </div>
  );
};

export default ExtrasDrawer;
