import { useContext, useEffect, useRef } from 'react';
import { Xwrapper } from 'react-xarrows';
import { AppContext } from '../../contexts/AppContext.tsx';
import TechArrows from './TechArrows.tsx';
import TechRow from './TechRow.tsx';

const TechTable = () => {
  const { state } = useContext(AppContext);
  const { techData } = state;
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
      className="relative overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600 rounded-xl"
      id="horScrollContainer"
      onWheel={(event) => {
        horizontalScroll(event);
      }}
    >
      <Xwrapper>
        <table className="table-fixed">
          <thead></thead>
          <tbody className="flex flex-col flex-nowrap p-4">
            {techData?.tree.map((techRow, index) => {
              // @ts-expect-error ts(2322)
              return <TechRow key={index} techRow={techRow} yIndex={index} />;
            })}
          </tbody>
        </table>
        <TechArrows />
      </Xwrapper>
    </div>
  );
};

export default TechTable;
