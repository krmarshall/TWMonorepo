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
  const { isMobile, adWidthControl } = useBulkMediaQueries();

  useEffect(() => {
    if (isMobile) {
      dispatch({ type: AppContextActions.changeExtrasDrawerOpen, payload: { extrasDrawerOpen: false } });
    }
  }, [isMobile]);

  let layoutType = isMobile
    ? 'flex-col gap-2 mx-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600'
    : 'flex-row place-content-evenly slide-out-vert';

  if (extrasDrawerOpen && !isMobile) {
    layoutType += ' show max-h-[20vh] min-h-32';
  } else if (!isMobile) {
    layoutType += ' max-h-0 min-h-0';
  }
  return (
    <div className={layoutType + ' flex mt-1.5'}>
      {state.characterData?.items && state.characterData?.items.length > 0 && <CharacterItems />}
      {state.characterData?.backgroundSkills && state.characterData.backgroundSkills.length > 0 && <BackgroundSkills />}
      {state.characterData?.factionEffects !== undefined && (
        <FactionEffects factionEffect={state.characterData?.factionEffects} />
      )}
      {!isMobile && <BuildStorage />}
      {/* {adWidthControl && <div className="grow max-w-128 max-h-[19vh] border border-gray-400">Ad Test</div>} */}
    </div>
  );
};

export default ExtrasDrawer;
