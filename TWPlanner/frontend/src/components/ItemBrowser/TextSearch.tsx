import { useState } from 'react';

interface PropsInterface {
  searchValues: Array<string>;
  setSearchValues: React.Dispatch<React.SetStateAction<string[]>>;
}

const TextSearch = ({ searchValues, setSearchValues }: PropsInterface) => {
  const [searchValue, setSearchValue] = useState('');
  const addSearchValue = () => {
    const newSearchValues = structuredClone(searchValues);
    newSearchValues.push(searchValue);
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
        <button className="button py-0 px-2 bg-green-600 cursor-pointer" onClick={addSearchValue}>
          +
        </button>
      </div>

      <ul className="">
        {searchValues.map((value, index) => {
          return (
            <li key={index} className="flex flex-row flex-nowrap">
              <p>{value}</p>
              <button onClick={() => removeSearchValue(index)}>X</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default TextSearch;
