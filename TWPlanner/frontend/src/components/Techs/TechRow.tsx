import { TechNodeInterface } from '../../@types/TechInterface';
import TechCell from './TechCell';

interface PropInterface {
  techRow: Array<TechNodeInterface> | null;
  yIndex: number;
}

const TechRow = ({ techRow, yIndex }: PropInterface) => {
  if ((techRow === null || techRow.length === 0) && [0, 1].includes(yIndex)) {
    return <tr className="h-0"></tr>;
  }
  return (
    <tr className="flex flex-row">
      {techRow === null || techRow.length === 0 ? (
        <td className="h-4"></td>
      ) : (
        techRow.map((tech, xIndex) => {
          if (tech === null) {
            return <td key={xIndex} className="w-[15.563rem] mx-0.5"></td>;
            // @ts-expect-error ts(2339)
          } else if (tech.bgFiller) {
            return (
              <td
                key={xIndex}
                className={'w-[15.563rem] ' + uiGroupBorderClass(tech.ui_group_position)}
                style={{ backgroundColor: `#${tech.ui_group_colour}50` }}
              ></td>
            );
          }
          return (
            <TechCell
              key={tech?.key}
              tech={tech}
              xIndex={xIndex}
              yIndex={yIndex}
              borderClass={uiGroupBorderClass(tech.ui_group_position)}
            />
          );
        })
      )}
    </tr>
  );
};

const uiGroupBorderClass = (ui_group_position: string | undefined) => {
  if (ui_group_position === undefined) {
    return ' mx-0.5 ';
  }
  let returnString = ' ';
  if (ui_group_position.includes('top') && ui_group_position.includes('left')) {
    returnString += 'rounded-tl ml-1 ';
  } else if (ui_group_position.includes('top') && ui_group_position.includes('right')) {
    returnString += 'rounded-tr mr-1 ';
  } else if (ui_group_position.includes('bottom') && ui_group_position.includes('left')) {
    returnString += 'rounded-bl ml-1 ';
  } else if (ui_group_position.includes('bottom') && ui_group_position.includes('right')) {
    returnString += 'rounded-br mr-1 ';
  } else if (ui_group_position.includes('left')) {
    returnString += ' ml-1 ';
  } else if (ui_group_position.includes('right')) {
    returnString += ' mr-1 ';
  } else {
    returnString += ' ';
  }
  return returnString;
};

export default TechRow;
