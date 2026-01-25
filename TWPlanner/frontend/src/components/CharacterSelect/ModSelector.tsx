import { useContext } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppContext, AppContextActions } from '../../contexts/AppContext.tsx';
import gameData from '../../data/gameData.ts';
import TooltipWrapper from '../TooltipWrapper.tsx';
import ReactImage from '../ReactImage.tsx';
import placeholderImg from '../../imgs/other/0placeholder.webp';

const ModSelector = () => {
  const { state, dispatch } = useContext(AppContext);
  const { selectedMod } = state;

  const gameKeys = Object.keys(gameData);

  return (
    <div
      className={
        'w-270 bg-gray-700 border rounded-md border-gray-500 justify-self-center mt-2 p-1 max-h-112 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600 '
      }
    >
      <div className="flex flex-row place-content-center">
        <hr className="grow mt-5 opacity-50 border-gray-200" />
        <h1 className="w-max text-center text-4xl mx-2 text-gray-200 text-shadow">Mods</h1>
        <hr className="grow mt-5 opacity-50 border-gray-200" />
      </div>
      <ul className="flex flex-row flex-wrap justify-center py-1">
        {gameKeys.map((gameKey) => {
          const game = gameData[gameKey as keyof typeof gameData];
          let liClassName =
            'flex flex-col justify-around m-1 px-1.5 py-1 border border-gray-500 shadow-lg shadow-gray-800/60 rounded-lg';

          if (gameKey === selectedMod) {
            liClassName += ' bg-gray-600 hover:bg-gray-500/80';
          } else {
            liClassName += ' hover:bg-gray-600';
          }

          let categoryDesc = 'Placeholder';
          switch (game.category) {
            case 'Base': {
              categoryDesc = 'The vanilla game with no mods. All characters are displayed with few exceptions.';
              break;
            }
            case 'Overhaul': {
              categoryDesc =
                'A total overhaul mod. Both new and vanilla characters are displayed whether they have been modified or not.';
              break;
            }
            case 'Character Mod': {
              categoryDesc =
                'A mod that adds new characters. Vanilla characters have been pruned, only new characters added by the mod are displayed.';
              break;
            }
            case 'Character Mod Compilation': {
              categoryDesc =
                'A compilation of mods that add new characters. Vanilla characters have been pruned, only new characters added by the mods are displayed.';
              break;
            }
          }
          return (
            <AnimatePresence key={gameKey}>
              <motion.li
                className={liClassName}
                key={gameKey}
                onClick={() => {
                  dispatch({ type: AppContextActions.changeMod, payload: { selectedMod: gameKey } });
                }}
                layoutScroll
                layoutId={gameKey}
                initial={{ scale: 0.25 }}
                animate={{ scale: selectedMod === gameKey ? 1.05 : 1 }}
                exit={{ scale: 0.25 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.05 } }}
              >
                <h2 className="text-center text-gray-200 text-2xl text-shadow mb-1">{game.text}</h2>
                <ReactImage
                  srcList={[game.image, placeholderImg]}
                  alt={`${game.text} icon`}
                  className="m-auto w-auto max-w-36 max-h-24 drop-shadow-[0.1rem_0.1rem_0.5rem_rgba(0,0,0,0.7)]"
                  h="128"
                  w="128"
                />
                <h3 className="text-center text-gray-300 text-base text-shadow mt-2">{game.updated}</h3>
                <TooltipWrapper
                  tooltip={
                    <span className="text-center flex flex-row max-w-[25vw]">
                      <div className="h-fit p-2 rounded border border-gray-400 shadow-lg text-gray-50 text-xl bg-gray-600">
                        <h3 className="text-gray-50">{categoryDesc}</h3>
                        <div className="text-center">
                          {game.includes !== undefined && <p className="pt-3">Includes:</p>}
                          {game.includes !== undefined &&
                            game.includes?.map((includedMod) => {
                              return (
                                <p key={includedMod} className="pt-1">
                                  {includedMod}
                                </p>
                              );
                            })}
                        </div>
                      </div>
                    </span>
                  }
                >
                  <h3 className="w-fit mx-auto text-center text-gray-300 text-lg text-shadow underline decoration-dashed underline-offset-2">
                    {game.category}
                  </h3>
                </TooltipWrapper>
                {game.workshopLink !== undefined && (
                  <h3 className="text-center text-blue-400 text-lg text-shadow">
                    <a href={game.workshopLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Steam Workshop
                    </a>
                  </h3>
                )}
              </motion.li>
            </AnimatePresence>
          );
        })}
      </ul>
    </div>
  );
};

export default ModSelector;
