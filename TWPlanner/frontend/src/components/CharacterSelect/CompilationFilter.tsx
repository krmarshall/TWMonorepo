import { useContext } from 'react';
import { AppContext, AppContextActions } from '../../contexts/AppContext';
import { CompilationGroupsInterface } from '../../@types/CompilationGroupsInterfaceRef';

interface PropInterface {
  compGroups: CompilationGroupsInterface;
}

const CompilationFilter = ({ compGroups }: PropInterface) => {
  const { state, dispatch } = useContext(AppContext);
  const { selectedCompGroups } = state;
  const groupKeys = compGroups.mods;

  const filterButtonOnClick = (groupKey: string) => {
    const groupKeyIndex = selectedCompGroups.findIndex((compGroup) => compGroup === groupKey);
    let newSelectedCompGroups;
    // groupKey is not in selectedCompGroups
    if (groupKeyIndex === -1) {
      newSelectedCompGroups = [...selectedCompGroups, groupKey];
      // groupKey is in selectedCompGroups
    } else {
      newSelectedCompGroups = selectedCompGroups.filter((compGroup, index) => index !== groupKeyIndex);
    }
    dispatch({
      type: AppContextActions.changeSelectedCompGroups,
      payload: { selectedCompGroups: newSelectedCompGroups },
    });
  };

  const noneOnClick = () => {
    dispatch({
      type: AppContextActions.changeSelectedCompGroups,
      payload: { selectedCompGroups: [] },
    });
  };
  const allOnClick = () => {
    dispatch({
      type: AppContextActions.changeSelectedCompGroups,
      payload: { selectedCompGroups: groupKeys },
    });
  };
  const buttonClass = 'text-center text-xl text-gray-200 text-shadow rounded mx-1.5 py-1 px-2 my-0.5 shadow-md shadow-gray-800 hover-scale';

  return (
    <div className="justify-self-center px-2 w-full">
      <div className="flex flex-row place-content-center mx-auto">
        <hr className="grow mt-[1.25rem] opacity-50" />
        <h1 className="w-max text-center text-4xl mx-2 text-gray-200 text-shadow">Filter</h1>
        <hr className="grow mt-[1.25rem] opacity-50" />
      </div>

      <div className="flex flex-row flex-wrap justify-center">
        <button key="All" className={buttonClass + ' bg-gray-500'} onClick={allOnClick}>
          All
        </button>
        <button key="None" className={buttonClass + ' bg-gray-500'} onClick={noneOnClick}>
          None
        </button>
        {groupKeys.map((groupKey) => {
          let thisButtonClass = buttonClass;
          if (selectedCompGroups.includes(groupKey)) {
            thisButtonClass += ' bg-slate-500 opacity-100 saturate-[125%]';
          } else {
            thisButtonClass += ' bg-slate-500 opacity-50 hover:opacity-80';
          }
          return (
            <button
              key={groupKey}
              className={thisButtonClass}
              onClick={() => {
                filterButtonOnClick(groupKey);
              }}
            >
              {groupKey}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CompilationFilter;
