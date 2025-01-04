import { readJSONSync } from 'fs-extra';
import { CharacterInterface, CharacterListInterface } from '../@types/CharacterListInterface.ts';
import subcultureMap from '../lists/subcultureMap.ts';
import vanillaCharacters from '../lists/vanillaCharacters.ts';
import { CompilationGroupsInterface } from '../@types/CompilationGroupsInterface.ts';

export const sortCharacterList = (characterList: CharacterListInterface, folder: string) => {
  const compilationGroups: CompilationGroupsInterface = readJSONSync(`./output/compGroups/${folder}.json`, {
    throws: false,
  });

  const massCharList: {
    [modName: string]: {
      [subcultureKey: string]: {
        lords: {
          prio: { [key: string]: CharacterInterface };
          reg: { [key: string]: CharacterInterface };
          deprio: { [key: string]: CharacterInterface };
        };
        heroes: {
          prio: { [key: string]: CharacterInterface };
          reg: { [key: string]: CharacterInterface };
          deprio: { [key: string]: CharacterInterface };
        };
      };
    };
  } = {};

  const modArray =
    compilationGroups?.mods !== undefined ? ['vanilla', 'else', ...compilationGroups.mods] : ['vanilla', 'else'];
  modArray.forEach((mod) => {
    massCharList[mod] = {};
    Object.values(subcultureMap).forEach(
      (subcultureKey) =>
        (massCharList[mod][subcultureKey] = {
          lords: { prio: {}, reg: {}, deprio: {} },
          heroes: { prio: {}, reg: {}, deprio: {} },
        }),
    );
  });
  Object.entries(characterList).forEach((subculture) => {
    const subcultureKey = subculture[0];
    const agents = subculture[1];
    Object.entries(agents.lords).forEach((lord) => {
      const lordKey = lord[0];
      const lordData = lord[1];

      const subMod = getSubMod(compilationGroups, lordKey);
      if (subMod !== 'vanilla' && subMod !== 'else') {
        lordData.folder = subMod;
      }
      if (lordData.priority) {
        massCharList[subMod][subcultureKey].lords.prio[lordKey] = lordData;
      } else if (lordData.depriority) {
        massCharList[subMod][subcultureKey].lords.deprio[lordKey] = lordData;
      } else {
        massCharList[subMod][subcultureKey].lords.reg[lordKey] = lordData;
      }
    });
    Object.entries(agents.heroes).forEach((hero) => {
      const heroKey = hero[0];
      const heroData = hero[1];
      const subMod = getSubMod(compilationGroups, heroKey);
      if (subMod !== 'vanilla' && subMod !== 'else') {
        heroData.folder = subMod;
      }
      if (heroData.priority) {
        massCharList[subMod][subcultureKey].heroes.prio[heroKey] = heroData;
      } else if (heroData.depriority) {
        massCharList[subMod][subcultureKey].heroes.deprio[heroKey] = heroData;
      } else {
        massCharList[subMod][subcultureKey].heroes.reg[heroKey] = heroData;
      }
    });
  });

  const sortedCharList: CharacterListInterface = {};
  modArray.forEach((mod) => {
    Object.entries(massCharList[mod]).forEach((entry) => {
      const subcultureKey = entry[0];
      const charList = entry[1];
      if (sortedCharList[subcultureKey] === undefined) {
        sortedCharList[subcultureKey] = { lords: {}, heroes: {} };
      }
      Object.entries(charList.lords.prio)
        .sort((a, b) => a[1].name.localeCompare(b[1].name))
        .forEach((lord) => (sortedCharList[subcultureKey].lords[lord[0]] = lord[1]));
      Object.entries(charList.lords.reg)
        .sort((a, b) => a[1].name.localeCompare(b[1].name))
        .forEach((lord) => (sortedCharList[subcultureKey].lords[lord[0]] = lord[1]));
      Object.entries(charList.lords.deprio)
        .sort((a, b) => a[1].name.localeCompare(b[1].name))
        .forEach((lord) => (sortedCharList[subcultureKey].lords[lord[0]] = lord[1]));

      Object.entries(charList.heroes.prio)
        .sort((a, b) => a[1].name.localeCompare(b[1].name))
        .forEach((hero) => (sortedCharList[subcultureKey].heroes[hero[0]] = hero[1]));
      Object.entries(charList.heroes.reg)
        .sort((a, b) => a[1].name.localeCompare(b[1].name))
        .forEach((hero) => (sortedCharList[subcultureKey].heroes[hero[0]] = hero[1]));
      Object.entries(charList.heroes.deprio)
        .sort((a, b) => a[1].name.localeCompare(b[1].name))
        .forEach((hero) => (sortedCharList[subcultureKey].heroes[hero[0]] = hero[1]));
    });
  });

  Object.keys(sortedCharList).forEach((subcultureKey) => {
    if (JSON.stringify(sortedCharList[subcultureKey]) === '{"lords":{},"heroes":{}}') {
      delete sortedCharList[subcultureKey];
    }
  });

  return sortedCharList;
};

const getSubMod = (compilationGroups: CompilationGroupsInterface, agentKey: string) => {
  let subMod;
  if (compilationGroups?.nodeSets?.[agentKey] !== undefined) {
    subMod = compilationGroups?.nodeSets?.[agentKey];
  } else if (vanillaCharacters[agentKey] !== undefined) {
    subMod = 'vanilla';
  } else {
    subMod = 'else';
  }
  return subMod;
};
