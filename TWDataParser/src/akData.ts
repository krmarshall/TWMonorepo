import { XMLParser } from 'fast-xml-parser';
import type { GlobalDataInterface, TableRecord } from './@types/GlobalDataInterface.ts';
import { readFileSync } from 'fs';

const akData = (folder: string, globalData: GlobalDataInterface, wh3Path: string) => {
  const assemblyKitPath = wh3Path?.replace(/data$/, 'assembly_kit/raw_data/db');
  const charactersFile = readFileSync(`${assemblyKitPath}/start_pos_characters.xml`);
  const calendarsFile = readFileSync(`${assemblyKitPath}/start_pos_calendars.xml`);
  const characterTraitsFile = readFileSync(`${assemblyKitPath}/start_pos_character_traits.xml`);
  const parser = new XMLParser();
  const characters = parser.parse(charactersFile);
  const calendars = parser.parse(calendarsFile);
  const characterTraits = parser.parse(characterTraitsFile);

  // XML tables are typed, normal tables are only strings, so convert everything to strings
  const startPosCharacters = (characters.dataroot.start_pos_characters as Array<TableRecord>).map((character) => {
    const returnChar: TableRecord = {};
    Object.keys(character).forEach((field) => (returnChar[field] = character[field].toString()));
    return returnChar;
  });
  const startPosCalendars = (calendars.dataroot.start_pos_calendars as Array<TableRecord>).map((calendar) => {
    const returnCal: TableRecord = {};
    Object.keys(calendar).forEach((field) => (returnCal[field] = calendar[field].toString()));
    return returnCal;
  });
  const startPosCharacterTraits = (characterTraits.dataroot.start_pos_character_traits as Array<TableRecord>).map(
    (characterTrait) => {
      const returnCharTrait: TableRecord = {};
      Object.keys(characterTrait).forEach((field) => (returnCharTrait[field] = characterTrait[field].toString()));
      return returnCharTrait;
    },
  );

  globalData.parsedData[folder].db['start_pos_characters_tables'] = startPosCharacters;
  globalData.parsedData[folder].db['start_pos_calendars_tables'] = startPosCalendars;
  globalData.parsedData[folder].db['start_pos_character_traits_tables'] = startPosCharacterTraits;
};

export default akData;
