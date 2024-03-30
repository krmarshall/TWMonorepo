import { API } from 'src/preload';

declare global {
  interface Window {
    API: typeof API;
  }
}
