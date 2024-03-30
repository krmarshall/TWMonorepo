import { vanilla2Characters } from './vanilla2Characters';
import { SpellLores } from '../../types/interfaces/GameInterface';

const vanilla3Characters = {
  ...vanilla2Characters,

  emp_empire: {
    lords: {
      emp_balthasar: {
        name: 'Balthasar Gelt',
        spellLore: SpellLores.metal,
      },
      emp_karl_franz: {
        name: 'Karl Franz',
      },
      markus_wulfhart: {
        name: 'Markus Wulfhart',
      },
      emp_volkmar: {
        name: 'Volkmar the Grim',
      },
      emp_boris_todbringer: {
        name: 'Boris Todbringer',
      },
      emp_arch_lector: {
        name: 'Arch Lector',
      },
      emp_general: {
        name: 'General of the Empire',
      },
      huntsmarshal: {
        name: 'Huntsman General',
      },
    },
    heroes: {
      ksl_ulrika: {
        name: 'Ulrika Magdova',
        spellLore: SpellLores.shadows,
      },
      emp_hunter_doctor_hertwig_van_hal: {
        name: 'Hertwig Van Hal',
      },
      emp_hunter_jorek_grimm_0: {
        name: 'Jorek Grimm',
      },
      emp_hunter_kalara_of_wydrioth_0: {
        name: 'Kalara of Wydrioth',
      },
      emp_hunter_rodrik_l_anguille_0: {
        name: "Rodrik L'Anguille",
      },
      emp_amber_wizard: {
        name: 'Amber Wizard',
        spellLore: SpellLores.beasts,
      },
      emp_amethyst_wizard: {
        name: 'Amethyst Wizard',
        spellLore: SpellLores.death,
      },
      emp_bright_wizard: {
        name: 'Bright Wizard',
        spellLore: SpellLores.fire,
      },
      emp_celestial_wizard: {
        name: 'Celestial Wizard',
        spellLore: SpellLores.heavens,
      },
      emp_captain: {
        name: 'Empire Captain',
      },
      grey_wizard: {
        name: 'Grey Wizard',
        spellLore: SpellLores.shadows,
      },
      jade_wizard: {
        name: 'Jade Wizard',
        spellLore: SpellLores.life,
      },
      emp_light_wizard: {
        name: 'Light Wizard',
        spellLore: SpellLores.light,
      },
      emp_warrior_priest: {
        name: 'Warrior Priest',
      },
      emp_witch_hunter: {
        name: 'Witch Hunter',
      },
    },
  },

  // Chieftain spelled properly in 3
  nor_norsca: {
    lords: {
      nor_throgg: {
        name: 'Throgg',
      },
      nor_wulfrik: {
        name: 'Wulfrik the Wanderer',
      },
      nor_arzik: {
        name: 'Azrik the Maze Keeper',
        spellLore: SpellLores.tzeentch,
      },
      nor_burplesmirk_spewpit: {
        name: 'Burplesmirk Spewpit',
        spellLore: SpellLores.nurgle,
      },
      nor_marauder_chieftain: {
        name: 'Marauder Chieftain',
      },
    },
    heroes: {
      nor_kihar: {
        name: 'Kihar the Tormentor',
        spellLore: SpellLores.slaanesh,
      },
      nor_killgore_slaymaim: {
        name: 'Killgore Slaymaim',
      },
      nor_fimir_balefiend_fire: {
        name: 'Fimir Balefiend (Fire)',
        spellLore: SpellLores.fire,
      },
      nor_fimir_balefiend_shadow: {
        name: 'Fimir Balefiend (Shadows)',
        spellLore: SpellLores.shadows,
      },
      nor_shaman_sorcerer_death: {
        name: 'Shaman-Sorcerer (Death)',
        spellLore: SpellLores.death,
      },
      nor_shaman_sorcerer_fire: {
        name: 'Shaman-Sorcerer (Fire)',
        spellLore: SpellLores.fire,
      },
      nor_shaman_sorcerer_metal: {
        name: 'Shaman-Sorcerer (Metal)',
        spellLore: SpellLores.metal,
      },
      nor_skin_wolf_werekin: {
        name: 'Skin Wolf Werekin',
      },
    },
  },

  vmp_vampire_counts: {
    lords: {
      vmp_heinrich: {
        name: 'Heinrich Kemmler',
        spellLore: SpellLores.vampires,
      },
      vmp_helman_ghorst: {
        name: 'Helman Ghorst',
        spellLore: SpellLores.vampires,
      },
      vmp_isabella_von_carstein: {
        name: 'Isabella von Carstein',
        spellLore: SpellLores.vampires,
      },
      vmp_mannfred: {
        name: 'Mannfred von Carstein',
        spellLore: SpellLores.vampires,
      },
      vmp_vlad_von_carstein: {
        name: 'Vlad von Carstein',
        spellLore: SpellLores.vampires,
      },
      vmp_red_duke: {
        name: 'The Red Duke',
        spellLore: SpellLores.vampires,
      },
      vmp_bloodline_blood_dragon_lord: {
        name: 'Blood Dragon Vampire Lord',
        spellLore: SpellLores.vampires,
      },
      vmp_bloodline_lahmian_lord: {
        name: 'Lahmian Vampire Lord',
        spellLore: SpellLores.mixed,
      },
      vmp_bloodline_necrarch_lord: {
        name: 'Necrarch Vampire Lord',
        spellLore: SpellLores.mixed,
      },
      vmp_bloodline_strigoi_lord: {
        name: 'Strigoi Vampire Lord',
        spellLore: SpellLores.mixed,
      },
      vmp_bloodline_von_carstein_lord: {
        name: 'Von Carstein Vampire Lord',
        spellLore: SpellLores.mixed,
      },
      vmp_master_necromancer: {
        name: 'Master Necromancer',
        spellLore: SpellLores.vampires,
      },
      vmp_strigoi_ghoul_king: {
        name: 'Strigoi Ghoul King',
        spellLore: SpellLores.mixed,
      },
      vmp_lord: {
        name: 'Vampire Lord',
        spellLore: SpellLores.vampires,
      },
    },
    heroes: {
      vmp_isabella_von_carstein_hero: {
        name: 'Isabella von Carstein (Hero)',
        spellLore: SpellLores.vampires,
      },
      vmp_vlad_von_carstein_hero: {
        name: 'Vlad von Carstein (Hero)',
        spellLore: SpellLores.vampires,
      },
      vmp_kevon_lloydstein: {
        name: 'Kevin von Lloydstein',
      },
      vmp_banshee: {
        name: 'Banshee',
      },
      vmp_necromancer: {
        name: 'Necromancer',
        spellLore: SpellLores.vampires,
      },
      vmp_vampire: {
        name: 'Vampire (Death)',
        spellLore: SpellLores.death,
      },
      vmp_vampire_shadow: {
        name: 'Vampire (Shadows)',
        spellLore: SpellLores.shadows,
      },
      vmp_wight_king: {
        name: 'Wight King',
      },
    },
  },

  // More Slann variants added
  lzd_lizardmen: {
    lords: {
      gor_rok: {
        name: 'Gor-Rok',
      },
      lzd_kroq_gar: {
        name: 'Kroq-Gar',
      },
      lzd_lord_mazdamundi: {
        name: 'Lord Mazdamundi',
        spellLore: SpellLores.mixed,
      },
      nakai: {
        name: 'Nakai the Wanderer',
      },
      lzd_oxyotl: {
        name: 'Oxyotl',
      },
      lzd_tehenhauin: {
        name: 'Tehenhauin',
        spellLore: SpellLores.beasts,
      },
      lzd_tiktaqto: {
        name: "Tiktaq'to",
      },
      ancient_kroxigor: {
        name: 'Kroxigor Ancient',
      },
      lzd_red_crested_skink_chief: {
        name: 'Red Crested Skink Chief',
      },
      lzd_saurus_old_blood: {
        name: 'Saurus Oldblood',
      },
      lzd_slann_mage_priest_beasts: {
        name: 'Slann Mage-Priest (Beasts)',
        spellLore: SpellLores.beasts,
      },
      lzd_slann_mage_priest_death: {
        name: 'Slann Mage-Priest (Death)',
        spellLore: SpellLores.death,
      },
      lzd_slann_mage_priest_fire: {
        name: 'Slann Mage-Priest (Fire)',
        spellLore: SpellLores.fire,
      },
      lzd_slann_mage_priest_heavens: {
        name: 'Slann Mage-Priest (Heavens)',
        spellLore: SpellLores.heavens,
      },
      lzd_slann_mage_priest_high: {
        name: 'Slann Mage-Priest (High)',
        spellLore: SpellLores.high,
      },
      lzd_slann_mage_priest_life: {
        name: 'Slann Mage-Priest (Life)',
        spellLore: SpellLores.life,
      },
      lzd_slann_mage_priest: {
        name: 'Slann Mage-Priest (Light)',
        spellLore: SpellLores.light,
      },
      lzd_slann_mage_priest_metal: {
        name: 'Slann Mage-Priest (Metal)',
        spellLore: SpellLores.metal,
      },
      lzd_slann_mage_priest_shadows: {
        name: 'Slann Mage-Priest (Shadows)',
        spellLore: SpellLores.shadows,
      },
    },
    heroes: {
      lzd_lord_kroak: {
        name: 'Lord Kroak',
        spellLore: SpellLores.mixed,
      },
      lzd_saurus_scar_veteran: {
        name: 'Saurus Scar-Veteran',
      },
      lzd_skink_chief: {
        name: 'Skink Chief',
      },
      lzd_skink_oracle: {
        name: 'Skink Oracle',
        spellLore: SpellLores.mixed,
      },
      lzd_skink_priest_beasts: {
        name: 'Skink Priest (Beasts)',
        spellLore: SpellLores.beasts,
      },
      lzd_skink_priest_heavens: {
        name: 'Skink Priest (Heavens)',
        spellLore: SpellLores.heavens,
      },
    },
  },

  // // No Black Ark Blessed Dread
  // def_dark_elves_lords: {
  //   def_crone: {
  //     name: 'Crone Hellebron',
  //   },
  //   def_lokhir: {
  //     name: 'Lokhir Fellheart',
  //   },
  //   def_malus: {
  //     name: 'Malus Darkblade',
  //   },
  //   def_malekith: {
  //     name: 'Malekith',
  //     spellLore: SpellLores.dark,
  //   },
  //   def_morathi: {
  //     name: 'Morathi',
  //     spellLore: SpellLores.mixed,
  //   },
  //   def_rakarth: {
  //     name: 'Rakarth',
  //   },
  //   def_black_ark: {
  //     name: 'Black Ark',
  //   },
  //   def_dreadlord: {
  //     name: 'Dreadlord (Sword & Crossbow)',
  //   },
  //   def_dreadlord_fem: {
  //     name: 'Dreadlord (Sword & Shield)',
  //   },
  //   def_high_beastmaster: {
  //     name: 'High Beastmaster',
  //   },
  //   def_supreme_sorceress_beasts: {
  //     name: 'Supreme Sorceress (Beasts)',
  //     spellLore: SpellLores.beasts,
  //   },
  //   def_supreme_sorceress_dark: {
  //     name: 'Supreme Sorceress (Dark)',
  //     spellLore: SpellLores.dark,
  //   },
  //   def_supreme_sorceress_death: {
  //     name: 'Supreme Sorceress (Death)',
  //     spellLore: SpellLores.death,
  //   },
  //   def_supreme_sorceress_fire: {
  //     name: 'Supreme Sorceress (Fire)',
  //     spellLore: SpellLores.fire,
  //   },
  //   def_supreme_sorceress_shadow: {
  //     name: 'Supreme Sorceress (Shadows)',
  //     spellLore: SpellLores.shadows,
  //   },
  // },

  chd_chaos_dwarfs: {
    lords: {
      chd_astragoth: {
        name: 'Astragoth Ironhand',
        spellLore: SpellLores.mixed,
      },
      chd_drazhoath: {
        name: 'Drazhoath the Ashen',
        spellLore: SpellLores.hashut,
      },
      chd_zhatan: {
        name: 'Zhatan the Black',
      },
      chd_lord_convoy_overseer: {
        name: 'Convoy Overseer',
      },
      chd_overseer: {
        name: 'Overseer',
      },
      chd_sorcerer_prophet_death: {
        name: 'Sorcerer Prophet (Death)',
        spellLore: SpellLores.death,
      },
      chd_sorcerer_prophet_fire: {
        name: 'Sorcerer Prophet (Fire)',
        spellLore: SpellLores.fire,
      },
      chd_sorcerer_prophet_hashut: {
        name: 'Sorcerer Prophet (Hashut)',
        spellLore: SpellLores.hashut,
      },
      chd_sorcerer_prophet_metal: {
        name: 'Sorcerer Prophet (Metal)',
        spellLore: SpellLores.metal,
      },
    },
    heroes: {
      chd_gorduz_backstabber: {
        name: 'Gorduz Backstabber',
      },
      chd_bull_centaur_taurruk: {
        name: "Bull Centaur Taur'ruk",
      },
      chd_daemonsmith_sorcerer_death: {
        name: 'Daemonsmith Sorcerer (Death)',
        spellLore: SpellLores.death,
      },
      chd_daemonsmith_sorcerer_fire: {
        name: 'Daemonsmith Sorcerer (Fire)',
        spellLore: SpellLores.fire,
      },
      chd_daemonsmith_sorcerer_hashut: {
        name: 'Daemonsmith Sorcerer (Hashut)',
        spellLore: SpellLores.hashut,
      },
      chd_daemonsmith_sorcerer_metal: {
        name: 'Daemonsmith Sorcerer (Metal)',
        spellLore: SpellLores.metal,
      },
      chd_infernal_castellan: {
        name: 'Infernal Castellan',
      },
    },
  },

  cth_cathay: {
    lords: {
      cth_miao_ying: {
        name: 'Miao Ying, the Storm Dragon',
        spellLore: SpellLores.mixed,
      },
      cth_yuan_bo: {
        name: 'Yuan Bo, the Jade Dragon',
        spellLore: SpellLores.mixed,
      },
      cth_zhao_ming: {
        name: 'Zhao Ming, the Iron Dragon',
        spellLore: SpellLores.mixed,
      },
      cth_lord_caravan_master: {
        name: 'Caravan Master',
      },
      cth_celestial_general_yang: { name: 'Celestial General (Yang)', spellLore: SpellLores.yang },
      cth_celestial_general_yin: { name: 'Celestial General, (Yin)', spellLore: SpellLores.yin },
      cth_dragon_blooded_shugengan_yang: {
        name: 'Dragon-Blooded Shugengan Lord (Yang)',
        spellLore: SpellLores.yang,
      },
      cth_dragon_blooded_shugengan_yin: {
        name: 'Dragon-Blooded Shugengan Lord (Yin)',
        spellLore: SpellLores.yin,
      },
      cth_lord_magistrate_yang: {
        name: 'Lord Magistrate (Yang)',
        spellLore: SpellLores.yang,
      },
      cth_lord_magistrate_yin: {
        name: 'Lord Magistrate (Yin)',
        spellLore: SpellLores.yin,
      },
    },
    heroes: {
      cth_saytang_the_watcher: { name: 'Saytang the Watcher' },
      cth_alchemist: {
        name: 'Alchemist',
        spellLore: SpellLores.metal,
      },
      cth_astromancer: {
        name: 'Astromancer',
        spellLore: SpellLores.heavens,
      },
      cth_gate_master: { name: 'Gate Master' },
    },
  },

  dae_daemons: {
    lords: {
      dae_cha_be_lakor_0: {
        name: "Be'lakor",
        spellLore: SpellLores.shadows,
      },
      dae_daemon_prince: {
        name: 'Daemon Prince',
      },
      kho_herald_of_khorne: {
        name: 'Herald of Khorne',
      },
      kho_exalted_bloodthirster: {
        name: 'Exalted Bloodthirster',
      },
      nur_herald_of_nurgle_death: {
        name: 'Herald of Nurgle (Death)',
        spellLore: SpellLores.death,
      },
      nur_herald_of_nurgle_nurgle: {
        name: 'Herald of Nurgle (Nurgle)',
        spellLore: SpellLores.nurgle,
      },
      nur_exalted_great_unclean_one_death: {
        name: 'Exalted Great Unclean One (Death)',
        spellLore: SpellLores.death,
      },
      nur_exalted_great_unclean_one_nurgle: {
        name: 'Exalted Great Unclean One (Nurgle)',
        spellLore: SpellLores.nurgle,
      },
      sla_herald_of_slaanesh_shadow: {
        name: 'Herald of Slaanesh (Shadows)',
        spellLore: SpellLores.shadows,
      },
      sla_herald_of_slaanesh_slaanesh: {
        name: 'Herald of Slaanesh (Slaanesh)',
        spellLore: SpellLores.slaanesh,
      },
      sla_exalted_keeper_of_secrets_shadow: {
        name: 'Exalted Keeper of Secrets (Shadows)',
        spellLore: SpellLores.shadows,
      },
      sla_exalted_keeper_of_secrets_slaanesh: {
        name: 'Exalted Keeper of Secrets (Slaanesh)',
        spellLore: SpellLores.slaanesh,
      },
      tze_herald_of_tzeentch_metal: {
        name: 'Herald of Tzeentch (Metal)',
        spellLore: SpellLores.metal,
      },
      tze_herald_of_tzeentch_tzeentch: {
        name: 'Herald of Tzeentch (Tzeentch)',
        spellLore: SpellLores.tzeentch,
      },
      tze_exalted_lord_of_change_metal: {
        name: 'Exalted Lord of Change (Metal)',
        spellLore: SpellLores.metal,
      },
      tze_exalted_lord_of_change_tzeentch: {
        name: 'Exalted Lord of Change (Tzeentch)',
        spellLore: SpellLores.tzeentch,
      },
    },
    heroes: {
      tze_aekold_helbrass: { name: 'Aekold Helbrass' },
      sla_alluress_shadow: {
        name: 'Alluress (Shadows)',
        spellLore: SpellLores.shadows,
      },
      sla_alluress_slaanesh: {
        name: 'Alluress (Slaanesh)',
        spellLore: SpellLores.slaanesh,
      },
      kho_bloodreaper: {
        name: 'Bloodreaper',
      },
      tze_iridescent_horror_metal: {
        name: 'Iridescent Horror (Metal)',
        spellLore: SpellLores.metal,
      },
      tze_iridescent_horror_tzeentch: {
        name: 'Iridescent Horror (Tzeentch)',
        spellLore: SpellLores.tzeentch,
      },
      nur_plagueridden_death: {
        name: 'Plagueridden (Death)',
        spellLore: SpellLores.death,
      },
      nur_plagueridden_nurgle: {
        name: 'Plagueridden (Nurgle)',
        spellLore: SpellLores.nurgle,
      },
    },
  },

  kho_khorne: {
    lords: {
      kho_skarbrand: {
        name: 'Skarbrand the Exiled',
      },
      chs_lord_mkho: {
        name: 'Chaos Lord of Khorne',
      },
      chs_daemon_prince_khorne: {
        name: 'Daemon Prince of Khorne',
      },
      kho_herald_of_khorne: {
        name: 'Herald of Khorne',
      },
      kho_exalted_bloodthirster: {
        name: 'Exalted Bloodthirster',
      },
    },
    heroes: {
      kho_bloodreaper: {
        name: 'Bloodreaper',
      },
      kho_cultist: {
        name: 'Cultist of Khorne',
      },
      chs_exalted_hero_mkho: {
        name: 'Exalted Hero of Khorne',
      },
    },
  },

  ksl_kislev: {
    lords: {
      ksl_boris: {
        name: 'Boris Ursus',
      },
      ksl_kostaltyn: {
        name: 'Kostaltyn',
      },
      ksl_katarin: {
        name: 'Tzarina Katarin',
        spellLore: SpellLores.ice,
      },
      ksl_mother_ostankya: {
        name: 'Mother Ostankya',
        spellLore: SpellLores.hag,
      },
      ksl_ataman: {
        name: 'Ataman',
      },
      ksl_boyar: {
        name: 'Boyar',
      },
      ksl_druzhina: { name: 'Druzhina' },
      ksl_ice_witch_ice: {
        name: 'Ice Witch (Ice)',
        spellLore: SpellLores.ice,
      },
      ksl_ice_witch_tempest: {
        name: 'Ice Witch (Tempest)',
        spellLore: SpellLores.tempest,
      },
    },
    heroes: {
      ksl_the_golden_knight: { name: 'The Golden Knight Naryska Leysa' },
      ksl_ulrika: {
        name: 'Ulrika Magdova',
        spellLore: SpellLores.shadows,
      },
      ksl_frost_maiden_ice: {
        name: 'Frost Maiden (Ice)',
        spellLore: SpellLores.ice,
      },
      ksl_frost_maiden_tempest: {
        name: 'Frost Maiden (Tempest)',
        spellLore: SpellLores.tempest,
      },
      ksl_hag_witch_beasts: {
        name: 'Hag Witch (Beasts)',
        spellLore: SpellLores.beasts,
      },
      ksl_hag_witch_death: {
        name: 'Hag Witch (Death)',
        spellLore: SpellLores.death,
      },
      ksl_hag_witch_hag: {
        name: 'Hag Witch (Hag)',
        spellLore: SpellLores.hag,
      },
      ksl_hag_witch_shadows: {
        name: 'Hag Witch (Shadow)',
        spellLore: SpellLores.shadows,
      },
      ksl_patriarch: {
        name: 'Patriarch',
      },
    },
  },

  nur_nurgle: {
    lords: {
      nur_kugath: {
        name: "Ku'gath Plaguefather",
        spellLore: SpellLores.nurgle,
      },
      chs_sorcerer_lord_death_mnur: {
        name: 'Chaos Sorcerer Lord of Nurgle (Death)',
        spellLore: SpellLores.death,
      },
      chs_sorcerer_lord_nurgle_mnur: {
        name: 'Chaos Sorcerer Lord of Nurgle (Nurgle)',
        spellLore: SpellLores.nurgle,
      },
      chs_daemon_prince_nurgle: {
        name: 'Daemon Prince of Nurgle',
        spellLore: SpellLores.mixed,
      },
      nur_herald_of_nurgle_death: {
        name: 'Herald of Nurgle (Death)',
        spellLore: SpellLores.death,
      },
      nur_herald_of_nurgle_nurgle: {
        name: 'Herald of Nurgle (Nurgle)',
        spellLore: SpellLores.nurgle,
      },
      nur_exalted_great_unclean_one_death: {
        name: 'Exalted Great Unclean One (Death)',
        spellLore: SpellLores.death,
      },
      nur_exalted_great_unclean_one_nurgle: {
        name: 'Exalted Great Unclean One (Nurgle)',
        spellLore: SpellLores.nurgle,
      },
    },
    heroes: {
      nur_cultist: {
        name: 'Cultist of Nurgle',
      },
      chs_exalted_hero_mnur: {
        name: 'Exalted Hero of Nurgle',
      },
      nur_plagueridden_death: {
        name: 'Plagueridden (Death)',
        spellLore: SpellLores.death,
      },
      nur_plagueridden_nurgle: {
        name: 'Plagueridden (Nurgle)',
        spellLore: SpellLores.nurgle,
      },
    },
  },

  ogr_ogre_kingdoms: {
    lords: {
      ogr_greasus_goldtooth: {
        name: 'Greasus Goldtooth',
      },
      ogr_skrag_the_slaughterer: {
        name: 'Skrag the Slaughterer',
        spellLore: SpellLores.greatMaw,
      },
      ogr_slaughtermaster_beasts: {
        name: 'Slaughtermaster (Beasts)',
        spellLore: SpellLores.beasts,
      },
      ogr_slaughtermaster_great_maw: {
        name: 'Slaughtermaster (Great Maw)',
        spellLore: SpellLores.greatMaw,
      },
      ogr_tyrant: {
        name: 'Tyrant',
      },
    },
    heroes: {
      ogr_butcher_beasts: {
        name: 'Butcher (Beasts)',
        spellLore: SpellLores.beasts,
      },
      ogr_butcher_great_maw: {
        name: 'Butcher (Great Maw)',
        spellLore: SpellLores.greatMaw,
      },
      ogr_firebelly: {
        name: 'Firebelly',
        spellLore: SpellLores.fire,
      },
      ogr_hunter: {
        name: 'Hunter',
      },
    },
  },

  sla_slaanesh: {
    lords: {
      sla_nkari: {
        name: "N'Kari",
        spellLore: SpellLores.slaanesh,
      },
      chs_lord_msla: {
        name: 'Chaos Lord of Slaanesh',
      },
      chs_daemon_prince_slaanesh: {
        name: 'Daemon Prince of Slaanesh',
        spellLore: SpellLores.mixed,
      },
      sla_herald_of_slaanesh_shadow: {
        name: 'Herald of Slaanesh (Shadows)',
        spellLore: SpellLores.shadows,
      },
      sla_herald_of_slaanesh_slaanesh: {
        name: 'Herald of Slaanesh (Slaanesh)',
        spellLore: SpellLores.slaanesh,
      },
      sla_exalted_keeper_of_secrets_shadow: {
        name: 'Exalted Keeper of Secrets (Shadows)',
        spellLore: SpellLores.shadows,
      },
      sla_exalted_keeper_of_secrets_slaanesh: {
        name: 'Exalted Keeper of Secrets (Slaanesh)',
        spellLore: SpellLores.slaanesh,
      },
    },
    heroes: {
      sla_alluress_shadow: {
        name: 'Alluress (Shadows)',
        spellLore: SpellLores.shadows,
      },
      sla_alluress_slaanesh: {
        name: 'Alluress (Slaanesh)',
        spellLore: SpellLores.slaanesh,
      },
      sla_cultist: {
        name: 'Cultist of Slaanesh',
      },
      chs_sorcerer_shadows_msla: {
        name: 'Chaos Sorcerer of Slaanesh (Shadows)',
        spellLore: SpellLores.shadows,
      },
      chs_sorcerer_slaanesh_msla: {
        name: 'Chaos Sorcerer of Slaanesh (Slaanesh)',
        spellLore: SpellLores.slaanesh,
      },
    },
  },

  tze_tzeentch: {
    lords: {
      tze_the_changeling: {
        name: 'The Changeling',
        spellLore: SpellLores.tzeentch,
      },
      tze_kairos: {
        name: 'Kairos Fateweaver',
        spellLore: SpellLores.mixed,
      },
      chs_lord_mtze: { name: 'Chaos Lord of Tzeentch' },
      chs_sorcerer_lord_metal_mtze: {
        name: 'Chaos Sorcerer Lord of Tzeentch (Metal)',
        spellLore: SpellLores.metal,
      },
      chs_sorcerer_lord_tzeentch_mtze: {
        name: 'Chaos Sorcerer Lord of Tzeentch (Tzeentch)',
        spellLore: SpellLores.tzeentch,
      },
      chs_daemon_prince_tzeentch: {
        name: 'Daemon Prince of Tzeentch',
        spellLore: SpellLores.mixed,
      },
      tze_herald_of_tzeentch_metal: {
        name: 'Herald of Tzeentch (Metal)',
        spellLore: SpellLores.metal,
      },
      tze_herald_of_tzeentch_tzeentch: {
        name: 'Herald of Tzeentch (Tzeentch)',
        spellLore: SpellLores.tzeentch,
      },
      tze_exalted_lord_of_change_metal: {
        name: 'Exalted Lord of Change (Metal)',
        spellLore: SpellLores.metal,
      },
      tze_exalted_lord_of_change_tzeentch: {
        name: 'Exalted Lord of Change (Tzeentch)',
        spellLore: SpellLores.tzeentch,
      },
    },
    heroes: {
      tze_aekold_helbrass: { name: 'Aekold Helbrass' },
      tze_blue_scribes: {
        name: 'The Blue Scribes',
        spellLore: SpellLores.mixed,
      },
      chs_sorcerer_metal_mtze: {
        name: 'Chaos Sorcerer of Tzeentch (Metal)',
        spellLore: SpellLores.metal,
      },
      chs_sorcerer_tzeentch_mtze: {
        name: 'Chaos Sorcerer of Tzeentch (Tzeentch)',
        spellLore: SpellLores.tzeentch,
      },
      tze_cultist: {
        name: 'Cultist of Tzeentch',
        spellLore: SpellLores.fire,
      },
      chs_exalted_hero_mtze: { name: 'Exalted Hero of Tzeentch' },
      tze_iridescent_horror_metal: {
        name: 'Iridescent Horror (Metal)',
        spellLore: SpellLores.metal,
      },
      tze_iridescent_horror_tzeentch: {
        name: 'Iridescent Horror (Tzeentch)',
        spellLore: SpellLores.tzeentch,
      },
    },
  },

  chs_chaos: {
    lords: {
      chs_archaon: {
        name: 'Archaon the Everchosen',
        spellLore: SpellLores.mixed,
      },
      sla_azazel: {
        name: 'Azazel',
        spellLore: SpellLores.slaanesh,
      },
      dae_cha_be_lakor_0: {
        name: "Be'lakor",
        spellLore: SpellLores.shadows,
      },
      nur_festus: {
        name: 'Festus the Leechlord',
        spellLore: SpellLores.nurgle,
      },
      chs_kholek: {
        name: 'Kholek Suneater',
      },
      chs_sigvald: {
        name: 'Prince Sigvald the Magnificent',
      },
      kho_valkia: {
        name: 'Valkia the Bloody',
      },
      tze_vilitch: {
        name: 'Vilitch the Curseling',
        spellLore: SpellLores.tzeentch,
      },
      chs_lord: {
        name: 'Chaos Lord',
      },
      chs_lord_mkho: {
        name: 'Chaos Lord of Khorne',
      },
      chs_lord_msla: {
        name: 'Chaos Lord of Slaanesh',
      },
      chs_lord_mtze: { name: 'Chaos Lord of Tzeentch' },
      chs_sorcerer_lord_death: {
        name: 'Chaos Sorcerer Lord (Death)',
        spellLore: SpellLores.death,
      },
      chs_sorcerer_lord_fire: {
        name: 'Chaos Sorcerer Lord (Fire)',
        spellLore: SpellLores.fire,
      },
      chs_sorcerer_lord_metal: {
        name: 'Chaos Sorcerer Lord (Metal)',
        spellLore: SpellLores.metal,
      },
      chs_sorcerer_lord_shadow: {
        name: 'Chaos Sorcerer Lord (Shadows)',
        spellLore: SpellLores.shadows,
      },
      chs_sorcerer_lord_death_mnur: {
        name: 'Chaos Sorcerer Lord of Nurgle (Death)',
        spellLore: SpellLores.death,
      },
      chs_sorcerer_lord_nurgle_mnur: {
        name: 'Chaos Sorcerer Lord of Nurgle (Nurgle)',
        spellLore: SpellLores.nurgle,
      },
      chs_sorcerer_lord_metal_mtze: {
        name: 'Chaos Sorcerer Lord of Tzeentch (Metal)',
        spellLore: SpellLores.metal,
      },
      chs_sorcerer_lord_tzeentch_mtze: {
        name: 'Chaos Sorcerer Lord of Tzeentch (Tzeentch)',
        spellLore: SpellLores.tzeentch,
      },
      chs_daemon_prince_undivided: {
        name: 'Daemon Prince (Chaos Undivided)',
        spellLore: SpellLores.fire,
      },
      chs_daemon_prince_khorne: {
        name: 'Daemon Prince of Khorne',
      },
      chs_daemon_prince_nurgle: {
        name: 'Daemon Prince of Nurgle',
        spellLore: SpellLores.mixed,
      },
      chs_daemon_prince_slaanesh: {
        name: 'Daemon Prince of Slaanesh',
        spellLore: SpellLores.mixed,
      },
      chs_daemon_prince_tzeentch: {
        name: 'Daemon Prince of Tzeentch',
        spellLore: SpellLores.mixed,
      },
    },
    heroes: {
      tze_aekold_helbrass: { name: 'Aekold Helbrass' },
      chs_cha_harald_hammerstorm: {
        name: 'Harald Hammerstorm',
      },
      chs_chaos_sorcerer_death: {
        name: 'Chaos Sorcerer (Death)',
        spellLore: SpellLores.death,
      },
      chs_chaos_sorcerer_fire: {
        name: 'Chaos Sorcerer (Fire)',
        spellLore: SpellLores.fire,
      },
      chs_chaos_sorcerer_metal: {
        name: 'Chaos Sorcerer (Metal)',
        spellLore: SpellLores.metal,
      },
      chs_sorcerer_shadow: {
        name: 'Chaos Sorcerer (Shadows)',
        spellLore: SpellLores.shadows,
      },
      chs_sorcerer_shadows_msla: {
        name: 'Chaos Sorcerer of Slaanesh (Shadows)',
        spellLore: SpellLores.shadows,
      },
      chs_sorcerer_slaanesh_msla: {
        name: 'Chaos Sorcerer of Slaanesh (Slaanesh)',
        spellLore: SpellLores.slaanesh,
      },
      chs_sorcerer_metal_mtze: {
        name: 'Chaos Sorcerer of Tzeentch (Metal)',
        spellLore: SpellLores.metal,
      },
      chs_sorcerer_tzeentch_mtze: {
        name: 'Chaos Sorcerer of Tzeentch (Tzeentch)',
        spellLore: SpellLores.tzeentch,
      },
      chs_exalted_hero: {
        name: 'Exalted Hero',
      },
      chs_exalted_hero_mkho: {
        name: 'Exalted Hero of Khorne',
      },
      chs_exalted_hero_mnur: {
        name: 'Exalted Hero of Nurgle',
      },
      chs_exalted_hero_mtze: { name: 'Exalted Hero of Tzeentch' },
    },
  },
};

const vanilla3CharactersMemes = JSON.parse(JSON.stringify(vanilla3Characters));
vanilla3CharactersMemes.bst_beastmen.lords.bst_taurox.name = 'Taurox Wants Wheaties';
vanilla3CharactersMemes.emp_empire.lords.emp_karl_franz.name = 'Karl Franz - Prince and Emperor';
vanilla3CharactersMemes.emp_empire.lords.emp_boris_todbringer.name = 'Boris Bodbringer';
vanilla3CharactersMemes.vmp_vampire_counts.lords.vmp_mannfred.name = 'Mannlet von Carstein';
vanilla3CharactersMemes.vmp_vampire_counts.lords.vmp_vlad_von_carstein.name = 'Chad von Carstein';
vanilla3CharactersMemes.vmp_vampire_counts.heroes.vmp_vlad_von_carstein_hero.name = 'Chad von Carstein (Hero)';
vanilla3CharactersMemes.chs_chaos.lords.nur_festus.name = 'Festus the Chinlord';

export { vanilla3Characters, vanilla3CharactersMemes };
