import { useContext } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import api from '../../api/api.ts';
import { AppContext, AppContextActions } from '../../contexts/AppContext.tsx';
import TechSelectorCell from './TechSelectorCell.tsx';
import techGameData from '../../data/techGameData.ts';

const TechSelector = () => {
  const { state, dispatch } = useContext(AppContext);
  const { selectedModTech } = state;
  const navigate = useNavigate();

  const gameTechKeys = Object.keys(techGameData[selectedModTech].techTrees);

  const handleTechSelect = (event: React.MouseEvent, techKey: string) => {
    if (event.button === 0 && !event.ctrlKey && !event.shiftKey) {
      event.preventDefault();

      const apiPromise = api.getTechTree(selectedModTech, techKey).then((response) => {
        dispatch({ type: AppContextActions.changeTechData, payload: { techData: response } });
        navigate(`/tech/${selectedModTech}/${techKey}`);
      });
      toast.promise(
        apiPromise,
        {
          loading: 'Loading',
          success: 'Success',
          error: (err) => `${err}`,
        },
        { loading: { duration: 5000 } },
      );
    }
  };

  return (
    <div className="justify-self-center px-2 w-full">
      <div className="flex flex-row place-content-center mt-2">
        <hr className="grow mt-5 opacity-50 border-gray-200" />
        <h1 className="w-max text-center text-4xl mx-2 text-gray-200 text-shadow">Tech Trees</h1>
        <hr className="grow mt-5 opacity-50 border-gray-200" />
      </div>
      <ul className="flex flex-row flex-wrap justify-center">
        {gameTechKeys.map((techKey) => {
          return (
            <AnimatePresence key={techKey}>
              <TechSelectorCell techKey={techKey} handleTechSelect={handleTechSelect} />
            </AnimatePresence>
          );
        })}
      </ul>
    </div>
  );
};

export default TechSelector;
