import { useContext } from 'react';
import TooltipWrapper from '../../TooltipWrapper.tsx';
import BaseCell from '../BaseCell.tsx';
import { AppContext } from '../../../contexts/AppContext.tsx';

const DefeatTraits = () => {
  const { state, dispatch } = useContext(AppContext);
  const { characterData } = state;
  const skill = characterData?.defeatTrait;
  return (
    <div className="text-center">
      <div className="flex flex-row flex-nowrap text-3xl place-content-center">
        <h3 className="text-gray-50">Defeat Trait&nbsp;</h3>
        <TooltipWrapper
          noSkillRanks={true}
          tooltip={
            <span className="text-center flex flex-row">
              <div className="w-[50%] h-fit p-2 rounded border border-gray-400 shadow-lg text-gray-50 text-xl bg-gray-600">
                <p>When this agent is defeated in a battle the opposing lord will gain this trait.</p>
              </div>
            </span>
          }
        >
          <p className="text-gray-400 underline decoration-dashed underline-offset-2">?</p>
        </TooltipWrapper>
      </div>
      <div className="w-fit mx-auto">
        <BaseCell
          skill={skill}
          srcList={[`/imgs/${skill?.image_path}.webp`, `/imgs/vanilla3/campaign_ui/skills/0_placeholder_skill.webp`]}
        />
      </div>

      <hr className="grow mt-3.5 mb-2 opacity-50 border-gray-200" />
    </div>
  );
};

export default DefeatTraits;
