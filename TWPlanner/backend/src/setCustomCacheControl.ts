import { Response } from 'express';
import { getType } from 'mime/lite';

const setCustomCacheControl = (res: Response, path: string) => {
  if (getType(path) === 'text/html') {
    res.setHeader('Cache-Control', 'public, max-age=0');
  }
};

export default setCustomCacheControl;
