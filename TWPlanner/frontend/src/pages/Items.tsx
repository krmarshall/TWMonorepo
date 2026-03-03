import { useContext, useEffect } from 'react';
import useBulkMediaQueries from '../hooks/useBulkMediaQueries.tsx';
import ItemModSelector from '../components/Items/ItemModSelector.tsx';
import ItemFilter from '../components/Items/ItemFilter.tsx';
import api from '../api/api.ts';
import { AppContext, AppContextActions } from '../contexts/AppContext.tsx';
import toast from 'react-hot-toast';
import ItemCell from '../components/Items/ItemCell.tsx';

const Items = () => {
  const { state, dispatch } = useContext(AppContext);
  const { selectedItem, itemData } = state;
  const { isMobile } = useBulkMediaQueries();

  useEffect(() => {
    document.title = 'TWP - Items';
  }, []);

  useEffect(() => {
    if (itemData === null) {
      api
        .getItem(selectedItem)
        .then((response) => {
          dispatch({ type: AppContextActions.changeItemData, payload: { itemData: response } });
        })
        .catch((err) => {
          toast.error(`${err}`, { id: 'err api call' });
          dispatch({ type: AppContextActions.changeCharacterData, payload: { characterData: null } });
        });
    }
  }, []);

  return (
    <div className="w-full p-2 overflow-hidden">
      {!isMobile && ( // Desktop Layout
        // height calc is screen - height of header, not ideal but it works
        <div className="flex flex-col h-[calc(100vh-72px)]">
          <div className="flex flex-row flex-nowrap w-full gap-2">
            <ItemModSelector />
            <ItemFilter />
          </div>
          <ul className="flex flex-row flex-wrap gap-2 p-2 w-full bg-gray-700 border rounded-md border-gray-500 justify-self-center p-1 my-2 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600">
            {itemData?.map((item) => {
              return <ItemCell key={item.key} item={item} />;
            })}
          </ul>
        </div>
      )}

      {isMobile && <div></div>}
    </div>
  );
};

export default Items;
