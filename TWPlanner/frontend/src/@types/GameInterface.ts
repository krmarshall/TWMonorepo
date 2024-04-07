import { CharacterListInterface } from './CharacterListInterfaceRef';
import { CompilationGroupsInterface } from './CompilationGroupsInterfaceRef';

interface GameDataInterface {
  text: string;
  image: string;
  factions: { [key: string]: string };
  characters: CharacterListInterface;
  compilationGroups?: CompilationGroupsInterface;
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

export type { GameDataInterface, TechDataInterface };
