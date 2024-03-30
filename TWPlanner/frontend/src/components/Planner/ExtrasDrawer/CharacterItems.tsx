import { useContext } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import ItemCell from './ItemCell';

const CharacterItems = () => {
  const { state } = useContext(AppContext);
  return (
    <div className="flex flex-col mt-1.5 mx-1 min-w-[14.5rem] max-w-[35rem] shadow-lg border border-gray-500 rounded">
      <h2 className="text-center text-3xl mt-1 text-gray-200 text-shadow">Items</h2>
      <div className="flex flex-row flex-wrap w-full h-full pb-1 overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600">
        {state.characterData?.items?.map((item, index) => {
          return <ItemCell key={item.key} item={item} index={index} />;
        })}
      </div>
    </div>
  );
};

export default CharacterItems;
