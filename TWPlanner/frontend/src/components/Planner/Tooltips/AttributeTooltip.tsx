import { useContext } from 'react';
import { AttributeInterface } from '../../../@types/CharacterInterfaceRef.ts';
import { AppContext } from '../../../contexts/AppContext.tsx';
import DOMPurify from 'dompurify';
import { replaceKeepCaps } from '../../../utils/sharedFunctions.ts';
import useBulkMediaQueries from '../../../hooks/useBulkMediaQueries.tsx';

interface PropInterface {
  attribute: AttributeInterface;
}

const AttributeTooltip = ({ attribute }: PropInterface) => {
  const { state } = useContext(AppContext);
  const { isMobile } = useBulkMediaQueries();
  const { searchString } = state;

  const layoutContext = isMobile ? 'w-full max-h-full my-auto' : 'w-fit max-w-[24rem]';
  return (
    <div className={layoutContext + ' rounded-lg border border-gray-400 p-2 shadow-lg bg-gray-600 text-gray-50'}>
      <div className="flex flex-row flex-nowrap">
        <img
          src={`/imgs/${attribute.icon}.webp`}
          alt={`${attribute.key} icon`}
          width="24"
          height="24"
          className="w-8 h-8 my-auto mx-1"
        />
        <h5
          className="text-2xl ml-1"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(replaceKeepCaps(attribute.description, searchString)),
          }}
        ></h5>
      </div>
      <p
        className="text-lg text-left whitespace-pre-wrap"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(replaceKeepCaps(attribute.bullet_text, searchString)),
        }}
      ></p>
    </div>
  );
};

export default AttributeTooltip;
