import { useContext, useEffect, useState } from 'react';
import { AppContext, AppContextActions } from '../../contexts/AppContext.tsx';
import { searchDataForKeyword, searchTechDataForKeyword } from '../../utils/searchFunctions.ts';

const SearchBox = ({ skill }: { skill: boolean }) => {
  const { state, dispatch } = useContext(AppContext);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const cleanedText = searchText.trim();
    const debounceInputTimeoutId = setTimeout(() => {
      if (cleanedText === '') {
        dispatch({
          type: AppContextActions.changeSearchString,
          payload: { searchString: null, highlightArray: null, highlightArrayTech: null },
        });
      } else {
        let highlightArray = null;
        let highlightArrayTech = null;
        if (skill) {
          if (state.characterData !== null) {
            highlightArray = searchDataForKeyword(state.characterData, searchText);
          }
        } else {
          if (state.techData !== null) {
            highlightArrayTech = searchTechDataForKeyword(state.techData, searchText);
          }
        }
        if (highlightArray !== null || highlightArrayTech !== null) {
          dispatch({
            type: AppContextActions.changeSearchString,
            payload: {
              searchString: cleanedText,
              highlightArray,
              highlightArrayTech,
            },
          });
        }
      }
    }, 500);
    return () => clearTimeout(debounceInputTimeoutId);
  }, [searchText]);

  let divClassName = 'p-2 bg-slate-500 rounded-xl';

  if (skill) {
    divClassName += ' absolute top-2 right-2 z-20';
  } else {
    divClassName += ' my-auto mr-4';
  }

  return (
    <div className={divClassName}>
      <input
        type="text"
        placeholder="Search"
        value={searchText}
        onChange={(event) => {
          setSearchText(event.target.value);
        }}
        className="px-1.5 w-32 text-xl text-center rounded focus:outline-none placeholder-opacity-60 placeholder-black bg-gray-200"
      ></input>
    </div>
  );
};

export default SearchBox;
