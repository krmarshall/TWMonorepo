import type { Response } from 'express';
import mime from 'mime/lite';

const setCustomCacheControl = (res: Response, path: string) => {
  if (mime.getType(path) === 'text/html') {
    res.setHeader('Cache-Control', 'public, max-age=0');
  }
};

export default setCustomCacheControl;
