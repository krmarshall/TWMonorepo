import { useContext } from 'react';
import { AppContext, AppContextActions } from '../../contexts/AppContext.tsx';
import useBulkMediaQueries from '../../hooks/useBulkMediaQueries.tsx';
import itemGameData from '../../data/itemGameData.ts';
import ReactImage from '../ReactImage.tsx';
import placeholderImg from '../../imgs/other/0placeholder.webp';

const ItemModSelector = () => {
  const { state, dispatch } = useContext(AppContext);
  const { selectedModItem } = state;
  const { isMobile } = useBulkMediaQueries();

  const modKeys = Object.keys(itemGameData);

  const layoutType = isMobile
    ? 'w-fit mb-2'
    : 'w-140 max-h-112 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600';

  return (
    <div className={layoutType + ' bg-gray-700 border rounded-md border-gray-500 justify-self-center p-1'}>
      <div className="flex flex-row place-content-center">
        <hr className="grow mt-5 opacity-50 border-gray-200" />
        <h1 className="w-max text-center text-4xl mx-2 text-gray-200 text-shadow">Mods</h1>
        <hr className="grow mt-5 opacity-50 border-gray-200" />
      </div>
      <ul className="flex flex-row flex-wrap justify-center py-1">
        {modKeys.map((modKey) => {
          const item = itemGameData[modKey];
          let liClassName =
            'flex flex-col justify-around m-1 px-1.5 py-1 border border-gray-500 shadow-lg shadow-gray-800/60 rounded-lg hover-scale';

          if (modKey === selectedModItem) {
            liClassName += ' bg-gray-600 hover:bg-gray-500/80 scale-105';
          } else {
            liClassName += ' hover:bg-gray-600';
          }
          return (
            <li
              key={modKey}
              className={liClassName}
              onClick={() => {
                dispatch({ type: AppContextActions.changeItem, payload: { selectedModItem: modKey } });
              }}
            >
              <h2 className="w-36 text-center mx-auto text-gray-200 text-2xl text-shadow mb-1">{item.text}</h2>
              <ReactImage
                srcList={[item.image, placeholderImg]}
                alt={`${item.text} icon`}
                className="m-auto w-auto max-w-36 max-h-24 drop-shadow-[0.1rem_0.1rem_0.5rem_rgba(0,0,0,0.7)]"
                h="128"
                w="128"
              />
              <h3 className="text-center text-gray-300 text-base text-shadow mt-2">{item.updated}</h3>
              {item.workshopLink !== undefined && (
                <h3 className="text-center text-blue-400 text-lg text-shadow">
                  <a href={item.workshopLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Steam Workshop
                  </a>
                </h3>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ItemModSelector;
