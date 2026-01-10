import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import snek from '../imgs/other/snek.webp';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== '/404') {
      navigate('/404');
    }
  }, [location]);

  useEffect(() => {
    document.title = 'Total Warhammer Planner - 404';
  }, []);
  return (
    <div className="h-[88vh] bg-gray-700 w-full border border-gray-500 rounded-md px-2 py-2 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600">
      <div className="flex flex-col place-content-center mt-4 mx-auto select-text font-[Helvetica] text-gray-200">
        <h1 className="text-8xl text-center">404</h1>
        <p className="text-3xl text-center">
          The page or character you requested could not be found. Sorry for any inconvenience, please enjoy this snek
          while your here.
        </p>
        <img src={snek} className="w-xl mx-auto mt-8" alt="snek" width="4032" height="3024" />
      </div>
    </div>
  );
};

export default NotFound;
