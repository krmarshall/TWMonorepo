import useBulkMediaQueries from '../../../hooks/useBulkMediaQueries.tsx';
import ctrlImg from '../../../imgs/other/ctrlKey.webp';

interface PropInterface {
  ctrCounter: number;
  setCtrCounter: React.Dispatch<React.SetStateAction<number>>;
  relatedAbilitiesLength: number;
}

const TooltipAbilityCycler = ({ ctrCounter, setCtrCounter, relatedAbilitiesLength }: PropInterface) => {
  const { isMobile } = useBulkMediaQueries();
  return (
    <>
      {!isMobile && (
        <div className="h-fit w-fit mb-2 mx-auto p-2 rounded border border-gray-400 shadow-lg text-xl text-gray-50 bg-gray-600">
          <p>
            Showing ability {ctrCounter + 1}/{relatedAbilitiesLength}
          </p>
          <p>
            Press <img src={ctrlImg} alt="ctrl key" className="w-8 h-8 inline m-auto" width="80" height="80" /> to cycle
            the displayed ability
          </p>
        </div>
      )}
      {isMobile && (
        <div className="h-fit w-full mb-2 mx-auto p-2 rounded border border-gray-400 shadow-lg text-xl text-gray-50 bg-gray-600">
          <p>
            Showing ability {ctrCounter + 1}/{relatedAbilitiesLength}
          </p>
          <button
            className="button bg-gray-500 mt-1"
            onClick={() => {
              if (ctrCounter + 1 < relatedAbilitiesLength) {
                setCtrCounter(ctrCounter + 1);
              } else {
                setCtrCounter(0);
              }
            }}
          >
            Next Ability
          </button>
        </div>
      )}
    </>
  );
};

export default TooltipAbilityCycler;
