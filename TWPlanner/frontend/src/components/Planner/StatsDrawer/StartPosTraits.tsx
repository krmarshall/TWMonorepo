import { useContext, useEffect } from 'react';
import { AppContext, AppContextActions } from '../../../contexts/AppContext.tsx';
import { StartPosTraitInterface } from '../../../@types/CharacterInterfaceRef.ts';
import { useParams } from 'react-router-dom';
import { splitCharacterKey } from '../../../utils/urlFunctions.ts';
import TooltipWrapper from '../../TooltipWrapper.tsx';
import BaseCell from '../BaseCell.tsx';

const StartPosTraits = () => {
  const { state, dispatch } = useContext(AppContext);
  const { characterData, selectedStartPosTrait } = state;
  const { character } = useParams();

  const { startPos } = splitCharacterKey(character as string);

  const skill = characterData?.startPosTraits?.[selectedStartPosTrait]?.trait;

  useEffect(() => {
    const { startPos } = splitCharacterKey(character as string);
    if (startPos !== '') {
      dispatch({ type: AppContextActions.changeSelectedStartPosTrait, payload: { selectedStartPosTrait: startPos } });
    }
  }, [character]);

  return (
    <div className="text-center">
      <div className="flex flex-row flex-nowrap text-3xl place-content-center">
        <h3 className="text-gray-50">Unique Variants&nbsp;</h3>
        <TooltipWrapper
          tooltip={
            <span className="text-center flex flex-row">
              <div className="w-[50%] h-fit p-2 rounded border border-gray-400 shadow-lg text-gray-50 text-xl bg-gray-600">
                <p>
                  Each campaign has unique named lords and heroes that start with special traits defined in start_pos
                  tables. Also includes certain legendary lords traits that are given via start_pos.
                </p>
                <p>Format: Name | Faction | Campaign</p>
              </div>
            </span>
          }
        >
          <p className="text-gray-400 underline decoration-dashed underline-offset-2">?</p>
        </TooltipWrapper>
      </div>
      <select
        className="w-full my-1 h-8 px-1 bg-gray-500 rounded drop-shadow-lg font-[CaslonAntique] text-xl text-gray-50"
        onChange={(event) => {
          dispatch({
            type: AppContextActions.changeSelectedStartPosTrait,
            payload: { selectedStartPosTrait: event.target.value },
          });
        }}
        defaultValue={startPos}
      >
        <option key="" value="" className="text-base font-[CaslonAntique]">
          Generic
        </option>
        {Object.entries(characterData?.startPosTraits as StartPosTraitInterface).map((entry) => {
          const id = entry[0];
          const trait = entry[1];
          return (
            <option key={id} value={id} className="text-base font-[CaslonAntique]">
              {trait.name} | {trait.faction} | {trait.campaign}
            </option>
          );
        })}
      </select>
      {selectedStartPosTrait !== '' && (
        <div className="w-fit mx-auto">
          <BaseCell
            skill={skill}
            srcList={[`/imgs/${skill?.image_path}.webp`, `/imgs/vanilla3/campaign_ui/skills/0_placeholder_skill.webp`]}
          />
        </div>
      )}

      <hr className="grow mt-3.5 mb-2 opacity-50" />
    </div>
  );
};

export default StartPosTraits;
