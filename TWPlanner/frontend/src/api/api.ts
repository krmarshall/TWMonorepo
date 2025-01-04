import { CharacterInterface } from '../@types/CharacterInterfaceRef.ts';
import { TechSetInterface } from '../@types/TechInterface.ts';

const path = import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://totalwarhammerplanner.com/api';

const getErrorMessage = (status: number) => {
  let errorMessage = '';
  switch (status) {
    case 404: {
      errorMessage = 'Requested character not found';
      break;
    }
    case 502: {
      errorMessage = 'API unreachable, try again later';
      break;
    }
    default: {
      errorMessage = 'Could not fetch character';
      break;
    }
  }
  return errorMessage;
};

const api = {
  getCharacterSkillTree: (
    gameKey: string,
    factionKey: string,
    characterKey: string,
    hasBuild: boolean,
  ): Promise<CharacterInterface> => {
    return fetch(`${path}/skills/${gameKey}.${factionKey}.${characterKey}.${hasBuild}`, {
      method: 'GET',
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        const errorMessage = getErrorMessage(response.status);

        throw new Error(errorMessage);
      }
    });
  },

  getTechTree: (gameKey: string, techTreeKey: string): Promise<TechSetInterface> => {
    return fetch(`${path}/techs/${gameKey}.${techTreeKey}`, { method: 'GET' }).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        const errorMessage = getErrorMessage(response.status);

        throw new Error(errorMessage);
      }
    });
  },
};

export default api;
