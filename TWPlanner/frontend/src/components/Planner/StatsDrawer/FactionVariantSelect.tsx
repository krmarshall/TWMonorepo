import { useContext, useEffect } from 'react';
import { AltFactionNodeSetsInterface, CharacterInterface } from '../../../@types/CharacterInterfaceRef.ts';
import { AppContext, AppContextActions } from '../../../contexts/AppContext.tsx';
import { useParams } from 'react-router-dom';
import { addFactionVariantNodes, createEmptyCharacterBuild } from '../../../utils/sharedFunctions.ts';
import { splitCharacterKey } from '../../../utils/urlFunctions.ts';

const FactionVariantSelect = () => {
  const { state, dispatch } = useContext(AppContext);
  const { characterData, cleanCharacterData } = state;
  const { mod, faction, character } = useParams();

  const { cleanCharacter, cleanFaction } = splitCharacterKey(character as string);

  useEffect(() => {
    if (characterData?.altFactionNodeSets !== undefined && cleanCharacterData === null) {
      dispatch({
        type: AppContextActions.changeCleanCharacterData,
        payload: { cleanCharacterData: JSON.parse(JSON.stringify(characterData)) },
      });
    }
  }, []);

  const altFactionChangeHandler = (factionKey: string) => {
    if (characterData === null) {
      return;
    }

    let localCharacterData;
    if (factionKey !== '' && characterData.altFactionNodeSets?.[factionKey] !== undefined) {
      localCharacterData = addFactionVariantNodes(
        characterData.altFactionNodeSets[factionKey].nodes,
        cleanCharacterData as CharacterInterface,
      );
    } else {
      localCharacterData = cleanCharacterData;
    }

    const emptyCleanCharacterBuild = createEmptyCharacterBuild(
      localCharacterData as CharacterInterface,
      mod as string,
      faction as string,
      `${cleanCharacter}${factionKey !== '' ? `$${factionKey}` : ''}`,
    );
    dispatch({
      type: AppContextActions.changeSelectedAltFactionNodeSet,
      payload: {
        selectedAltFactionNodeSet: factionKey,
        characterBuild: emptyCleanCharacterBuild,
        characterData: localCharacterData,
      },
    });
  };

  return (
    <div className="text-center">
      <h3 className="text-3xl text-gray-50">Faction Variants</h3>
      <select
        className="max-w-[12rem] my-auto h-8 px-1 bg-gray-500 rounded drop-shadow-lg font-CaslonAntique text-xl text-gray-50"
        onChange={(event) => {
          altFactionChangeHandler(event.target.value);
        }}
        defaultValue={cleanFaction}
      >
        <option key="" value="" className="text-base font-CaslonAntique">
          Generic Faction
        </option>
        {Object.entries(characterData?.altFactionNodeSets as AltFactionNodeSetsInterface).map((entry) => {
          const factionKey = entry[0];
          const factionData = entry[1];
          return (
            <option key={factionKey} value={factionKey} className="text-base font-CaslonAntique">
              {factionData.factionName}
            </option>
          );
        })}
      </select>

      <hr className="grow mt-3.5 mb-2 opacity-50" />
    </div>
  );
};

export default FactionVariantSelect;
