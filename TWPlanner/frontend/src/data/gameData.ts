import factions from '../data/factionData';
import { GameDataInterface } from '../@types/GameInterface';
import gameImages from '../imgs/games/gameImages';

import { vanilla2CharactersMemes } from './characters/vanilla2Characters';
import { vanilla3CharactersMemes } from './characters/vanilla3Characters';
import radious3Characters from './characters/radious3Characters';
import mixu3Characters from './characters/mixu3Characters';
import lege3Characters from './characters/lege3Characters';
import crys3Characters from './characters/crys3Characters';
import scm3Characters from './characters/scm3Characters';
import sfo3Characters from './characters/sfo3Characters';
import cat3Characters from './characters/cat3Characters';
import ovn3Characters from './characters/ovn3Characters';
import hol3Characters from './characters/hol3Characters';

import vanilla2CharacterImgs from '../imgs/characters/vanilla2/vanilla2CharacterImgs';
import vanilla3CharacterImgs from '../imgs/characters/vanilla3/vanilla3CharacterImgs';
import radious3CharacterImgs from '../imgs/characters/radious3/radious3CharacterImgs';
import mixu3CharacterImgs from '../imgs/characters/mixu3/mixu3CharacterImgs';
import lege3CharacterImgs from '../imgs/characters/lege3/lege3CharacterImgs';
import crys3CharacterImgs from '../imgs/characters/crys3/crys3CharacterImgs';
import scm3CharacterImgs from '../imgs/characters/scm3/scm3CharacterImgs';
import sfo3CharacterImgs from '../imgs/characters/sfo3/sfo3CharacterImgs';
import cat3CharacterImgs from '../imgs/characters/cat3/cat3CharacterImgs';
import ovn3CharacterImgs from '../imgs/characters/ovn3/ovn3CharacterImgs';
import hol3CharacterImgs from '../imgs/characters/hol3/hol3CharacterImgs';

import mixu3CompGroups from '../../../TWPData/compGroups/mixu3.json';
import scm3CompGroups from '../../../TWPData/compGroups/scm3.json';
import cat3CompGroups from '../../../TWPData/compGroups/cat3.json';
import ovn3CompGroups from '../../../TWPData/compGroups/ovn3.json';

import modTimestamps from '../../../TWPData/modTimestamps.json';
import { mostRecentDateString, toParsedDateString } from '../utils/dateFunctions';

