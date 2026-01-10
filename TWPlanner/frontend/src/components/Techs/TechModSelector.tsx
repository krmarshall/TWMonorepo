import { useContext } from 'react';
import { AppContext, AppContextActions } from '../../contexts/AppContext.tsx';
import techGameData from '../../data/techGameData.ts';
import ReactImage from '../ReactImage.tsx';
import placeholderImg from '../../imgs/other/0placeholder.webp';

const TechModSelector = () => {
  const { state, dispatch } = useContext(AppContext);
  const { selectedModTech } = state;

  const gameKeys = Object.keys(techGameData);
  return (
    <div className="justify-self-center px-2 w-full">
      <div className="flex flex-row place-content-center">
        <hr className="grow mt-5 opacity-50" />
        <h1 className="w-max text-center text-4xl mx-2 text-gray-200 text-shadow">Mods</h1>
        <hr className="grow mt-5 opacity-50" />
      </div>
      <ul className="flex flex-row flex-wrap justify-center py-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600">
        {gameKeys.map((gameKey) => {
          const game = techGameData[gameKey as keyof typeof techGameData];

          let liClassName =
            'flex flex-col justify-around m-2 mt-1 p-1.5 border border-gray-500 shadow-lg shadow-gray-800/60 rounded-lg hover-scale';

          if (gameKey === selectedModTech) {
            liClassName += ' bg-gray-600 hover:bg-gray-500/80 scale-105';
          } else {
            liClassName += ' hover:bg-gray-600';
          }
          return (
            <li
              key={gameKey}
              className={liClassName}
              onClick={() => {
                dispatch({ type: AppContextActions.changeModTech, payload: { selectedModTech: gameKey } });
              }}
            >
              <h2 className="text-center text-gray-200 text-2xl text-shadow mb-1">{game.text}</h2>
              <ReactImage
                srcList={[game.image, placeholderImg]}
                alt={`${game.text} icon`}
                className="m-auto w-auto max-w-36 max-h-24 drop-shadow-[0.1rem_0.1rem_0.5rem_rgba(0,0,0,0.7)]"
                h="128"
                w="128"
              />
              <h3 className="text-center text-gray-400 text-lg text-shadow mt-2">{game.updated}</h3>
              <h3 className="w-fit mx-auto text-center text-gray-300 text-lg text-shadow mb-1">{game.category}</h3>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TechModSelector;
