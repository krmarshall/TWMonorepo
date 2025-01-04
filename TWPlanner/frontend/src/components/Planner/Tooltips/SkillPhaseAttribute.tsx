import { useContext } from 'react';
import { AttributeInterface } from '../../../@types/CharacterInterfaceRef.ts';
import ReactImage from '../../ReactImage.tsx';
import { AppContext } from '../../../contexts/AppContext.tsx';
import DOMPurify from 'dompurify';
import { replaceKeepCaps } from '../../../utils/sharedFunctions.ts';

interface PropInterface {
  attribute: AttributeInterface;
  index: number;
}

const SkillPhaseAttribute = ({ attribute, index }: PropInterface) => {
  const { state } = useContext(AppContext);
  const { searchString } = state;
  return (
    <div key={index} className="flex flex-row flex-nowrap">
      <ReactImage
        srcList={[`/imgs/${attribute.icon}.webp`, `/imgs/vanilla3/campaign_ui/skills/0_placeholder_skill.webp`]}
        className="w-6 h-6"
        alt={`${attribute.key} icon`}
        w="24"
        h="24"
      />

      <p
        className="text-lg whitespace-pre-wrap ml-6"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(replaceKeepCaps(attribute.description, searchString)),
        }}
      ></p>
    </div>
  );
};

export default SkillPhaseAttribute;
