import { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { AppContext, AppContextActions } from '../../contexts/AppContext.tsx';
import gameData from '../../data/gameData.ts';
import TooltipWrapper from '../TooltipWrapper.tsx';
import ReactImage from '../ReactImage.tsx';
import placeholderImg from '../../imgs/other/0placeholder.webp';

interface PropInterface {
  containerWidth: string;
}

const ModSelector = ({ containerWidth }: PropInterface) => {
  const { state, dispatch } = useContext(AppContext);
  const { selectedMod } = state;

  const gameKeys = Object.keys(gameData);

  return (
    <div
      className={
        'justify-self-center px-2 max-h-[33rem] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600 ' +
        containerWidth
      }
    >
      <div className="flex flex-row place-content-center">
        <hr className="grow mt-[1.25rem] opacity-50" />
        <h1 className="w-max text-center text-4xl mx-2 text-gray-200 text-shadow">Mods</h1>
        <hr className="grow mt-[1.25rem] opacity-50" />
      </div>
      <ul className="flex flex-row flex-wrap justify-center py-1">
        <TransitionGroup component={null}>
          {gameKeys.map((gameKey) => {
            // Would like to break this out as its own component, but transition group get really weird about it
            const game = gameData[gameKey as keyof typeof gameData];
            let liClassName =
              'flex flex-col justify-around m-2 mt-1 px-1.5 py-1 border border-gray-500 shadow-lg shadow-gray-800/60 rounded-lg hover-scale';

            if (gameKey === selectedMod) {
              liClassName += ' bg-gray-600 hover:bg-gray-500/80 scale-105';
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
              <CSSTransition
                key={gameKey}
                classNames={{
                  enterActive: 'animate__animated animate__faster animate__zoomIn',
                  exitActive: 'hidden',
                }}
                timeout={500}
              >
                <li
                  className={liClassName}
                  key={gameKey}
                  onClick={() => {
                    dispatch({ type: AppContextActions.changeMod, payload: { selectedMod: gameKey } });
                  }}
                >
                  <h2 className="text-center text-gray-200 text-2xl text-shadow mb-1">{game.text}</h2>
                  <ReactImage
                    srcList={[game.image, placeholderImg]}
                    alt={`${game.text} icon`}
                    className="m-auto w-auto max-w-[9rem] max-h-[6rem] drop-shadow-[0.1rem_0.1rem_0.5rem_rgba(0,0,0,0.7)]"
                    h="128"
                    w="128"
                  />
                  <h3 className="text-center text-gray-400 text-lg text-shadow mt-2">{game.updated}</h3>
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
                    <h3 className="w-fit mx-auto text-center text-gray-300 text-lg text-shadow mb-1 underline decoration-dashed underline-offset-2">
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
                </li>
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </ul>
    </div>
  );
};

export default ModSelector;
