import { useContext } from 'react';
import { AppContext } from '../../../contexts/AppContext.tsx';
import BaseCell from '../BaseCell.tsx';

const BackgroundSkills = () => {
  const { state } = useContext(AppContext);
  const { characterData, highlightArray } = state;
  return (
    <div className="flex flex-col mx-1 mt-1.5 min-w-58 max-w-140 shadow-lg border border-gray-500 rounded">
      <h2 className="text-center text-3xl mt-1 text-gray-200 text-shadow">Background Skills</h2>
      <div className="flex flex-row flex-wrap w-full h-full pb-1 place-items-center overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600">
        {characterData?.backgroundSkills?.map((bgSkill, index) => {
          return (
            <div
              key={bgSkill.character_skill_key}
              className={highlightArray?.backgroundSkills?.[index] ? 'rounded searchOutline m-auto' : 'm-auto'}
            >
              <BaseCell
                skill={bgSkill}
                srcList={[
                  `/imgs/${bgSkill.image_path}.webp`,
                  `/imgs/vanilla3/campaign_ui/skills/0_placeholder_skill.webp`,
                ]}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BackgroundSkills;
