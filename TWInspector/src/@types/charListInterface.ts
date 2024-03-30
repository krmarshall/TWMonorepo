interface CharacterListInterface {
  [factionKey: string]: {
    lords: { [agentKey: string]: { name: string; portrait: string } };
    heroes: { [agentKey: string]: { name: string; portrait: string } };
  };
}

export type { CharacterListInterface };
