import { PropsWithChildren, ReactElement } from 'react';
import { Svg, Rect } from 'react-svg-path';
import TooltipWrapper from '../../TooltipWrapper.tsx';

interface StatLinePropInterface {
  statName: string;
  statValue: number;
  imgPath: string;
  tooltip?: ReactElement;
  advanced?: boolean;
}

const UnitStatLine = ({
  statName,
  imgPath,
  statValue,
  tooltip,
  advanced,
  children,
}: PropsWithChildren<StatLinePropInterface>) => {
  const statScalar = BarScaleLookup[statName] ?? 2;
  const barWidth = 50;
  const scaledStatValue = statValue / statScalar;
  const ox = (scaledStatValue - barWidth) / 2 + 1;

  let containerClass = 'flex flex-row flex-nowrap';
  if (advanced === false) {
    containerClass += ' h-0 opacity-0';
  } else {
    containerClass += ' h-7 opacity-100';
  }
  return (
    <div className={containerClass} style={{ transition: 'all 0.3s' }}>
      <p className="w-[45%]">{statName}</p>
      <div className="w-[55%] flex flex-row flex-nowrap">
        <img
          src={`/imgs/vanilla3/skins/default/${imgPath}.webp`}
          alt={statName}
          width="22"
          height="22"
          className="my-auto mx-1"
        />
        {tooltip !== undefined ? (
          <div className="my-auto w-8">
            <TooltipWrapper tooltip={tooltip}>
              <p className="w-8 underline decoration-dashed decoration-gray-300">{statValue}</p>
            </TooltipWrapper>
          </div>
        ) : (
          <p className="w-8">{statValue}</p>
        )}

        <div className="my-auto mx-2">
          <Svg width={barWidth} height={10}>
            <Rect width={barWidth} height={10} stroke="#000000" fill="#00000000"></Rect>
            <Rect width={scaledStatValue} height={8} ox={ox} stroke="#00000000" fill="#c29221" />
          </Svg>
        </div>

        {children}
      </div>
    </div>
  );
};

export default UnitStatLine;

const BarScaleLookup: { [key: string]: number } = {
  Armour: 4,
  'Weapon Strength': 20,
  'Charge Bonus': 3,
  Speed: 3,
  'Fly Speed': 3,
  Ammunition: 1.5,
  'Alt Ammunition': 1.5,
  Mass: 160,
  Range: 4.5,
  'Splash Targets': 0.25,
  'Attack Interval': 0.25,
  'Missile Strength': 4,
  'Fire Arc': 7.5,
  'Reload Time': 0.5,
};
