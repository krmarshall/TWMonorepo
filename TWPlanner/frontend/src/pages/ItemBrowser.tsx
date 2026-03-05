import { useContext, useEffect, useRef } from 'react';
import useBulkMediaQueries from '../hooks/useBulkMediaQueries.tsx';
import ItemModSelector from '../components/ItemBrowser/ItemModSelector.tsx';
import ItemFilter from '../components/ItemBrowser/ItemFilter.tsx';
import api from '../api/api.ts';
import { AppContext, AppContextActions } from '../contexts/AppContext.tsx';
import toast from 'react-hot-toast';
import ItemCell from '../components/ItemBrowser/ItemBrowserCell.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMediaQuery } from 'react-responsive';

const ItemBrowser = () => {
  const { state, dispatch } = useContext(AppContext);
  const { selectedItem, itemData } = state;
  const { isMobile } = useBulkMediaQueries();

  const parentRef = useRef(null);

  const res1080 = useMediaQuery({ minWidth: 1920 });
  const res1440 = useMediaQuery({ minWidth: 2560 });
  const res2160 = useMediaQuery({ minWidth: 3840 });
  let lanes = 4;
  if (res1080) lanes = 5;
  if (res1440) lanes = 6;
  if (res2160) lanes = 9;

  const rowVirtualizer = useVirtualizer({
    count: itemData?.length ?? 1000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 300,
    overscan: 5,
    lanes: lanes,
    measureElement: (element) => element.getBoundingClientRect().height,
    gap: 8,
    useFlushSync: false,
  });

  useEffect(() => {
    document.title = 'TWP - Items';
  }, []);

  useEffect(() => {
    api
      .getItem(selectedItem)
      .then((response) => {
        dispatch({ type: AppContextActions.changeItemData, payload: { itemData: response } });
      })
      .catch((err) => {
        toast.error(`${err}`, { id: 'err api call' });
      });
  }, [selectedItem]);

  return (
    <div className="w-full p-2 overflow-hidden">
      {!isMobile && ( // Desktop Layout
        // height calc is screen - height of header, not ideal but it works
        <div className="flex flex-col h-[calc(100vh-72px)]">
          <div className="flex flex-row flex-nowrap w-full gap-2">
            <ItemModSelector />
            <ItemFilter />
          </div>
          {itemData === null && <LoadingSpinner />}
          {/* <ul
            className="flex flex-row flex-wrap justify-between gap-2 w-full h-full p-2 my-2 bg-gray-700 border rounded-md border-gray-500 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600"
          >
            {itemData?.map((item) => {
              return <ItemCell key={item.key} item={item} />;
            })}
          </ul> */}
          {itemData !== null && (
            <div
              ref={parentRef}
              className="w-full h-full p-2 my-2 bg-gray-700 border rounded-md border-gray-500 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600"
            >
              <ul className={`h-[${rowVirtualizer.getTotalSize()}px] w-full relative`}>
                {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                  <div
                    ref={rowVirtualizer.measureElement}
                    data-index={virtualRow.index}
                    key={virtualRow.index}
                    className="absolute top-0 h-fit"
                    style={{
                      left: `${virtualRow.lane * (100 / lanes)}%`,
                      width: `${100 / lanes}%`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <ItemCell item={itemData?.[virtualRow.index]} />
                  </div>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {isMobile && <div></div>}
    </div>
  );
};

export default ItemBrowser;
