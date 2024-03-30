import { SpellLores } from '../../types/interfaces/GameInterface';

const hol3Characters = {
  brt_bretonnia: {
    lords: {
      augustine: { name: 'Viscount Augustine de Chegney' },
    },
    heroes: {
      agravain: { name: 'Agravain de Beau Quest' },
      hermit_knight: { name: 'Hermit Knight of Malmont' },
      viscount: { name: "Viscount d'Alembençon" },
    },
  },
  dwf_dwarfs: {
    lords: {
      ulther_stonehammer: { name: 'Prince Ulther Stonehammer' },
    },
    heroes: {
      balkrag_grimgorson: { name: 'Balkrag Grimgorson' },
      borri_forkbeard: { name: 'Borri Forkbeard' },
      hermit_knight: { name: 'Hermit Knight of Malmont' },
    },
  },
  emp_empire: {
    lords: {
      lorenzo_lupo: { name: 'Prince Lorenzo Lupo' },
    },
    heroes: {
      bounty_hunter_brunner: { name: 'Brunner (Dual Swords)' },
      hermit_knight: { name: 'Hermit Knight of Malmont' },
    },
  },
  cth_cathay: {
    lords: {
      lorenzo_lupo: { name: 'Prince Lorenzo Lupo' },
    },
    heroes: {
      bannaga: { name: 'Bannaga', spellLore: SpellLores.beasts },
      hermit_knight: { name: 'Hermit Knight of Malmont' },
      shi_hong: { name: 'Shi-Hong' },
    },
  },
  hef_high_elves: {
    lords: {},
    heroes: {
      hermit_knight: { name: 'Hermit Knight of Malmont' },
    },
  },
  kho_khorne: {
    lords: {},
    heroes: {
      simaergul: { name: 'Simaergul' },
    },
  },
  ksl_kislev: {
    lords: {},
    heroes: {
      hermit_knight: { name: 'Hermit Knight of Malmont' },
    },
  },
  lzd_lizardmen: {
    lords: {},
    heroes: {
      hermit_knight: { name: 'Hermit Knight of Malmont' },
    },
  },
  nur_nurgle: {
    lords: {
      vile_prince: { name: 'Be’la’krothrogor', spellLore: SpellLores.nurgle },
    },
    heroes: {},
  },
  vmp_vampire_counts: {
    lords: {
      emperor_wilhelm: { name: 'Emperor Wilhelm I' },
    },
    heroes: {
      gorgivich: { name: 'Gorgivich Krakvald' },
      gunther: { name: 'Gunther von Grecht' },
      helmut: { name: 'Helmut von Carstein' },
    },
  },
  chs_chaos: {
    lords: {
      vile_prince: { name: 'Be’la’krothrogor', spellLore: SpellLores.nurgle },
    },
    heroes: {
      simaergul: { name: 'Simaergul' },
    },
  },
  wef_wood_elves: {
    lords: {
      amadri_ironbark: { name: 'Amadri Ironbark' },
      sceolan: { name: 'Sceolan' },
    },
    heroes: {
      hermit_knight: { name: 'Hermit Knight of Malmont' },
    },
  },
};

export default hol3Characters;
