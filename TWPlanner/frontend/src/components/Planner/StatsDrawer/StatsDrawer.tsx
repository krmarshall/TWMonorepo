import { useContext, useEffect } from 'react';
import FactionVariantSelect from './FactionVariantSelect.tsx';
import UnitStats from './UnitStats.tsx';
import { AppContext, AppContextActions } from '../../../contexts/AppContext.tsx';
import useBulkMediaQueries from '../../../hooks/useBulkMediaQueries.tsx';
import StartPosTraits from './StartPosTraits.tsx';

const StatsDrawer = () => {
  const { state, dispatch } = useContext(AppContext);
  const { characterData, statsDrawerOpen } = state;
  const { isShortWidth, isShortHeight, isThin } = useBulkMediaQueries();

  const isShort = isShortWidth || isShortHeight ? true : false;

  useEffect(() => {
    if (isShort || isThin) {
      dispatch({ type: AppContextActions.changeStatsDrawerOpen, payload: { statsDrawerOpen: false } });
    }
  }, [isShort, isThin]);

  let drawerClass =
    'w-full shrink-0 slide-out-hor border rounded border-gray-500 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600';
  if (statsDrawerOpen) {
    drawerClass += ' max-w-68 mr-1 p-1.5 show';
  } else {
    drawerClass += ' max-w-0';
  }

  const drawerClassShort =
    'mx-auto h-auto w-68 mt-1.5 p-1.5 border rounded border-gray-500 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600';

  return (
    <div className={isShort ? drawerClassShort : drawerClass}>
      {characterData?.startPosTraits !== undefined && <StartPosTraits />}
      {characterData?.altFactionNodeSets !== undefined && <FactionVariantSelect />}
      <UnitStats />
    </div>
  );
};

export default StatsDrawer;