const gameData: { [key: string]: GameDataInterface } = {
  vanilla2: {
    text: 'Vanilla 2',
    image: gameImages['vanilla2'],
    factions: factions,
    characters: vanilla2CharactersMemes,
    characterImages: vanilla2CharacterImgs,
    updated: 'Aug 4 2022 (1.12.1)',
    category: 'Base',
  },
  vanilla3: {
    text: 'Vanilla 3',
    image: gameImages['vanilla3'],
    factions: factions,
    characters: vanilla3CharactersMemes,
    characterImages: vanilla3CharacterImgs,
    updated: 'Mar 19 2024 (4.2.2)',
    category: 'Base',
  },
  sfo3: {
    text: 'SFO 3',
    image: gameImages['sfo3'],
    factions: factions,
    characters: sfo3Characters,
    characterImages: sfo3CharacterImgs,
    updated: toParsedDateString(modTimestamps.sfo3.sfo_grimhammer_3_main),
    category: 'Overhaul',
    workshopLink: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2792731173',
  },
  radious3: {
    text: 'Radious 3',
    image: gameImages['radious3'],
    factions: factions,
    characters: radious3Characters,
    characterImages: radious3CharacterImgs,
    updated: mostRecentDateString(Object.values(modTimestamps.radious3)),
    category: 'Overhaul',
    workshopLink: 'https://steamcommunity.com/workshop/filedetails/?id=2791750313',
  },
  mixu3: {
    text: `Mixu's Compilation 3`,
    image: gameImages['mixu3'],
    factions: factions,
    characters: mixu3Characters,
    characterImages: mixu3CharacterImgs,
    compilationGroups: mixu3CompGroups,
    updated: mostRecentDateString(Object.values(modTimestamps.mixu3)),
    category: 'Character Mod Compilation',
    includes: [
      `Mixu's Legendary Lords (${toParsedDateString(modTimestamps.mixu3.ab_mixu_legendary_lords)})`,
      `Mixu's Mousillon (${toParsedDateString(modTimestamps.mixu3.ab_mixu_mousillon)})`,
      `Gnoblar Hordes - The Unwashed Masses (${toParsedDateString(modTimestamps.mixu3.ab_unwashed_masses)})`,
      `Mixu's Slayer (${toParsedDateString(modTimestamps.mixu3.ab_mixu_slayer)})`,
      `Mixu's Shadowdancer (${toParsedDateString(modTimestamps.mixu3.ab_mixu_shadowdancer)})`,
    ],
    workshopLink: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2920114265',
  },
  lege3: {
    text: 'Legendary Characters 3',
    image: gameImages['lege3'],
    factions: factions,
    characters: lege3Characters,
    characterImages: lege3CharacterImgs,
    updated: toParsedDateString(modTimestamps.lege3['!str_legendary']),
    category: 'Character Mod',
    workshopLink: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2826930183',
  },
  cat3: {
    text: `Cataph's Compilation 3`,
    image: gameImages['cat3'],
    factions: factions,
    characters: cat3Characters,
    characterImages: cat3CharacterImgs,
    compilationGroups: cat3CompGroups,
    updated: mostRecentDateString(Object.values(modTimestamps.cat3)),
    category: 'Character Mod Compilation',
    includes: [
      `Cataph's Southern Realms (TEB) (${toParsedDateString(modTimestamps.cat3['!ak_teb3'])})`,
      `Cataph's Kraka Drak: the Norse Dwarfs (${toParsedDateString(modTimestamps.cat3['!ak_kraka3'])})`,
      `Cataph's High Elf Sea Patrol (${toParsedDateString(modTimestamps.cat3['!ak_seapatrol'])})`,
    ],
    workshopLink: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2984086934',
  },
  ovn3: {
    text: 'OvN Lost Factions 3',
    image: gameImages['ovn3'],
    factions: factions,
    characters: ovn3Characters,
    characterImages: ovn3CharacterImgs,
    compilationGroups: ovn3CompGroups,
    updated: mostRecentDateString(Object.values(modTimestamps.ovn3)),
    category: 'Character Mod Compilation',
    includes: [
      `Albion (${toParsedDateString(modTimestamps.ovn3.ovn_albion)})`,
      `Araby (${toParsedDateString(modTimestamps.ovn3.ovn_araby)})`,
      `Citadel of Dusk (${toParsedDateString(modTimestamps.ovn3.ovn_citadel_of_dusk)})`,
      `Dread King Legions (${toParsedDateString(modTimestamps.ovn3.ovn_dread_king)})`,
      `Fimir (${toParsedDateString(modTimestamps.ovn3.ovn_fimir)})`,
      `Grudgebringers (${toParsedDateString(modTimestamps.ovn3.ovn_grudgebringers)})`,
    ],
    workshopLink: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2993203389',
  },
  scm3: {
    text: 'Skeleton Crew Compilation 3',
    image: gameImages['scm3'],
    factions: factions,
    characters: scm3Characters,
    characterImages: scm3CharacterImgs,
    compilationGroups: scm3CompGroups,
    updated: mostRecentDateString(Object.values(modTimestamps.scm3)),
    category: 'Character Mod Compilation',
    includes: [
      `LCCP (${toParsedDateString(modTimestamps.scm3.scm_lccp)})`,
      `Skaven Clans (${toParsedDateString(modTimestamps.scm3.str_skaven_clans)})`,
      `Marienburg (${toParsedDateString(modTimestamps.scm3['!scm_marienburg'])})`,
      `Champions of Undeath (${toParsedDateString(modTimestamps.scm3['!!!!!!Champions_of_undeath_merged_fun_tyme'])})`,
      `JBV: Curse of Nongchang (${toParsedDateString(modTimestamps.scm3.jade_vamp_pol)})`,
      `JBV: Islanders of the Moon (${toParsedDateString(modTimestamps.scm3.jade_vamp_pol_IotM)})`,
      `Dynasty of the Damned (${toParsedDateString(modTimestamps.scm3.AAA_dynasty_of_the_damned)})`,
      `Tomb Kings Extended (${toParsedDateString(modTimestamps.scm3['!xou_age_TKExtended'])})`,
      `Rotblood Tribe (${toParsedDateString(modTimestamps.scm3.str_rotblood)})`,
      `Sigmar's Heirs (${toParsedDateString(modTimestamps.scm3['@xou_emp'])})`,
      `Empire Secessionists (${toParsedDateString(modTimestamps.scm3['!scm_empire_secessionists'])})`,
      `Dark Land Orcs (${toParsedDateString(modTimestamps.scm3.froeb_dark_land_orcs)})`,
      `Dead's Cult of the Possessed (${toParsedDateString(modTimestamps.scm3.dead_cult_possessed_unit_V2)})`,
      `Karanak (${toParsedDateString(modTimestamps.scm3['!xou_khorne_karanak'])})`,
      `RotJS : Yin-Yin, the Sea Dragon (${toParsedDateString(modTimestamps.scm3.cth_yinyin_pol)})`,
      `Ivan Radinov (${toParsedDateString(modTimestamps.scm3['!xou_kislev_ivan'])})`,
    ],
    workshopLink: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2920115664',
  },
  hol3: {
    text: 'Heroes of Legend 3',
    image: gameImages['hol3'],
    factions: factions,
    characters: hol3Characters,
    characterImages: hol3CharacterImgs,
    updated: toParsedDateString(modTimestamps.hol3.inq_lol_hero),
    category: 'Character Mod',
    workshopLink: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2931087074',
  },
  crys3: {
    text: 'Leaders of Legend 3',
    image: gameImages['crys3'],
    factions: factions,
    characters: crys3Characters,
    characterImages: crys3CharacterImgs,
    updated: toParsedDateString(modTimestamps.crys3.crys_leaders),
    category: 'Overhaul',
    workshopLink: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2880244265',
  },
};

export default gameData;
