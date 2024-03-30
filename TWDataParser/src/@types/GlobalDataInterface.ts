import { v3DbList } from '../lists/extractLists/vanilla3';

interface TableRecordNoRefs {
  [key: string]: string;
}

// AK Tables we dont extract with rpfm, but have schemas for now
type RefKey = (typeof v3DbList)[number] | 'start_pos_characters' | 'start_pos_character_traits';

interface TableRecordRefs {
  // This record referencing another
  localRefs?: {
    [key in RefKey]?: TableRecord;
  };
  // Other records referencing this
  foreignRefs?: {
    [key in RefKey]?: Array<TableRecord>;
  };
}

type TableRecord = TableRecordNoRefs & TableRecordRefs;

interface GlobalDataInterface {
  imgPaths: {
    [key: string /*Folder*/]: {
      [key: string /*Filepath*/]: string;
    };
  };
  portraitPaths: {
    [key: string /* Folder */]: {
      [key: string /* art set id */]: string; //
    };
  };
  extractedData: {
    [key: string /*Folder*/]: {
      db: {
        [key: string /*DB Folder*/]: {
          [key: string /*DB Name*/]: Array<TableRecordNoRefs>;
        };
      };
      text: TableRecordNoRefs;
    };
  };
  parsedData: {
    [key: string /*Folder*/]: {
      db: {
        [key: string /*DB Folder*/]: Array<TableRecordNoRefs>;
      };
      text: TableRecordNoRefs;
    };
  };
}

export type { RefKey };
export { GlobalDataInterface, TableRecord };
