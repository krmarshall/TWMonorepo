import { XMLParser } from 'fast-xml-parser';
import { GlobalDataInterface, TableRecord } from './interfaces/GlobalDataInterface';
import { readFileSync } from 'fs-extra';

const akData = (folder: string, globalData: GlobalDataInterface) => {
  const charactersFile = readFileSync(`./game_source/${folder}/start_pos_characters.xml`);
  const characterTraitsFile = readFileSync(`./game_source/${folder}/start_pos_character_traits.xml`);
  const parser = new XMLParser();
  const characters = parser.parse(charactersFile);
  const characterTraits = parser.parse(characterTraitsFile);

  // XML tables are typed, normal tables are only strings, so convert everything to strings
  const startPosCharacters = (characters.dataroot.start_pos_characters as Array<TableRecord>).map((character) => {
    const returnChar: TableRecord = {};
    Object.keys(character).forEach((field) => (returnChar[field] = character[field].toString()));
    return returnChar;
  });
  const startPosCharacterTraits = (characterTraits.dataroot.start_pos_character_traits as Array<TableRecord>).map((characterTrait) => {
    const returnCharTrait: TableRecord = {};
    Object.keys(characterTrait).forEach((field) => (returnCharTrait[field] = characterTrait[field].toString()));
    return returnCharTrait;
  });

  globalData.parsedData[folder].db['start_pos_characters_tables'] = startPosCharacters;
  globalData.parsedData[folder].db['start_pos_character_traits_tables'] = startPosCharacterTraits;
};

export default akData;
