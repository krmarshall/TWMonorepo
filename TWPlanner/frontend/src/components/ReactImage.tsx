import { useEffect, useState, useTransition } from 'react';

import spinner from '../imgs/other/spinner.webp?inline';

interface PropsInterface {
  srcList: Array<string>;
  className: string;
  alt: string;
  w: string;
  h: string;
}

const ReactImage = ({ srcList, className, alt, w, h }: PropsInterface) => {
  const [isPending, startTransition] = useTransition();
  const [imgClass, setImgClass] = useState(className);
  const [srcState, setSrcState] = useState({ src: srcList[0], fallbackIndex: 1 });

  const errorHandler = () => {
    startTransition(() => {
      if (srcState.fallbackIndex > srcList.length - 1) {
        return;
      }
      if (srcState.src.includes('.webp')) {
        const checkPng = srcState;
        checkPng.src = checkPng.src.replace('.webp', '.png');
        setSrcState(checkPng);
      } else {
        setSrcState({
          src: srcList[srcState.fallbackIndex],
          fallbackIndex: srcState.fallbackIndex + 1,
        });
      }
    });
  };

  useEffect(() => {
    if (
      (srcState.src?.includes('/battle_ui/ability_icons/') ||
        srcState.src?.includes('/campaign_ui/ancillaries/') ||
        srcState.src?.includes('/campaign_ui/mounts/')) &&
      parseInt(w) > 48
    ) {
      setImgClass(`${className} p-3`);
    } else if (srcState.src?.includes('/campaign_ui/skills/trait_') && parseInt(w) > 24) {
      setImgClass(`${className} p-2.5`);
    } else {
      setImgClass(className);
    }
  }, [srcState.src]);

  return isPending ? (
    <img
      src={spinner}
      alt="loadingSpinner"
      width={w}
      height={h}
      draggable={false}
      className={`loading-spinner ${className}`}
    />
  ) : (
    <img
      src={srcState.src}
      draggable={false}
      className={imgClass}
      alt={alt}
      width={w}
      height={h}
      onError={() => {
        errorHandler();
      }}
    />
  );
};

export default ReactImage;
