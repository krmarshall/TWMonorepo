import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext.tsx';
import techGameData from '../../data/techGameData.ts';
import TooltipWrapper from '../TooltipWrapper.tsx';

import resetIcon from '../../imgs/other/icon_reset.webp';
import backIcon from '../../imgs/other/icon_home.webp';
import scrollWheel from '../../imgs/other/help_page_middle_mouse.webp';
import shift from '../../imgs/other/help_page_camera_speed_controls.webp';
import SearchBox from '../Planner/SearchBox.tsx';

const TopBarTech = () => {
  const { state } = useContext(AppContext);
  const { selectedModTech } = state;
  const { techTree } = useParams();

  const navigate = useNavigate();

  return (
    <div className="h-18 flex flex-row place-content-between">
      <div className="w-[40vw] flex place-content-start">
        <button
          className="flex flex-row place-content-center my-auto px-3 bg-gray-500 hover:bg-gray-400/80 rounded-xl drop-shadow-lg hover-scale"
          onClick={() => navigate('/techHome')}
        >
          <img src={backIcon} alt="Back" width="45" height="45" className="my-auto w-8 h-8" draggable={false} />
          <p className="text-center text-gray-200 text-2xl px-0.5 ml-1">Home</p>
        </button>
        <TooltipWrapper
          tooltip={
            <div className="h-fit p-2 rounded border border-gray-400 shadow-lg text-gray-50 text-xl bg-gray-600">
              <h5 className="text-3xl text-center">Controls</h5>
              {/* <div className="flex flex-row flex-nowrap mb-1">
                <img src={leftMouse} alt="left mouse" height="36" width="27" />
                <p className="my-auto">Select Skill</p>
              </div>
              <div className="flex flex-row flex-nowrap mb-1">
                <img src={rightMouse} alt="right mouse" height="36" width="27" />
                <p className="my-auto">Deselect Skill</p>
              </div> */}
              <div className="flex flex-row flex-nowrap mb-1">
                <img src={scrollWheel} alt="scroll wheel" height="36" width="27" />
                <p className="my-auto">Scroll Horizontally</p>
              </div>
              <div className="flex flex-row flex-nowrap">
                <img src={shift} alt="shift" height="32" width="86" />
                <p className="my-auto">+</p>
                <img src={scrollWheel} alt="scroll wheel" height="36" width="27" />
                <p className="my-auto">Scroll Vertically</p>
              </div>
            </div>
          }
        >
          <div className="my-auto ml-4 px-3 text-2xl text-gray-50 rounded-full bg-gray-500 hover:bg-gray-400/80 drop-shadow-lg hover-scale">
            ?
          </div>
        </TooltipWrapper>
        <p className="text-gray-200 text-2xl text-center my-auto ml-4">
          Selected Game: {techGameData[selectedModTech]?.text}
        </p>
      </div>

      <h1 className="z-10 m-2 text-center text-4xl mx-auto text-gray-200 text-shadow-border">
        {techGameData[selectedModTech].techTrees[techTree as string].name}
      </h1>

      <div className="w-[40vw] relative flex place-content-end">
        <SearchBox skill={false} />
      </div>
    </div>
  );
};

export default TopBarTech;
