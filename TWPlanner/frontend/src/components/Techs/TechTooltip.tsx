import { useContext, useEffect } from 'react';
import useBulkMediaQueries from '../../hooks/useBulkMediaQueries.tsx';
import { TechNodeInterface } from '../../@types/TechInterface.ts';
import {
  getRelatedAbilities,
  getRelatedAttributes,
  getRelatedContactPhases,
  replaceKeepCaps,
} from '../../utils/sharedFunctions.ts';
import SkillEffect from '../Planner/Tooltips/SubToolTips/SkillEffect.tsx';
import TooltipAbilityCycler from '../Planner/Tooltips/TooltipAbiltyCycler.tsx';
import TooltipAbilityMap from '../Planner/Tooltips/TooltipAbilityMap.tsx';
import { AppContext } from '../../contexts/AppContext.tsx';
import DOMPurify from 'dompurify';

interface PropInterface {
  tech: TechNodeInterface | undefined;
  ctrCounter: number;
  setCtrCounter: React.Dispatch<React.SetStateAction<number>>;
  setTooltipScrollable?: React.Dispatch<React.SetStateAction<boolean>>;
  tooltipRef?: React.RefObject<HTMLSpanElement>;
}

const TechTooltip = ({ tech, ctrCounter, setCtrCounter, setTooltipScrollable, tooltipRef }: PropInterface) => {
  const { state } = useContext(AppContext);
  const { searchString } = state;
  const { isMobileWidth, isMobileHeight } = useBulkMediaQueries();

  const isMobile = isMobileWidth || isMobileHeight ? true : false;

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Control') {
        if (ctrCounter + 1 < relatedAbilities.length) {
          setCtrCounter(ctrCounter + 1);
        } else {
          setCtrCounter(0);
        }
      }
    };

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [ctrCounter]);

  useEffect(() => {
    if (setTooltipScrollable !== undefined) {
      if (tooltipRef?.current !== null && tooltipRef?.current !== undefined) {
        setTooltipScrollable(tooltipRef.current.scrollHeight > tooltipRef.current.clientHeight);
      } else {
        setTooltipScrollable(false);
      }
    }
  }, [ctrCounter]);

  const relatedAbilities = getRelatedAbilities(tech?.technology.effects);
  const relatedPhases = getRelatedContactPhases(relatedAbilities[ctrCounter], tech?.technology.effects);
  const relatedAttributes = getRelatedAttributes(relatedAbilities[ctrCounter], tech?.technology.effects);
  return (
    <span
      ref={tooltipRef}
      className="max-h-[98vh] text-center flex flex-row overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-700"
    >
      <div className="flex flex-col">
        <div className="h-fit p-2 rounded border border-gray-400 shadow-lg text-gray-50 bg-gray-600">
          <h3
            className="text-gray-50 text-2xl"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(replaceKeepCaps(tech?.technology.onscreen_name ?? '', searchString)),
            }}
          ></h3>
          {tech?.technology?.short_description?.trim() && !isMobile && (
            <h4
              className="max-w-[20vw] mx-auto text-gray-50 opacity-70 text-lg"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(replaceKeepCaps(tech?.technology.short_description, searchString)),
              }}
            ></h4>
          )}
          {tech?.technology?.required_buildings !== undefined && tech?.technology?.required_buildings?.length > 0 && (
            <p
              className="text-yellow-300 text-lg"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  replaceKeepCaps(`Requires Building: ${tech.technology.required_buildings.join(', ')}`, searchString),
                ),
              }}
            ></p>
          )}
          {/* {skill?.required_num_parents !== 0 && (
            <p className="text-yellow-300 text-lg">
              Available after spending {skill?.required_num_parents} skill points in the previous group
            </p>
          )} */}
          {/* {skill?.parent_required && (
            <p className="text-yellow-300 text-lg">Available after unlocking &quot;{parentName?.trim()}&quot;</p>
          )} */}
          <div>
            {tech?.technology?.effects?.map((techEffect, index) => {
              return <SkillEffect key={index} skillEffect={techEffect} />;
            })}
          </div>
        </div>
        {relatedAbilities.length > 1 && (
          <TooltipAbilityCycler
            ctrCounter={ctrCounter}
            setCtrCounter={setCtrCounter}
            relatedAbilitiesLength={relatedAbilities.length}
          />
        )}
      </div>

      {(relatedAbilities.length !== 0 || relatedPhases.length !== 0 || relatedAttributes.length !== 0) && (
        <TooltipAbilityMap
          relatedAbilities={relatedAbilities}
          relatedPhases={relatedPhases}
          relatedAttributes={relatedAttributes}
          ctrCounter={ctrCounter}
        />
      )}
    </span>
  );
};

export default TechTooltip;
