import { AbilityInterface, AttributeInterface, PhaseInterface } from '../../../@types/CharacterInterfaceRef.ts';
import useBulkMediaQueries from '../../../hooks/useBulkMediaQueries.tsx';
import AttributeTooltip from './AttributeTooltip.tsx';
import SkillAbilityTooltip from './SkillAbilityTooltip.tsx';
import SkillPhase from './SubToolTips/SkillPhase.tsx';

interface PropInterface {
  relatedAbilities: Array<AbilityInterface>;
  relatedPhases: Array<PhaseInterface>;
  relatedAttributes: Array<AttributeInterface>;
  ctrCounter: number;
}

const TooltipAbilityMap = ({ relatedAbilities, relatedPhases, relatedAttributes, ctrCounter }: PropInterface) => {
  const { isMobile } = useBulkMediaQueries();
  const layoutType = isMobile ? '' : 'w-fit h-fit max-w-[30vw] ml-2';
  return (
    <div className={layoutType + ' flex flex-col gap-2'}>
      {relatedAbilities.map((ability, index) => {
        if (index !== ctrCounter) {
          return;
        }
        return <SkillAbilityTooltip key={index} ability={ability} />;
      })}
      {relatedPhases.map((phase, index) => {
        return <SkillPhase key={index} phase={phase} index={index} header={true} random={false} />;
      })}
      {relatedAttributes.map((attribute) => {
        return <AttributeTooltip key={attribute.key} attribute={attribute} />;
      })}
    </div>
  );
};

export default TooltipAbilityMap;
