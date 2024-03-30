import { SpellLores } from '../../@types/GameInterface';
import { vanilla3Characters } from './vanilla3Characters';

const radious3Characters = {
  ...vanilla3Characters,

  tmb_tomb_kings: {
    lords: {
      ...vanilla3Characters.tmb_tomb_kings.lords,
      tmb_liche_high_priest_death: { name: 'Liche High Priest (Death)', spellLore: SpellLores.death },
      tmb_liche_high_priest_light: { name: 'Liche High Priest (Light)', spellLore: SpellLores.light },
      tmb_liche_high_priest_nehekhara: { name: 'Liche High Priest (Nehekhara)', spellLore: SpellLores.nehekhara },
    },
    heroes: { ...vanilla3Characters.tmb_tomb_kings.heroes },
  },

  cst_vampire_coast: {
    lords: {
      ...vanilla3Characters.cst_vampire_coast.lords,
      vpr_herald_of_mathlann: { name: 'Champion of Mathlann', spellLore: SpellLores.mixed },
      vpr_strigoi: { name: 'Strigoi Mourngul Lord', spellLore: SpellLores.mixed },
    },
    heroes: { ...vanilla3Characters.cst_vampire_coast.heroes },
  },

  hef_high_elves: {
    lords: {
      ...vanilla3Characters.hef_high_elves.lords,
      hef_anointed_general: { name: 'Anointed of Asuryan' },
    },
    heroes: { ...vanilla3Characters.hef_high_elves.heroes },
  },

  bst_beastmen: {
    lords: {
      ...vanilla3Characters.bst_beastmen.lords,
      bst_shaggoth: { name: 'Shaggoth' },
      bst_exalted_shaman_nurgle: { name: 'Exalted Shaman (Nurgle)', spellLore: SpellLores.nurgle },
      bst_exalted_shaman_slaanesh: { name: 'Exalted Shaman (Slaanesh)', spellLore: SpellLores.slaanesh },
      bst_exalted_shaman_tzeentch: { name: 'Exalted Shaman (Tzeentch)', spellLore: SpellLores.tzeentch },
    },
    heroes: { ...vanilla3Characters.bst_beastmen.heroes },
  },

  wef_wood_elves: {
    lords: {
      ...vanilla3Characters.wef_wood_elves.lords,
      wef_wood_seer_death: { name: 'Wood Seer (Death)', spellLore: SpellLores.death },
      wef_wood_seer_heavens: { name: 'Wood Seer (Heavens)', spellLore: SpellLores.heavens },
      wef_wood_seer_light: { name: 'Wood Seer (Light)', spellLore: SpellLores.light },
    },
    heroes: { ...vanilla3Characters.wef_wood_elves.heroes },
  },

  nor_norsca: {
    lords: {
      ...vanilla3Characters.nor_norsca.lords,
      nor_fimir_general: { name: 'Fimir Noble' },
      nor_shaman_beasts: { name: 'Shaman Warleader (Beasts)', spellLore: SpellLores.beasts },
      nor_shaman_death: { name: 'Shaman Warleader (Death)', spellLore: SpellLores.death },
      nor_shaman_fire: { name: 'Shaman Warleader (Fire)', spellLore: SpellLores.fire },
      nor_shaman_metal: { name: 'Shaman Warleader (Metal)', spellLore: SpellLores.metal },
      nor_shaman_shadows: { name: 'Shaman Warleader (Shadows)', spellLore: SpellLores.shadows },
    },
    heroes: { ...vanilla3Characters.nor_norsca.heroes },
  },

  brt_bretonnia: {
    lords: {
      ...vanilla3Characters.brt_bretonnia.lords,
      brt_hermit_knight: { name: 'Hermit Knight' },
    },
    heroes: { ...vanilla3Characters.brt_bretonnia.heroes },
  },

  dwf_dwarfs: {
    lords: {
      ...vanilla3Characters.dwf_dwarfs.lords,
      dwf_guildmaster_general: { name: 'Guildmaster' },
    },
    heroes: { ...vanilla3Characters.dwf_dwarfs.heroes },
  },

  grn_greenskins: {
    lords: {
      ...vanilla3Characters.grn_greenskins.lords,
      grn_savage_ork_warlord: { name: 'Savage Ork Warboss' },
    },
    heroes: { ...vanilla3Characters.grn_greenskins.heroes },
  },

  ksl_kislev: {
    lords: {
      ...vanilla3Characters.ksl_kislev.lords,
      ksl_admiral: { name: 'Lord of the Admiralty' },
    },
    heroes: { ...vanilla3Characters.ksl_kislev.heroes },
  },

  cth_cathay: {
    lords: {
      ...vanilla3Characters.cth_cathay.lords,
      cth_celestial_champion: { name: 'Celestial Champion' },
    },
    heroes: { ...vanilla3Characters.cth_cathay.heroes },
  },

  ogr_ogre_kingdoms: {
    lords: {
      ...vanilla3Characters.ogr_ogre_kingdoms.lords,
      ogr_slaughtermaster_death: { name: 'Slaughtermaster (Death)', spellLore: SpellLores.death },
      ogr_slaughtermaster_heavens: { name: 'Slaughtermaster (Heavens)', spellLore: SpellLores.heavens },
    },
    heroes: { ...vanilla3Characters.ogr_ogre_kingdoms.heroes },
  },

  kho_khorne: {
    lords: {
      ...vanilla3Characters.kho_khorne.lords,
      kho_wrathcaller: { name: 'Wrathcaller' },
    },
    heroes: { ...vanilla3Characters.kho_khorne.heroes },
  },

  tze_tzeentch: {
    lords: {
      ...vanilla3Characters.tze_tzeentch.lords,
      tze_renegade_sorcerer_dark: { name: 'Renegade Sorcerer (Dark)', spellLore: SpellLores.dark },
      tze_renegade_sorcerer_death: { name: 'Renegade Sorcerer (Death)', spellLore: SpellLores.death },
      tze_renegade_sorcerer_shadows: { name: 'Renegade Sorcerer (Shadows)', spellLore: SpellLores.shadows },
    },
    heroes: { ...vanilla3Characters.tze_tzeentch.heroes },
  },

  sla_slaanesh: {
    lords: {
      ...vanilla3Characters.sla_slaanesh.lords,
      sla_flawless_king: { name: 'Flawless King' },
    },
    heroes: { ...vanilla3Characters.sla_slaanesh.heroes },
  },

  nur_nurgle: {
    lords: {
      ...vanilla3Characters.nur_nurgle.lords,
      nur_watcher_of_the_garden: { name: 'Watcher of the Garden' },
    },
    heroes: { ...vanilla3Characters.nur_nurgle.heroes },
  },

  chd_chaos_dwarfs: {
    lords: {
      ...vanilla3Characters.chd_chaos_dwarfs.lords,
      chd_herald_of_the_conclave: { name: 'Herald of the Conclave' },
    },
    heroes: { ...vanilla3Characters.chd_chaos_dwarfs.heroes },
  },
};

export default radious3Characters;
