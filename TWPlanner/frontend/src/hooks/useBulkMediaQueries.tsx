import { useMediaQuery } from 'react-responsive';

interface MediaQueriesInterface {
  isMobileWidth: boolean;
  isMobileHeight: boolean;
  isMobile: boolean;
  isShortWidth: boolean;
  isShortHeight: boolean;
  isShort: boolean;
  isThin: boolean;
  tallWindow: boolean;
  isSmol: boolean;
  shortenHeaderTitle: boolean;
  doubleAdWidth: boolean;
  drawerAdWidth: boolean;
}

const useBulkMediaQueries = () => {
  const mediaQueries: MediaQueriesInterface = {
    isMobileWidth: useMediaQuery({ maxWidth: 1023 }),
    isMobileHeight: useMediaQuery({ maxHeight: 767 }),
    isMobile: false,
    isShortWidth: useMediaQuery({ maxWidth: 965 }),
    isShortHeight: useMediaQuery({ maxHeight: 669 }),
    isShort: false,
    isThin: useMediaQuery({ maxWidth: 737 }),
    tallWindow: useMediaQuery({ minHeight: 920 }),
    isSmol: useMediaQuery({ maxWidth: 600 }),
    shortenHeaderTitle: useMediaQuery({ minWidth: 1164 }),
    doubleAdWidth: useMediaQuery({ minWidth: 1456 }),
    drawerAdWidth: useMediaQuery({ minWidth: 1322 }),
  };
  mediaQueries.isMobile = mediaQueries.isMobileHeight || mediaQueries.isMobileWidth;
  mediaQueries.isShort = mediaQueries.isShortHeight || mediaQueries.isShortWidth;
  return mediaQueries;
};

export default useBulkMediaQueries;
