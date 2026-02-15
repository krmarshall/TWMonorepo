import { Link } from 'react-router-dom';
import headerImg from '../imgs/header.webp';
import headerDevImg from '../imgs/header_dev.webp';
import useBulkMediaQueries from '../hooks/useBulkMediaQueries.tsx';
import { Fragment } from 'react/jsx-runtime';
import { Ref, useRef } from 'react';

const Header = () => {
  const { isNarrow, shortenHeaderTitle, isMobileWidth } = useBulkMediaQueries();
  const popoverRef: Ref<HTMLDivElement> | null = useRef(null);

  const closePopover = () => {
    popoverRef?.current?.hidePopover();
  };

  const title = shortenHeaderTitle ? 'Total Warhammer Planner' : 'TWP';
  const avoidImageMargin = isMobileWidth ? ' mr-4' : ' mr-44';

  const buttonClass = 'button hover-scale bg-gray-600 w-fit text-gray-100';

  return (
    <div className="bg-gray-900 flex flex-row flex-nowrap justify-between h-16 px-4 border-b border-gray-500">
      <div className="w-1/3 flex flex-row flex-nowrap justify-start">
        <Link to={'/'} className="text-slate-100 text-4xl flex flex-row flex-nowrap">
          {location.hostname === 'localhost' || location.hostname === '127.0.0.1' ? (
            <img
              src={headerDevImg}
              alt="header diplomacy icon"
              className="w-16 h-16 my-auto drop-shadow-[0.1rem_0.1rem_0.5rem_rgba(0,0,0,0.7)]"
              draggable={false}
            />
          ) : (
            <img
              src={headerImg}
              alt="header diplomacy icon"
              className="w-16 h-16 my-auto drop-shadow-[0.1rem_0.1rem_0.5rem_rgba(0,0,0,0.7)]"
              draggable={false}
            />
          )}

          <h1 className="my-auto text-shadow-md">{title}</h1>
        </Link>
      </div>

      {!isNarrow && ( // Desktop Links
        <Fragment>
          <div className={'w-1/3 flex flex-row justify-center text-2xl text-slate-50 my-auto'}>
            <Link className={buttonClass + avoidImageMargin} to={'/'} draggable={false}>
              Skills
            </Link>
            <Link className={buttonClass} to={'/techHome'} draggable={false}>
              Techs
            </Link>
          </div>

          <div className={'w-1/3 flex flex-row justify-end text-2xl text-slate-50 my-auto'}>
            <Link className={buttonClass + ' mr-4'} to={'/about'} draggable={false}>
              About
            </Link>
          </div>
        </Fragment>
      )}
      {isNarrow && ( // Mobile Links Hamburger/Popover
        <Fragment>
          <button popoverTarget="navPopover" popoverTargetAction="toggle">
            <svg
              className="my-auto"
              width="46px"
              height="46px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 7L4 7" stroke="#858585" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M20 12L4 12" stroke="#858585" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M20 17L4 17" stroke="#858585" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <div className="m-auto bg-transparent" popover="auto" id="navPopover" ref={popoverRef}>
            <div className="flex flex-col w-[50vw] h-[50vh] text-3xl bg-gray-900 rounded-2xl shadow-2xl shadow-gray-900">
              <Link className={buttonClass + ' mx-auto'} to={'/'} draggable={false} onClick={() => closePopover()}>
                Skills
              </Link>
              <Link
                className={buttonClass + ' mx-auto'}
                to={'/techHome'}
                draggable={false}
                onClick={() => closePopover()}
              >
                Techs
              </Link>
              <Link className={buttonClass + ' mx-auto'} to={'/about'} draggable={false} onClick={() => closePopover()}>
                About
              </Link>
              <button
                className={buttonClass + ' mx-auto bg-red-900'}
                popoverTarget="navPopover"
                popoverTargetAction="hide"
              >
                Close
              </button>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Header;
