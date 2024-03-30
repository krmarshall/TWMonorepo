import { Fragment } from 'react';
import { SkillInterface } from '../../types/interfaces/CharacterInterface';
import SkillCell from './SkillCell';

interface SkillRowPropsInterface {
  skillRow: Array<SkillInterface>;
  yIndex: number;
}

const SkillRow = ({ skillRow, yIndex }: SkillRowPropsInterface) => {
  return (
    <tr className="flex flex-row mb-0.5">
      {skillRow.length === 0 ? (
        <td className="h-16"></td>
      ) : (
        skillRow.map((skill, xIndex) => {
          const nextSkill = skillRow[xIndex + 1];
          const prevSkill = skillRow[xIndex - 1];
          let boxedType = 'none';
          if (skill.boxed && !prevSkill?.boxed && !nextSkill?.boxed) {
            boxedType = 'none';
          } else if (skill.boxed && prevSkill?.boxed && prevSkill.right_arrow) {
            boxedType = 'start';
          } else if (skill.boxed && nextSkill?.boxed && skill.right_arrow) {
            boxedType = 'end';
          } else if (skill.boxed && !prevSkill?.boxed) {
            boxedType = 'start';
          } else if (skill.boxed && prevSkill?.boxed && nextSkill?.boxed) {
            boxedType = 'center';
          } else if (skill.boxed && !nextSkill?.boxed) {
            boxedType = 'end';
          }
          return (
            <Fragment key={skill.key}>
              <SkillCell
                skillKey={skill.character_skill_key}
                skill={skill}
                yIndex={yIndex}
                xIndex={xIndex}
                boxedType={boxedType}
              />
              {skill?.right_arrow && (
                <td className="w-10 flex flex-col justify-center">
                  <p className="text-center text-4xl text-gray-200">→</p>
                </td>
              )}
            </Fragment>
          );
        })
      )}
    </tr>
  );
};

export default SkillRow;
