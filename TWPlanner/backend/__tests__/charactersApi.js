import supertest from 'supertest';
import fg from 'fast-glob';
import path from 'path';

import app from '../src/app';
import { initializeData, skillData } from '../src/initializeData';
import { vanilla2Characters } from '../../frontend/src/data/characters/vanilla2Characters';
import radious3Characters from '../../frontend/src/data/characters/radious3Characters';
import { vanilla3Characters } from '../../frontend/src/data/characters/vanilla3Characters';
import mixu3Characters from '../../frontend/src/data/characters/mixu3Characters';
import lege3Characters from '../../frontend/src/data/characters/lege3Characters';
import crys3Characters from '../../frontend/src/data/characters/crys3Characters';
import scm3Characters from '../../frontend/src/data/characters/scm3Characters';
import sfo3Characters from '../../frontend/src/data/characters/sfo3Characters';
import cat3Characters from '../../frontend/src/data/characters/cat3Characters';
import ovn3Characters from '../../frontend/src/data/characters/ovn3Characters';
import hol3Characters from '../../frontend/src/data/characters/hol3Characters';

const request = supertest(app);

beforeAll(() => {
  initializeData();
});

describe('Basic character API tests', () => {
  test('Basic example Malagor', async () => {
    const response = await request.get('/api/skills/vanilla2.bst_beastmen.bst_malagor.false');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(skillData['vanilla2']['bst_beastmen']['bst_malagor']);
  });

  test('Invalid game returns 404', async () => {
    const response = await request.get('/api/skills/garbage.beastmen.bst_malagor.false');
    expect(response.status).toBe(404);
    expect(response.body).not.toEqual(skillData['vanilla2']['bst_beastmen']['bst_malagor']);
  });

  test('Invalid faction returns 404', async () => {
    const response = await request.get('/api/skills/vanilla2.garbage.bst_malagor.false');
    expect(response.status).toBe(404);
    expect(response.body).not.toEqual(skillData['vanilla2']['bst_beastmen']['bst_malagor']);
  });

  test('Invalid character returns 404', async () => {
    const response = await request.get('/api/skills/vanilla2.bst_beastmen.garbage.false');
    expect(response.status).toBe(404);
    expect(response.body).not.toEqual(skillData['vanilla2']['bst_beastmen']['bst_malagor']);
  });
});

describe('Bulk character API test', () => {
  const gameList = [
    { charList: vanilla2Characters, name: 'vanilla2' },

    { charList: vanilla3Characters, name: 'vanilla3' },
    { charList: radious3Characters, name: 'radious3' },
    { charList: mixu3Characters, name: 'mixu3' },
    { charList: lege3Characters, name: 'lege3' },
    { charList: crys3Characters, name: 'crys3' },
    { charList: scm3Characters, name: 'scm3' },
    { charList: sfo3Characters, name: 'sfo3' },
    { charList: cat3Characters, name: 'cat3' },
    { charList: ovn3Characters, name: 'ovn3' },
    { charList: hol3Characters, name: 'hol3' },
  ];

  gameList.forEach((game) => {
    const characterPathList = fg.sync(`../TWPData/skills/${game.name}/**/*.json`);
    const characterList = characterPathList.map((characterPath) => path.basename(characterPath, '.json'));
    const testedChars = [];

    const factionKeys = Object.keys(game.charList);
    factionKeys.forEach((factionKey) => {
      const characterKeys = [
        ...Object.keys(game.charList[factionKey].lords),
        ...Object.keys(game.charList[factionKey].heroes),
      ];
      characterKeys.forEach((characterKey) => {
        test(`${game.name} - ${factionKey} - ${characterKey}`, async () => {
          const response = await request.get(`/api/skills/${game.name}.${factionKey}.${characterKey}.false`);
          expect(response.status).toBe(200);
          expect(response.body).toHaveProperty('key', characterKey);
          expect(response.body).toHaveProperty('skillTree');
          testedChars.push(characterKey);
        });
      });
    });

    test(`All ${game.name} characters were served`, () => {
      testedChars.sort();
      characterList.sort();
      expect(testedChars).toEqual(characterList);
    });
  });
});
