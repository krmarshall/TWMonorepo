interface CharacterInterface {
  name: string;
  portrait: string;
}

interface CharacterListInterface {
  [key: string]: {
    lords: { [key: string]: CharacterInterface };
    heroes: { [key: string]: CharacterInterface };
    unknown?: { [key: string]: CharacterInterface };
  };
}

export { CharacterListInterface, CharacterInterface };
