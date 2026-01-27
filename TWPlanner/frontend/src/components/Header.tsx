import { Link } from 'react-router-dom';
import headerImg from '../imgs/header.webp';
import useBulkMediaQueries from '../hooks/useBulkMediaQueries.tsx';

const Header = () => {
  const { isSmol, shortenHeaderTitle, isMobileWidth } = useBulkMediaQueries();

  const title = shortenHeaderTitle ? 'Total Warhammer Planner' : 'TWP';

  const linksWidth = isSmol ? ' hidden' : '';

  const avoidImageMargin = isMobileWidth ? ' mr-4' : ' mr-44';

  const pageButtonClass = 'bg-slate-500 rounded-2xl py-1 px-5 my-auto shadow-md shadow-gray-900 hover-scale';
  const buttonClass = 'bg-slate-500 rounded-2xl py-1 px-5 my-auto shadow-md shadow-gray-900 hover-scale';

  return (
    <div className="bg-gray-900 flex flex-row flex-nowrap justify-between h-16 px-4 border-b border-gray-500">
      <div className="w-1/3 flex flex-row flex-nowrap justify-start">
        <Link to={'/'} className="text-slate-100 text-4xl flex flex-row flex-nowrap">
          <img
            src={headerImg}
            alt="header diplomacy icon"
            className="w-16 h-16 my-auto drop-shadow-[0.1rem_0.1rem_0.5rem_rgba(0,0,0,0.7)]"
            draggable={false}
          />
          <h1 className="my-auto text-shadow-md">
            {title}
            {/* <span className="text-base text-gray-400 align-super">WIP</span> */}
          </h1>
        </Link>
      </div>

      <div className={'w-1/3 flex flex-row justify-center text-2xl text-slate-50 my-auto' + linksWidth}>
        <Link className={pageButtonClass + avoidImageMargin} to={'/'} draggable={false}>
          Skills
        </Link>
        <Link className={pageButtonClass} to={'/techHome'} draggable={false}>
          Techs
        </Link>
      </div>

      <div className={'w-1/3 flex flex-row justify-end text-2xl text-slate-50 my-auto' + linksWidth}>
        <Link className={buttonClass + ' mr-4'} to={'/about'} draggable={false}>
          About
        </Link>
      </div>
    </div>
  );
};

export default Header;
