import { useContext } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../../contexts/AppContext.tsx';
import techGameData from '../../data/techGameData.ts';
import ReactImage from '../ReactImage.tsx';
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
    <motion.li
      className="m-1 rounded-lg border shadow-lg shadow-gray-800/60 border-gray-500 hover:bg-gray-600"
      layoutScroll
      layoutId={techKey}
      initial={{ scale: 0.25 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.25 }}
      whileHover={{ scale: 1.05, transition: { duration: 0.05 } }}
    >
      <a
        href={`/tech/${selectedModTech}/${techKey}`}
        className="w-full h-full p-1 flex flex-col justify-around"
        onClick={(event) => handleTechSelect(event, techKey)}
        draggable={false}
      >
        <h2 className="max-w-44 min-w-24 text-center text-wrap text-2xl text-shadow text-gray-200 mb-1 p-1">
          {tech?.name}
        </h2>
        <div className="flex flex-row justify-center relative">
          <ReactImage
            srcList={[tech?.image, placeholderImg]}
            className="w-20 mb-1 drop-shadow-[0.1rem_0.1rem_0.5rem_rgba(0,0,0,0.7)]"
            alt={`${tech?.name} icon`}
            w="96"
            h="96"
          />
        </div>
      </a>
    </motion.li>
  );
};

export default TechSelectorCell;
