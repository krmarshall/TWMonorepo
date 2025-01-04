import DOMPurify from 'dompurify';
import { StatEffectInterface } from '../../../@types/CharacterInterfaceRef.ts';
import { replaceKeepCaps } from '../../../utils/sharedFunctions.ts';
import ReactImage from '../../ReactImage.tsx';
import { useContext } from 'react';
import { AppContext } from '../../../contexts/AppContext.tsx';

interface PropInterface {
  effect: StatEffectInterface;
}

const SkillPhaseEffect = ({ effect }: PropInterface) => {
  const { state } = useContext(AppContext);
  const { searchString } = state;
  return (
    <div className="flex flex-row flex-nowrap">
      <ReactImage
        srcList={[`/imgs/${effect?.icon}.webp`, `/imgs/vanilla3/campaign_ui/skills/0_placeholder_skill.webp`]}
        className="w-6 h-6"
        alt={`${effect.stat} icon`}
        w="24"
        h="24"
      />

      <p
        className="text-lg whitespace-pre-wrap ml-6"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(replaceKeepCaps(effect.description, searchString)),
        }}
      ></p>
    </div>
  );
};

export default SkillPhaseEffect;
