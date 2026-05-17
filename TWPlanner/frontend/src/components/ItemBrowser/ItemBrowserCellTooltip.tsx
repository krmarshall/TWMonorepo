import { useEffect, useState } from 'react';
import { EffectInterface } from '../../@types/CharacterInterfaceRef.ts';
import { getRelatedAbilities, getRelatedAttributes, getRelatedContactPhases } from '../../utils/sharedFunctions.ts';
import TooltipAbilityMap from '../Planner/Tooltips/TooltipAbilityMap.tsx';
import TooltipAbilityCycler from '../Planner/Tooltips/TooltipAbiltyCycler.tsx';

interface PropsInterface {
  effects: Array<EffectInterface>;
  setTooltipScrollable?: React.Dispatch<React.SetStateAction<boolean>>;
  tooltipRef?: React.RefObject<HTMLDivElement>;
}

const ItemBrowserCellTooltip = ({ effects, setTooltipScrollable, tooltipRef }: PropsInterface) => {
  const [ctrCounter, setCtrCounter] = useState(0);

  useEffect(() => {
    const ctrKeyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Control') {
        if (ctrCounter + 1 < relatedAbilities.length) {
          setCtrCounter(ctrCounter + 1);
        } else {
          setCtrCounter(0);
        }
      }
    };

    document.addEventListener('keydown', ctrKeyDownHandler);

    return () => {
      document.removeEventListener('keydown', ctrKeyDownHandler);
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

  const relatedAbilities = getRelatedAbilities(effects);
  const relatedPhases = getRelatedContactPhases(relatedAbilities[ctrCounter], effects);
  const relatedAttributes = getRelatedAttributes(relatedAbilities[ctrCounter], effects);
  const showTooltip = relatedAbilities.length > 0 || relatedPhases.length > 0 || relatedAttributes.length > 0;

  const hasCycler = relatedAbilities.length > 1 ? 'pb-0 ' : '';
  return (
    <div>
      {showTooltip && (
        <div
          ref={tooltipRef}
          className={
            hasCycler +
            'flex flex-col gap-2 max-h-[98vh] bg-gray-800 p-2 pl-0 rounded-md overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-700'
          }
        >
          <TooltipAbilityMap
            relatedAbilities={relatedAbilities}
            relatedPhases={relatedPhases}
            relatedAttributes={relatedAttributes}
            ctrCounter={ctrCounter}
          />
          {relatedAbilities.length > 1 && (
            <TooltipAbilityCycler
              relatedAbilitiesLength={relatedAbilities.length}
              ctrCounter={ctrCounter}
              setCtrCounter={setCtrCounter}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ItemBrowserCellTooltip;
