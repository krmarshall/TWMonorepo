import { SpellLores } from './SpellLoresRef';

interface CharacterInterface {
  name: string;
  portrait: string;
  priority?: boolean;
  depriority?: boolean;
  folder?: string;
  spellLore?: SpellLores;
}

interface CharacterListInterface {
  [subcultureKey: string]: {
    lords: { [key: string]: CharacterInterface };
    heroes: { [key: string]: CharacterInterface };
    unknown?: { [key: string]: CharacterInterface };
  };
}

export type { CharacterListInterface, CharacterInterface };
