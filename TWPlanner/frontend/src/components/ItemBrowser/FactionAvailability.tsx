import { ExtendedItemInterface } from '../../@types/ItemInterfaceRef.ts';
import TooltipWrapper from '../TooltipWrapper.tsx';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext.tsx';
import ReactImage from '../ReactImage.tsx';
import factionImages from '../../imgs/factions/factionImages.ts';

import checkmark from '../../imgs/other/icon_check_green.webp';
import cross from '../../imgs/other/icon_cross_square_red.webp';

interface PropsInterface {
  item?: ExtendedItemInterface;
}

const FactionAvailability = ({ item }: PropsInterface) => {
  const { state } = useContext(AppContext);
  const { selectedModItem } = state;

  let availableFactions,
    availableSubcultures,
    availableCultures,
    unavailableFactions,
    unavailableSubcultures,
    unavailableCultures;
  if (item?.available !== undefined) {
    if (Object.keys(item?.available?.factions).length > 0)
      availableFactions = Object.entries(item?.available?.factions);
    if (Object.keys(item?.available?.subcultures).length > 0)
      availableSubcultures = Object.entries(item?.available?.subcultures);
    if (Object.keys(item?.available?.cultures).length > 0)
      availableCultures = Object.entries(item?.available?.cultures);
  }
  if (item?.unavailable !== undefined) {
    if (Object.keys(item?.unavailable?.factions).length > 0)
      unavailableFactions = Object.entries(item?.unavailable?.factions);
    if (Object.keys(item?.unavailable?.subcultures).length > 0)
      unavailableSubcultures = Object.entries(item?.unavailable?.subcultures);
    if (Object.keys(item?.unavailable?.cultures).length > 0)
      unavailableCultures = Object.entries(item?.unavailable?.cultures);
  }

  const flagImgClassname = 'inline w-8 h-8 m-auto';
  return (
    <TooltipWrapper
      noSkillRanks={true}
      tooltip={
        <div className="flex flex-col flex-nowrap gap-1 text-xl rounded border border-gray-400 shadow-lg bg-gray-600 text-gray-50 p-2">
          {item?.subcategory !== undefined && <p className="text-left">Subcategory: {item?.subcategory}</p>}
          {item?.agent_types !== undefined && <p>Agent Types: {item?.agent_types.join(', ')}</p>}

          {item?.available?.all && (
            <p>
              Available To: <span className="text-green-400">All</span>
            </p>
          )}
          <div>
            {(availableFactions !== undefined || unavailableFactions !== undefined) && <p>Factions:</p>}
            {availableFactions !== undefined && (
              <div>
                {availableFactions.map((factionEntry) => {
                  const [factionKey, { name, img }] = factionEntry;
                  const srcList = [`/imgs/vanilla3/${img}/mon_64.webp`, `/imgs/${selectedModItem}/${img}/mon_64.webp`];
                  return (
                    <p key={factionKey} className="text-green-400">
                      <ReactImage srcList={srcList} className={flagImgClassname} w="64" h="64" alt="factionFlag" />
                      &nbsp;{name}
                    </p>
                  );
                })}
              </div>
            )}
            {unavailableFactions !== undefined && (
              <div>
                {unavailableFactions.map((factionEntry) => {
                  const [factionKey, { name, img }] = factionEntry;
                  const srcList = [`/imgs/vanilla3/${img}/mon_64.webp`, `/imgs/${selectedModItem}/${img}/mon_64.webp`];
                  return (
                    <p key={factionKey} className="text-red-400">
                      <ReactImage srcList={srcList} className={flagImgClassname} w="64" h="64" alt="factionFlag" />
                      &nbsp;{name}
                    </p>
                  );
                })}
              </div>
            )}

            {(availableSubcultures !== undefined || unavailableSubcultures !== undefined) && <p>Subcultures:</p>}
            {availableSubcultures !== undefined && (
              <div>
                {availableSubcultures.map((subcultureEntry) => {
                  const [subcultureKey, { name, img }] = subcultureEntry;
                  return (
                    <p key={subcultureKey} className="text-green-400">
                      <ReactImage
                        srcList={[factionImages[img as keyof typeof factionImages]]}
                        className={flagImgClassname}
                        w="64"
                        h="64"
                        alt="factionFlag"
                      />
                      &nbsp;{name}
                    </p>
                  );
                })}
              </div>
            )}
            {unavailableSubcultures !== undefined && (
              <div>
                {unavailableSubcultures.map((subcultureEntry) => {
                  const [subcultureKey, { name, img }] = subcultureEntry;
                  return (
                    <p key={subcultureKey} className="text-red-400">
                      <ReactImage
                        srcList={[factionImages[img as keyof typeof factionImages]]}
                        className={flagImgClassname}
                        w="64"
                        h="64"
                        alt="factionFlag"
                      />
                      &nbsp;{name}
                    </p>
                  );
                })}
              </div>
            )}

            {(availableCultures !== undefined || unavailableCultures !== undefined) && <p>Cultures:</p>}
            {availableCultures !== undefined && (
              <div>
                {availableCultures.map((cultureEntry) => {
                  const [cultureKey, { name, img }] = cultureEntry;
                  return (
                    <p key={cultureKey} className="text-green-400">
                      <ReactImage
                        srcList={[factionImages[img as keyof typeof factionImages]]}
                        className={flagImgClassname}
                        w="64"
                        h="64"
                        alt="factionFlag"
                      />
                      &nbsp;{name}
                    </p>
                  );
                })}
              </div>
            )}
            {unavailableCultures !== undefined && (
              <div>
                {unavailableCultures.map((cultureEntry) => {
                  const [cultureKey, { name, img }] = cultureEntry;
                  return (
                    <p key={cultureKey} className="text-red-400">
                      <ReactImage
                        srcList={[factionImages[img as keyof typeof factionImages]]}
                        className={flagImgClassname}
                        w="64"
                        h="64"
                        alt="factionFlag"
                      />
                      &nbsp;{name}
                    </p>
                  );
                })}
              </div>
            )}
          </div>

          {item?.randomly_dropped && (
            <p>
              Randomly Dropped:{' '}
              <img src={checkmark} className="w-6 h-6 inline" width="32" height="32" alt="checkmark" />
            </p>
          )}
        </div>
      }
    >
      <p className="text-lg w-fit mx-auto -mb-1 opacity-80 underline decoration-dashed">More...</p>
    </TooltipWrapper>
  );
};

export default FactionAvailability;
