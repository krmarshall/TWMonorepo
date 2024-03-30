import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import techGameData from '../../data/techGameData';
import ReactImage from '../ReactImage';
import placeholderImg from '../../imgs/other/0placeholderInvis.webp';

interface PropInterface {
  techKey: string;
  handleTechSelect: CallableFunction;
}

const TechSelectorCell = ({ techKey, handleTechSelect }: PropInterface) => {
  const { state } = useContext(AppContext);
  const { selectedModTech } = state;

  const tech = techGameData[selectedModTech].techTrees[techKey];
  return (
    <li className="m-1 rounded-lg border shadow-lg shadow-gray-800/60 border-gray-500 hover:bg-gray-600 hover-scale">
      <a
        href={`/tech/${selectedModTech}/${techKey}`}
        className="w-full h-full p-1 flex flex-col justify-around"
        onClick={(event) => handleTechSelect(event, techKey)}
        draggable={false}
      >
        <h2 className="w-32 text-center text-2xl text-shadow text-gray-200 mb-2">{tech?.name}</h2>
        <div className="flex flex-row justify-center relative">
          <ReactImage
            srcList={[tech?.image, placeholderImg]}
            className="w-24 mb-1 drop-shadow-[0.1rem_0.1rem_0.5rem_rgba(0,0,0,0.7)]"
            alt={`${tech?.name} icon`}
            w="96"
            h="96"
          />
        </div>
      </a>
    </li>
  );
};

export default TechSelectorCell;
