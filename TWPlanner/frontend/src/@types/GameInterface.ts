enum SpellLores {
  'runic' = 'runic',
  'mixed' = 'mixed',
  'wild' = 'wild',
  'beasts' = 'beasts',
  'shadows' = 'shadows',
  'life' = 'life',
  'light' = 'light',
  'fire' = 'fire',
  'death' = 'death',
  'metal' = 'metal',
  'bigWagh' = 'bigWagh',
  'lilWagh' = 'lilWagh',
  'heavens' = 'heavens',
  'vampires' = 'vampires',
  'nehekhara' = 'nehekhara',
  'deeps' = 'deeps',
  'stealth' = 'stealth',
  'high' = 'high',
  'wefHigh' = 'wefHigh',
  'skvPlague' = 'skvPlague',
  'ruin' = 'ruin',
  'dark' = 'dark',
  'ice' = 'ice',
  'tempest' = 'tempest',
  'yin' = 'yin',
  'yang' = 'yang',
  'tzeentch' = 'tzeentch',
  'nurgle' = 'nurgle',
  'slaanesh' = 'slaanesh',
  'greatMaw' = 'greatMaw',
  'hashut' = 'hashut',
  'hag' = 'hag',
}

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

export { SpellLores };
export type { GameDataInterface, TechDataInterface, CompGroupsInterface };
