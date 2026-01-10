import { FC, ReactNode, useState } from 'react';

interface PropInterface {
  children?: ReactNode;
  title: string;
  bg: string;
}

const IssuesSlider: FC<PropInterface> = ({ children, title, bg }) => {
  const [open, setOpen] = useState(false);

  let ulClass = 'list-disc list-inside slide-out-vert';
  if (open) {
    ulClass += ' show max-h-[80vh] mt-2';
  } else {
    ulClass += ' max-h-0';
  }

  let divClass = 'flex flex-col flex-nowrap border border-gray-500 rounded-md mt-2 mx-auto px-2 py-2 ' + bg;
  if (open) {
    divClass += ' max-w-[80vw]';
  } else {
    divClass += ' max-w-60';
  }

  const decoratedTitle = open ? `↑ ${title} ↑` : `↓ ${title} ↓`;
  return (
    <div className={divClass} style={{ transition: 'max-width .33s' }}>
      <button
        className="mx-auto w-fit h-fit px-2 bg-gray-500 hover:bg-gray-400/80 rounded-xl hover-scale"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <h1 className="text-center text-2xl text-gray-200 select-none">{decoratedTitle}</h1>
      </button>

      <ul className={ulClass}>{children}</ul>
    </div>
  );
};

export default IssuesSlider;
