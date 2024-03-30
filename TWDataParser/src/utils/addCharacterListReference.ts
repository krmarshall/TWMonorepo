import { CharacterListInterface } from '../interfaces/CharacterListInterface';
import { GlobalDataInterface, TableRecord } from '../interfaces/GlobalDataInterface';
import cleanNodeSetKey from './cleanNodeSetKey';
import subcultureMap from '../lists/subcultureMap';

const addCharacterListReference = (
  folder: string,
  globalData: GlobalDataInterface,
  agent: TableRecord,
  nodeSet: TableRecord,
  subcultureKey: string,
  characterList: CharacterListInterface,
) => {
  const characterListEntry = { name: '', portrait: '' };

  characterListEntry.name = agent.localRefs?.main_units?.localRefs?.land_units?.onscreen_name ?? agent.onscreen_name_override;

  const artSetKeys = agent.foreignRefs?.campaign_character_art_sets;
  if (artSetKeys !== undefined) {
    artSetKeys?.sort();

    let portraitPath = globalData.portraitPaths[folder][artSetKeys[0].art_set_id];
    if (portraitPath !== undefined) {
      const portraitSplit = portraitPath.split('/');
      characterListEntry.portrait = `${folder}/${portraitSplit[portraitSplit.length - 1].replace('.png', '.webp')}`;
    } else {
      portraitPath = globalData.portraitPaths.vanilla3[artSetKeys[0].art_set_id];
      if (portraitPath !== undefined) {
        const vanillaPortraitSplit = portraitPath.split('/');
        characterListEntry.portrait = `vanilla3/${vanillaPortraitSplit[vanillaPortraitSplit.length - 1].replace('.png', '.webp')}`;
      } else {
        characterListEntry.portrait = '';
      }
    }
  }

  const nodeSetKey = cleanNodeSetKey(nodeSet.key);
  if (characterList[subcultureMap[subcultureKey]] !== undefined) {
    if (nodeSet.agent_key === 'general') {
      characterList[subcultureMap[subcultureKey]].lords[nodeSetKey] = characterListEntry;
    } else {
      characterList[subcultureMap[subcultureKey]].heroes[nodeSetKey] = characterListEntry;
    }
  }
};

export default addCharacterListReference;
