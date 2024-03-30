import { SpellLores } from '../../types/interfaces/GameInterface';
import { vanilla3Characters } from './vanilla3Characters';

const sfo3Characters = {
  ...vanilla3Characters,

  tmb_tomb_kings: {
    lords: {
      ...vanilla3Characters.tmb_tomb_kings.lords,
      tmb_cha_arch_liche: {
        name: 'Liche High Priest',
        spellLore: SpellLores.mixed,
      },
    },
    heroes: { ...vanilla3Characters.tmb_tomb_kings.heroes },
  },

  def_dark_elves: {
    lords: { ...vanilla3Characters.def_dark_elves.lords },
    heroes: {
      ...vanilla3Characters.def_dark_elves.heroes,
      def_fleetmaster: {
        name: 'Black Ark Reaver',
      },
    },
  },

  skv_skaven: {
    lords: {
      ...vanilla3Characters.skv_skaven.lords,
      skv_cha_rik: {
        name: 'Rikcruk Sliceblade',
      },
    },
    heroes: {
      ...vanilla3Characters.skv_skaven.heroes,
      skv_cha_bloodtail: {
        name: 'Fangleader',
      },
    },
  },

  wef_wood_elves: {
    lords: { ...vanilla3Characters.wef_wood_elves.lords },
    heroes: {
      ...vanilla3Characters.wef_wood_elves.heroes,
      wef_cha_shadowdancer: {
        name: 'Shadowdancer',
      },
    },
  },

  nor_norsca: {
    lords: {
      ...vanilla3Characters.nor_norsca.lords,
      nor_cha_hunter: {
        name: 'Marauder Pathfinder',
      },
      nor_cha_fimir: {
        name: 'Fimir Meargh',
        spellLore: SpellLores.mixed,
      },
    },
    heroes: { ...vanilla3Characters.nor_norsca.heroes },
  },

  brt_bretonnia: {
    lords: { ...vanilla3Characters.brt_bretonnia.lords },
    heroes: {
      ...vanilla3Characters.brt_bretonnia.heroes,
      brt_cha_lost: {
        name: 'Son of Bretonnia',
        spellLore: SpellLores.mixed,
      },
    },
  },

  dwf_dwarfs: {
    lords: {
      ...vanilla3Characters.dwf_dwarfs.lords,
      dwf_cha_engineer_lord: { name: 'Guild Master' },
    },
    heroes: {
      ...vanilla3Characters.dwf_dwarfs.heroes,
      dwf_cha_slayer: {
        name: 'Daemon Slayer',
      },
    },
  },

  emp_empire: {
    lords: {
      ...vanilla3Characters.emp_empire.lords,
      emp_cha_grandmaster: {
        name: 'Grand Master',
      },
    },
    heroes: { ...vanilla3Characters.emp_empire.heroes },
  },

  grn_greenskins: {
    lords: {
      ...vanilla3Characters.grn_greenskins.lords,
      grn_cha_savageboss: {
        name: 'Savage Orc Warboss',
        spellLore: SpellLores.bigWagh,
      },
    },
    heroes: { ...vanilla3Characters.grn_greenskins.heroes },
  },

  ksl_kislev: {
    lords: {
      ...vanilla3Characters.ksl_kislev.lords,
      ksl_cha_hag_lord: { name: 'Hag Mother', spellLore: SpellLores.mixed },
    },
    heroes: {
      ...vanilla3Characters.ksl_kislev.heroes,
    },
  },

  cth_cathay: {
    lords: {
      ...vanilla3Characters.cth_cathay.lords,
    },
    heroes: {
      ...vanilla3Characters.cth_cathay.heroes,
      cth_cha_gate_master: { name: 'Gate Master' },
    },
  },
};

export default sfo3Characters;
