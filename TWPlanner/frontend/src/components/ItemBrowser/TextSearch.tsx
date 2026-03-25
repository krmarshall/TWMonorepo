import { useState } from 'react';

interface PropsInterface {
  searchValues: Array<string>;
  setSearchValues: React.Dispatch<React.SetStateAction<string[]>>;
}

const TextSearch = ({ searchValues, setSearchValues }: PropsInterface) => {
  const [searchValue, setSearchValue] = useState('');
  const addSearchValue = () => {
    if (searchValue === '') {
      return;
    }
    const newSearchValues = structuredClone(searchValues);
    newSearchValues.push(searchValue.toLowerCase());
    setSearchValues(newSearchValues);
    setSearchValue('');
  };

  const removeSearchValue = (removeIndex: number) => {
    const newSearchValues = structuredClone(searchValues);
    newSearchValues.splice(removeIndex, 1);
    setSearchValues(newSearchValues);
  };
  return (
    <div>
      <div className="flex flex-row flex-nowrap">
        <input
          className="w-32 rounded m-1 px-1 text-xl text-center text-black caret-black focus:outline-none placeholder-opacity-60 placeholder-black bg-gray-200"
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.target.value);
          }}
          onKeyUp={(event) => {
            if (event.key === 'Enter') {
              addSearchValue();
            }
          }}
        />
        <button className="button text-2xl py-0 px-2 bg-green-600 cursor-pointer hover-scale" onClick={addSearchValue}>
          +
        </button>
      </div>

      <ul className="max-h-44 flex flex-col gap-1 text-xl overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600">
        {searchValues.map((value, index) => {
          return (
            <li
              key={index}
              className="flex flex-row flex-nowrap place-content-between w-full bg-gray-600 rounded py-0.5 px-2"
            >
              <p className="text-gray-50">{value}</p>
              <button
                onClick={() => removeSearchValue(index)}
                className="text-red-500 font-sans hover:bg-gray-500 px-1 rounded text-center"
              >
                X
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default TextSearch;
