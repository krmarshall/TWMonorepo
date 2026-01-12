import { useContext } from 'react';
import { AppContext } from '../../../contexts/AppContext.tsx';
import ReactImage from '../../ReactImage.tsx';

interface PropInterface {
  relatedUnitCards: Array<string>;
}

const UnitCards = ({ relatedUnitCards }: PropInterface) => {
  const { state } = useContext(AppContext);
  const { selectedMod } = state;

  const unitCardsArray = Array.from(relatedUnitCards);
  return (
    <div className="max-w-fit">
      <p className="text-gray-50 text-xl text-left my-2">Units receiving bonuses from this skill:</p>
      <ul className="flex flex-wrap max-w-[26vw]">
        {unitCardsArray.map((unitCard) => (
          <ReactImage
            key={unitCard}
            srcList={[
              `/imgs/${selectedMod}/units/icons/${unitCard}.webp`,
              `/imgs/vanilla3/units/icons/${unitCard}.webp`,
            ]}
            className="m-0.5 w-10 border border-gray-400"
            alt={unitCard}
            h="130"
            w="60"
          />
        ))}
      </ul>
    </div>
  );
};

export default UnitCards;
