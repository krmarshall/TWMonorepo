import { sync } from 'fast-glob';
import { readFileSync } from 'fs';

interface skillDataInterface {
  [key: string]: {
    [key: string]: {
      [key: string]: {
        skillTree: unknown;
      };
    };
  };
}

const skillData: skillDataInterface = {};

const initializeSkillData = () => {
  const gamePaths = sync('../TWPData/skills/*/', { markDirectories: true, onlyDirectories: true });

  gamePaths.forEach((gamePath) => {
    const game = gamePath.split('./TWPData/skills/')[1].replace('/', '');
    skillData[game] = {};
    const factionPaths = sync(`${gamePath}*/`, { markDirectories: true, onlyDirectories: true });

    factionPaths.forEach((factionPath) => {
      const faction = factionPath.split(gamePath)[1].replace('/', '');
      skillData[game][faction] = {};
      const characterPaths = sync(`${factionPath}**.json`);

      characterPaths.forEach((characterPath) => {
        const character = characterPath.split(factionPath)[1].replace('.json', '');
        skillData[game][faction][character] = JSON.parse(readFileSync(characterPath, 'utf-8'));
      });
    });
  });
};

interface techDataInterface {
  [key: string]: {
    [key: string]: {
      techTree: unknown;
    };
  };
}

const techData: techDataInterface = {};

const initializeTechData = () => {
  const gamePaths = sync('../TWPData/techs/*/', { markDirectories: true, onlyDirectories: true });

  gamePaths.forEach((gamePath) => {
    const game = gamePath.split('../TWPData/techs/')[1].replace('/', '');
    techData[game] = {};
    const techTreePaths = sync(`${gamePath}**.json`);

    techTreePaths.forEach((techTreePath) => {
      const techTree = techTreePath.split(gamePath)[1].replace('.json', '');
      techData[game][techTree] = JSON.parse(readFileSync(techTreePath, 'utf-8'));
    });
  });
};

const initializeData = () => {
  initializeSkillData();
  initializeTechData();
};

export { initializeData, skillData, techData };
