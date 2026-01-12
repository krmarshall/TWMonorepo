import type { SpellLoresT } from './SpellLores.ts';

interface CharacterInterface {
  name: string;
  portrait: string;
  priority?: boolean;
  depriority?: boolean;
  folder?: string;
  spellLore?: SpellLoresT;
}

interface CharacterListInterface {
  [subcultureKey: string]: {
    lords: { [key: string]: CharacterInterface };
    heroes: { [key: string]: CharacterInterface };
    unknown?: { [key: string]: CharacterInterface };
  };
}

export type { CharacterListInterface, CharacterInterface };
