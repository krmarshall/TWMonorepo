import { CharacterInterface } from '../@types/CharacterInterfaceRef.ts';
import { ExtendedItemInterface } from '../@types/ItemInterfaceRef.ts';
import { TechSetInterface } from '../@types/TechInterface.ts';

const path = import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://totalwarhammerplanner.com/api';

const getErrorMessage = (status: number) => {
  let errorMessage = '';
  switch (status) {
    case 404: {
      errorMessage = 'Requested record not found';
      break;
    }
    case 502: {
      errorMessage = 'API unreachable, try again later';
      break;
    }
    default: {
      errorMessage = 'Could not fetch record';
      break;
    }
  }
  return errorMessage;
};

const api = {
  getCharacterSkillTree: (
    modKey: string,
    factionKey: string,
    characterKey: string,
    hasBuild: boolean,
  ): Promise<CharacterInterface> => {
    return fetch(`${path}/skills/${modKey}.${factionKey}.${characterKey}.${hasBuild}`, {
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

  getTechTree: (modKey: string, techTreeKey: string): Promise<TechSetInterface> => {
    return fetch(`${path}/techs/${modKey}.${techTreeKey}`, { method: 'GET' }).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        const errorMessage = getErrorMessage(response.status);

        throw new Error(errorMessage);
      }
    });
  },

  getBulkItems: (modKey: string): Promise<Array<ExtendedItemInterface>> => {
    return fetch(`${path}/bulkItems/${modKey}`, { method: 'GET' }).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        const errorMessage = getErrorMessage(response.status);
        throw new Error(errorMessage);
      }
    });
  },

  getItem: (modKey: string, itemKey: string) => {
    return fetch(`${path}/item/${modKey}.${itemKey}`, { method: 'GET' }).then((response) => {
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
