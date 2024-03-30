import ctrlImg from '../imgs/other/ctrlKey.webp';

interface PropInterface {
  ctrCounter: number;
  relatedAbilitiesLength: number;
}

const TooltipAbilityCycler = ({ ctrCounter, relatedAbilitiesLength }: PropInterface) => {
  return (
    <div className="h-fit w-fit m-2 mx-auto p-2 rounded border border-gray-400 shadow-lg text-xl text-gray-50 bg-gray-600">
      <p>
        Showing ability {ctrCounter + 1}/{relatedAbilitiesLength}
      </p>
      <p>
        Press <img src={ctrlImg} alt="ctrl key" className="w-8 h-8 inline m-auto" width="80" height="80" /> to cycle the
        displayed ability
      </p>
    </div>
  );
};

export default TooltipAbilityCycler;
