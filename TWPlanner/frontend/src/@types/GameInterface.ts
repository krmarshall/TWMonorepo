interface CompGroupsInterface {
  [key: string]: { [key: string]: boolean };
}

interface GameDataInterface {
  text: string;
  image: string;
  factions: { [key: string]: string };
  characters: {
    [key: string]: {
      lords: { [key: string]: { name: string; spellLore?: string } };
      heroes: { [key: string]: { name: string; spellLore?: string } };
    };
  };
  characterImages: { [key: string]: string };
  compilationGroups?: CompGroupsInterface;
  updated: string;
  category: string;
  includes?: Array<string>;
  workshopLink?: string;
}

interface TechDataInterface {
  text: string;
  image: string;
  updated: string;
  category: string;
  techTrees: {
    [key: string]: {
      name: string;
      image: string;
    };
  };
}

export type { GameDataInterface, TechDataInterface, CompGroupsInterface };
