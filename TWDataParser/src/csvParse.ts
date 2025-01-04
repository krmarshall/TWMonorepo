import { sync } from 'fast-glob';
import { readFileSync } from 'fs';
// eslint-disable-next-line import/extensions
import { parse } from 'csv-parse/sync';
import path from 'path';
import { GlobalDataInterface } from './@types/GlobalDataInterface.ts';

const csvParseConfig = {
  delimiter: '\t',
  from: 2,
  record_delimiter: '\n',
  columns: true,
  relax_quotes: true,
  quote: '`',
};

const csvParse = (folder: string, mod: boolean, globalData: GlobalDataInterface) => {
  // Add 0 to end of db name until it doesnt exist, then return that name
  const dbFileName = (dbFolder: string, dbName: string, iterator = ''): string => {
    if (globalData.extractedData[folder].db[dbFolder][dbName + iterator] !== undefined) {
      return dbFileName(dbFolder, dbName, iterator + '0');
    }
    return dbName + iterator;
  };

  const dbFilePaths = sync([`./extracted_files/${folder}/db/**/*.tsv`, `./extracted_files/${folder}/subDB*/**/*.tsv`], {
    onlyFiles: true,
  });
  const locFilePaths = sync(
    [`./extracted_files/${folder}/text/**/*.tsv`, `./extracted_files/${folder}/subLOC*/**/*.tsv`],
    {
      onlyFiles: true,
    },
  );
  const locObject: { [key: string]: string } = {};

  dbFilePaths.forEach((filePath) => {
    const fileData = readFileSync(filePath, 'utf-8');
    const parsedArray = parse(fileData, csvParseConfig);

    if (mod) {
      const dirInfo = path.parse(filePath);
      const dirs = dirInfo.dir.split('/');
      const dbFolder = dirs[dirs.length - 1];

      if (globalData.extractedData[folder].db[dbFolder] === undefined) {
        globalData.extractedData[folder].db[dbFolder] = {};
      }
      const dbName = dbFileName(dbFolder, dirInfo.name);
      globalData.extractedData[folder].db[dbFolder][dbName] = parsedArray;
    } else {
      const fileDir = path.dirname(filePath).split('/');
      const dbFolder = fileDir[fileDir.length - 1];
      globalData.parsedData[folder].db[dbFolder] = parsedArray;
    }
  });

  locFilePaths.forEach((filePath) => {
    const fileData = readFileSync(filePath, 'utf-8');
    const parsedArray = parse(fileData, csvParseConfig);

    parsedArray.forEach((loc: { key: string; text: string }) => {
      if (loc.text.length === 0 && locObject[loc.key]?.length > 0) {
        // Dont overwrite good locs with empty ones
      } else {
        locObject[loc.key] = loc.text;
      }
    });
  });

  if (mod) {
    globalData.extractedData[folder].text = locObject;
  } else {
    globalData.parsedData[folder].text = locObject;
  }
};

export default csvParse;
