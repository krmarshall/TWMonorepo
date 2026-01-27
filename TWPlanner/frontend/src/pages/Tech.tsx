import { Fragment, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api.ts';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import FactionPortrait from '../components/Techs/FactionPortrait.tsx';
import TechTable from '../components/Techs/TechTable.tsx';
import TopBarTech from '../components/Techs/TopBarTech.tsx';
import { AppContext, AppContextActions } from '../contexts/AppContext.tsx';
import useBulkMediaQueries from '../hooks/useBulkMediaQueries.tsx';

const Tech = () => {
  const { state, dispatch } = useContext(AppContext);
  const { techData } = state;
  const { mod, techTree } = useParams();

  const navigate = useNavigate();

  const { isMobileWidth, isMobileHeight } = useBulkMediaQueries();
  const isMobile = isMobileWidth || isMobileHeight ? true : false;

  useEffect(() => {
    if (techData === null) {
      dispatch({ type: AppContextActions.changeModTech, payload: { selectedModTech: mod } });

      api
        .getTechTree(mod as string, techTree as string)
        .then((response) => {
          dispatch({ type: AppContextActions.changeTechData, payload: { techData: response } });
        })
        .catch((err) => {
          toast.error(`${err}`);
          dispatch({ type: AppContextActions.changeTechData, payload: { techData: null } });
          navigate('/404');
        });
    }
  }, [techData]);

  useEffect(() => {
    document.title = 'Total Warhammer Planner';
  }, []);
  return (
    <div className="w-full h-full mt-1 flex flex-col rounded-md p-2 overflow-y-hidden overflow-x-hidden">
      {techData === null ? (
        <LoadingSpinner loadingText="Loading Tech Tree Data..." />
      ) : (
        <Fragment>
          <TopBarTech isMobile={isMobile} />

          {!isMobile && <FactionPortrait />}

          <TechTable />
        </Fragment>
      )}
    </div>
  );
};

export default Tech;
