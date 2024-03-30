import { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { getBgUrl } from '../../utils/sharedFunctions';
import SkillRow from './SkillRow';
import SearchBox from './SearchBox';

interface PropInterface {
  faction: string | undefined;
}

const SkillTable = ({ faction }: PropInterface) => {
  const { state } = useContext(AppContext);
  const tableRef = useRef<HTMLDivElement>(null);

  const horizontalScroll = (event: React.WheelEvent) => {
    const container = document.getElementById('horScrollContainer');
    if (event.shiftKey) {
      const containerScrollPosition = container?.scrollTop ?? 0;
      container?.scrollTo({
        top: containerScrollPosition + event.deltaY,
      });
    } else {
      const containerScrollPosition = container?.scrollLeft ?? 0;
      container?.scrollTo({
        left: containerScrollPosition + event.deltaY,
      });
    }
  };

  const stopScrollEvent = (event: WheelEvent) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (tableRef.current !== null) {
      tableRef.current.addEventListener('wheel', stopScrollEvent);
    }

    return () => {
      if (tableRef.current !== null) {
        tableRef.current.removeEventListener('wheel', stopScrollEvent);
      }
    };
  }, []);

  return (
    <div
      ref={tableRef}
      className={
        'w-fit grow overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600 bg-left-top bg-local bg-no-repeat bg-cover' +
        getBgUrl(faction)
      }
      id="horScrollContainer"
      onWheel={(event) => {
        horizontalScroll(event);
      }}
    >
      <SearchBox skill={true} />
      <table className="table-fixed">
        <thead></thead>
        <tbody className="flex flex-col flex-nowrap">
          {state.characterData?.skillTree?.map((skillRow, index) => {
            return <SkillRow key={index} skillRow={skillRow} yIndex={index} />;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SkillTable;
