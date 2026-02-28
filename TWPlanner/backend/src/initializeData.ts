import fg from 'fast-glob';
import { readFileSync } from 'fs';
import { basename } from 'path';

interface SkillDataInterface {
  // Game/Mod
  [key: string]: {
    // Faction
    [key: string]: {
      // Character
      [key: string]: {
        skillTree: unknown;
      };
    };
  };
}

const skillData: SkillDataInterface = {};

const initializeSkillData = () => {
  const gamePaths = fg.sync('../TWPData/skills/*/', { markDirectories: true, onlyDirectories: true });

  gamePaths.forEach((gamePath) => {
    const game = gamePath.split('./TWPData/skills/')[1].replace('/', '');
    skillData[game] = {};
    const factionPaths = fg.sync(`${gamePath}*/`, { markDirectories: true, onlyDirectories: true });

    factionPaths.forEach((factionPath) => {
      const faction = factionPath.split(gamePath)[1].replace('/', '');
      skillData[game][faction] = {};
      const characterPaths = fg.sync(`${factionPath}**.json`);

      characterPaths.forEach((characterPath) => {
        const character = characterPath.split(factionPath)[1].replace('.json', '');
        skillData[game][faction][character] = JSON.parse(readFileSync(characterPath, 'utf-8'));
      });
    });
  });
};

interface TechDataInterface {
  // Game/Mod
  [key: string]: {
    // Faction
    [key: string]: {
      techTree: unknown;
    };
  };
}

const techData: TechDataInterface = {};

const initializeTechData = () => {
  const gamePaths = fg.sync('../TWPData/techs/*/', { markDirectories: true, onlyDirectories: true });

  gamePaths.forEach((gamePath) => {
    const game = gamePath.split('../TWPData/techs/')[1].replace('/', '');
    techData[game] = {};
    const techTreePaths = fg.sync(`${gamePath}**.json`);

    techTreePaths.forEach((techTreePath) => {
      const techTree = techTreePath.split(gamePath)[1].replace('.json', '');
      techData[game][techTree] = JSON.parse(readFileSync(techTreePath, 'utf-8'));
    });
  });
};

interface ItemDataInterface {
  [key: string]: unknown;
}

const itemData: ItemDataInterface = {};

const initializeItemData = () => {
  const itemPaths = fg.sync('../TWPData/items/*.json');

  itemPaths.forEach((itemPath) => {
    const itemName = basename(itemPath, '.json');
    itemData[itemName] = JSON.parse(readFileSync(itemPath, 'utf-8'));
  });
};

const initializeData = () => {
  initializeSkillData();
  initializeTechData();
  initializeItemData();
};

export { initializeData, skillData, techData, itemData };
