import { SpellLores } from '../../types/interfaces/GameInterface';

const mixu3Characters = {
  bst_beastmen: {
    lords: {
      bst_ghorros_warhoof: { name: 'Ghorros Warhoof' },
      bst_slugtongue: { name: 'Molokh Slugtongue', spellLore: SpellLores.mixed },
    },
    heroes: {
      bst_little_morella: { name: 'Little Morella' },
      bst_gorehoof: { name: 'Gorehoof' },
    },
  },

  brt_bretonnia: {
    lords: {
      brt_adalhard: { name: 'Adalhard de Lyonesse' },
      brt_bohemond: { name: 'Bohemond Beastslayer' },
      brt_cassyon: { name: 'Cassyon de Parravon' },
      brt_chilfroy: { name: "Chilfroy d'Artois" },
      brt_sir_john: { name: 'Sir John Tyreweld' },
    },
    heroes: {
      brt_amalric_de_gaudaron: { name: 'Sir Almaric de Gaudaron' },
      brt_donna_don_domingio: { name: 'Donna Don Domingio' },
    },
  },

  chs_chaos: {
    lords: {
      // chs_malofex_the_storm_chaser: { name: 'Malofex the Storm-Chaser', spellLore: SpellLores.mixed },
      tze_melekh_the_changer: { name: 'Melekh the Changer', spellLore: SpellLores.fire },
    },
    heroes: {
      // chs_azubhor_clawhand: { name: 'Azubhor Clawhand', spellLore: SpellLores.metal },
    },
  },

  def_dark_elves: {
    lords: {
      def_tullaris_dreadbringer: { name: 'Tullaris Dreadbringer' },
    },
    heroes: {
      def_kouran_darkhand: { name: 'Kouran Darkhand' },
      def_tullaris_hero: { name: 'Tullaris Dreadbringer (Hero)' },
    },
  },

  dwf_dwarfs: {
    lords: {
      dwf_grimm_burloksson: { name: 'Grimm Burloksson' },
      dwf_kazador_dragonslayer: { name: 'King Kazador' },
      dwf_kragg_the_grim: { name: 'Kragg the Grim', spellLore: SpellLores.runic },
      dwf_daemon_slayer: { name: 'Daemon Slayer' },
    },
    heroes: {
      dwf_dragon_slayer: { name: 'Dragon Slayer' },
    },
  },

  emp_empire: {
    lords: {
      emp_alberich_haupt_anderssen: { name: 'Alberich Haupt-Anderssen' },
      emp_alberich_von_korden: { name: 'Alberich von Korden' },
      emp_aldebrand_ludenhof: { name: 'Aldebrand Ludenhof' },
      emp_edvard_van_der_kraal: { name: 'Edvard van der Kraal' },
      emp_elspeth: { name: 'Elspeth von Draken', spellLore: SpellLores.death },
      emp_helmut_feuerbach: { name: 'Helmut Feuerbach' },
      emp_marius_leitdorf: { name: 'Marius Leitdorf' },
      emp_theoderic_gausser: { name: 'Theoderic Gausser' },
      emp_valmir_von_raukov: { name: 'Valmir von Raukov' },
      emp_wolfram_hertwig: { name: 'Wolfram Hertwig' },
      emp_fleet_admiral_male: { name: 'Fleet Admiral' },
      emp_fleet_admiral_female: { name: 'Fleet Admiral' },
    },
    heroes: {
      emp_alberich_von_korden_hero: { name: 'Alberich von Korden (Hero)' },
      emp_luthor_huss: { name: 'Luthor Huss' },
      emp_oleg_von_raukov: { name: 'Oleg von Raukov' },
      emp_theodore_bruckner: { name: 'Theodore Bruckner' },
      emp_vorn_thugenheim: { name: 'Vorn Thugenheim' }, // Unknown
      emp_fleet_captain: { name: 'Fleet Captain' },
      emp_warrior_priest_of_taal: { name: 'Warrior Priest of Taal' },
      emp_witch_doctor_beasts: { name: 'Witch Doctor (Beasts)', spellLore: SpellLores.beasts },
      emp_witch_doctor_death: { name: 'Witch Doctor (Death)', spellLore: SpellLores.death },
      emp_witch_doctor_deep: { name: 'Witch Doctor (Deep)', spellLore: SpellLores.deeps },
      emp_witch_doctor_fire: { name: 'Witch Doctor (Fire)', spellLore: SpellLores.fire },
    },
  },

  grn_greenskins: {
    lords: {
      grn_gorfang_rotgut: { name: 'Gorfang Rotgut' },
    },
    heroes: {},
  },

  hef_high_elves: {
    lords: {
      hef_belannaer: { name: 'Belannaer the Wise', spellLore: SpellLores.mixed },
      hef_caradryan: { name: 'Caradryan' },
      hef_korhil: { name: 'Korhil' },
    },
    heroes: {
      hef_caradryan_hero: { name: 'Caradryan (Hero)' },
    },
  },

  lzd_lizardmen: {
    lords: {
      lzd_lord_huinitenuchli: { name: 'Lord Huinitenuchli', spellLore: SpellLores.mixed },
      lzd_tetto_eko: { name: "Tetto'eko", spellLore: SpellLores.heavens },
    },
    heroes: {
      lzd_chakax: { name: 'Chakax' },
    },
  },

  nor_norsca: {
    lords: {
      nor_egil_styrbjorn: { name: 'Egil Styrbjorn' }, // Unknown
      // nor_sea_raider: { name: 'Chieftain of the Sea' }, // Unknown
    },
    heroes: {
      nor_fraygerd_styrbjorn: { name: 'Fraygerd Styrbjorn' }, // Unknown
      nor_hrefna_styrbjorn: { name: 'Hrefna Styrbjorn' }, // Unknown
    },
  },

  skv_skaven: {
    lords: {
      skv_feskit: { name: 'Warlord Feskit' },
      // skv_grey_seer_death: { name: 'Grey Seer (Death)', spellLore: SpellLores.death },
    },
    heroes: {},
  },

  tmb_tomb_kings: {
    lords: {
      tmb_tutankhanut: { name: 'King Tutankhanut' },
    },
    heroes: {
      tmb_ramhotep: { name: 'Ramhotep the Visionary' },
    },
  },

  tze_tzeentch: {
    lords: {
      chs_egrimm_van_horstmann: { name: 'Egrimm van Horstmann', spellLore: SpellLores.mixed },
    },
    heroes: {
      tze_exalted_hero: { name: 'Exalted Hero of Tzeentch' },
    },
  },

  cst_vampire_coast: {
    lords: {},
    heroes: {
      cst_drekla: { name: 'Captain Drekla', spellLore: SpellLores.mixed },
    },
  },

  vmp_vampire_counts: {
    lords: {
      vmp_dieter_helsnicht: { name: 'Dieter Helsnicht', spellLore: SpellLores.mixed },
      // vmp_dieter_fortress: { name: '???' }, // Broke
    },
    heroes: {},
  },

  wef_wood_elves: {
    lords: {
      wef_daith: { name: 'Lord Daith' },
      wef_naieth_the_prophetess: { name: 'Prophetess Naieth', spellLore: SpellLores.heavens },
      wef_wychwethyl: { name: 'Wychwethyl the Wild' },
    },
    heroes: {
      wef_shadowdancer: { name: 'Shadowdancer', spellLore: SpellLores.mixed },
    },
  },

  gnb_gnoblars: {
    lords: {
      bragg_the_gutsman: { name: 'Bragg The Gutsman' },
      gnobbo: { name: 'Gnobbo the Masked' },
      king_bezos: { name: 'Great-King-Lord Bezer' },
      head_honcho: { name: 'Head Honcho' },
    },
    heroes: {
      bloodnose: { name: 'Bloodnose' },
      bonechewer_beasts: { name: 'Bonechewer (Beasts)', spellLore: SpellLores.beasts },
      bonechewer_great_maw: { name: 'Bonechewer (Great Maw)', spellLore: SpellLores.greatMaw },
      scrapper: { name: 'Scrapper' },
      woodbelly: { name: 'Woodbelly' },
    },
  },

  msl_mousillon: {
    lords: {
      msl_lady_of_the_black_grail: { name: 'Lady of the Black Grail', spellLore: SpellLores.shadows },
      msl_mallobaude: { name: 'Mallobaude' },
      msl_dark_prophetess_beasts: { name: 'Dark Prophetess (Beasts)', spellLore: SpellLores.beasts },
      msl_dark_prophetess_death: { name: 'Dark Prophetess (Death)', spellLore: SpellLores.death },
      msl_dark_prophetess_heavens: { name: 'Dark Prophetess (Heavens)', spellLore: SpellLores.heavens },
      msl_dark_prophetess_shadows: { name: 'Dark Prophetess (Shadows)', spellLore: SpellLores.shadows },
      msl_lord: { name: 'Vampire Lord', spellLore: SpellLores.vampires },
    },
    heroes: {
      msl_aucassin_de_hane: { name: 'Aucassin de Hane', spellLore: SpellLores.mixed },
      msl_bougars_the_butcher: { name: 'Bougars de Biaucaire' },
      msl_eustache_of_the_rusting_blade: { name: 'Eustache of the Rusting Blade' },
      msl_nicolete_de_oisement: { name: 'Nicolete de Oisement', spellLore: SpellLores.mixed },
      msl_damsel_beasts: { name: 'Damsel (Beasts)', spellLore: SpellLores.beasts },
      msl_damsel_death: { name: 'Damsel (Death)', spellLore: SpellLores.death },
      msl_damsel_heavens: { name: 'Damsel (Heavens)', spellLore: SpellLores.heavens },
      msl_damsel_shadows: { name: 'Damsel (Shadows)', spellLore: SpellLores.shadows },
      msl_bretonnian_wight: { name: 'Wight King' },
    },
  },
};

export default mixu3Characters;
