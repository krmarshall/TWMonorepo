import type { CharacterInterface, CharacterListInterface } from '../@types/CharacterListInterface.ts';
import type { GlobalDataInterface, TableRecord } from '../@types/GlobalDataInterface.ts';
import subcultureMap from '../lists/subcultureMap.ts';
import stringInterpolator from './stringInterpolator.ts';

const addCharacterListReference = (
  folder: string,
  globalData: GlobalDataInterface,
  agent: TableRecord,
  nodeSet: TableRecord,
  subcultureKey: string,
  characterList: CharacterListInterface,
) => {
  const characterListEntry: CharacterInterface = { name: '', portrait: '' };

  characterListEntry.name = stringInterpolator(
    agent.localRefs?.main_units?.localRefs?.land_units?.onscreen_name ?? agent.onscreen_name_override,
    globalData.parsedData[folder].text,
  );

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

  if (agent.recruitment_category === 'legendary_lords' || agent.contributes_to_agent_cap === 'false') {
    characterListEntry.priority = true;
  }
  if (characterList[subcultureMap[subcultureKey]] !== undefined) {
    if (nodeSet.agent_key === 'general') {
      characterList[subcultureMap[subcultureKey]].lords[nodeSet.key] = characterListEntry;
    } else {
      characterList[subcultureMap[subcultureKey]].heroes[nodeSet.key] = characterListEntry;
    }
  }
};

export default addCharacterListReference;
