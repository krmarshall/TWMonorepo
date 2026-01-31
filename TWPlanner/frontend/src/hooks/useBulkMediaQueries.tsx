import { useMediaQuery } from 'react-responsive';

interface MediaQueriesInterface {
  isMobileWidth: boolean;
  isMobileHeight: boolean;
  isMobile: boolean;
  isNarrow: boolean;
  shortenHeaderTitle: boolean;
  adWidthControl: boolean;
  isPortrait: boolean;
}

const useBulkMediaQueries = () => {
  const mediaQueries: MediaQueriesInterface = {
    isMobileWidth: useMediaQuery({ maxWidth: 1023 }),
    isMobileHeight: useMediaQuery({ maxHeight: 767 }),
    isMobile: false,
    isNarrow: useMediaQuery({ maxWidth: 600 }),
    shortenHeaderTitle: useMediaQuery({ minWidth: 1164 }),
    adWidthControl: useMediaQuery({ minWidth: 1456 }),
    isPortrait: useMediaQuery({ orientation: 'portrait' }),
  };
  mediaQueries.isMobile = mediaQueries.isMobileHeight || mediaQueries.isMobileWidth;
  return mediaQueries;
};

export default useBulkMediaQueries;
