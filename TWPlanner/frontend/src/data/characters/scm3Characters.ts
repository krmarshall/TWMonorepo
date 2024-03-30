import { SpellLores } from '../../types/interfaces/GameInterface';

const scm3Characters = {
  brt_bretonnia: {
    lords: {
      hkrul_dolmance: { name: 'Alphonse Dolmancé' },
    },
    heroes: {},
  },

  dae_daemons: {
    lords: {},
    heroes: {
      kho_karnak: { name: 'Karanak' },
    },
  },

  chs_chaos: {
    lords: {
      hkrul_aelfric: { name: 'Aelfric' },
      hkrul_engra: { name: 'Engra Deathsword' },

      merga: { name: 'Merga Ottweiler', spellLore: SpellLores.tzeentch },
    },
    heroes: {
      kho_karnak: { name: 'Karanak' },
      magister: { name: 'Magister', spellLore: SpellLores.dark },
    },
  },

  cst_vampire_coast: {
    lords: {
      vmp_teb_commandant: { name: 'Dusk Reaver Commandant', spellLore: SpellLores.mixed },
    },
    heroes: {
      vmp_teb_captain: { name: 'Dusk Reaver Mercenary Captain', spellLore: SpellLores.mixed },
      grackul_scar_veteran_wight: { name: 'Saurus Scar Wight', spellLore: SpellLores.mixed },
    },
  },

  cth_cathay: {
    lords: { cth_yinyin: { name: 'Yin-Yin, the Sea Dragon', spellLore: SpellLores.mixed } },
    heroes: {},
  },

  def_dark_elves: {
    lords: {
      hkrul_duriath: { name: 'Duriath Helbane' },
    },
    heroes: {},
  },

  dwf_dwarfs: {
    lords: {
      hkrul_burlok: { name: 'Burlok Damminsson' },
    },
    heroes: {
      // LCCP
      hkrul_gargul: { name: 'Gargul the Gunner' },
      hkrul_rhobb: { name: 'Rhobb Grimly' },
      hkrul_shaz: { name: 'Shaz Ensun' },
      hkrul_skargel: { name: 'Skargel the Miner' },
      hkrul_thulgrim: { name: 'Thulgrim the Thief' },
      hkrul_wundal: { name: 'Wundal the Wizard' },

      // Marienburg
      hkrul_guzunda: { name: 'Guzunda Wallrattler' },
    },
  },

  emp_empire: {
    lords: {
      // Champions of Undeath
      bm_db_witch_hunter_general: { name: 'Witch Hunter Inquisitor General' },

      // Empire Seccesssionists
      hkrul_mack: { name: 'Reinhardt von Mackensen' },

      // Sigmars Heirs
      hkrul_artur: { name: 'Artur von Pretzen' },
      emp_helborg: { name: 'Kurt Helborg' },
      hun_cha_huntsmarshal_0: { name: 'Huntsman General' },

      // Marienburg
      hkrul_fooger: { name: 'Arkat Fooger' },
      hkrul_dauphine: { name: 'Camille Dauphina', spellLore: SpellLores.mixed },
      hkrul_egmond: { name: 'Egmond den Euwe', spellLore: SpellLores.mixed },
      hkrul_jk: { name: 'Jaan van de Kuypers' },
      hkrul_hendrik: { name: 'Simon Goudenkruin' },
      hkrul_fooger_caravan_master: { name: 'Dwarf Merchant Lord' },
      hkrul_lector_manann: { name: 'High Priest of Manann' },
      hkrul_fooger_dwarf_lord: { name: 'House Elder' },
      mar_caravan_master: { name: 'Merchant Lord' },
    },
    heroes: {
      // Empire Seccesssionists
      emp_sec_hans: { name: 'Hans Frankenwurter' },

      // Sigmars Heirs
      emp_sister_bertha: { name: 'Bertha Bestraufrung' },
      hkrul_egil: { name: 'Egil Durchwald' },
      emp_zintler: { name: 'Hans Zintler' },
      emp_schwartzhelm: { name: 'Ludwig Schwarzhelm' },
      emp_gold_wizard: { name: 'Alchemist (Gold Wizard)', spellLore: SpellLores.metal },
      emp_huntsmaster: { name: 'Hunt Master' },

      // Marienburg
      hkrul_arbatt: { name: 'Captain Aber Walblatt' },
      hkrul_crispijn: { name: 'Crispijn van Haagen' },
      hkrul_cross: { name: 'Captain Daefvid Maicross' },
      hkrul_guzunda: { name: 'Guzunda Wallrattler' },
      hkrul_lisette: { name: 'Lisette Leerer' },
      hkrul_harb: { name: 'Odvaal van den Huister' },
      hkrul_ogg: { name: 'Ogg the Expatriate' },
      hkrul_paldee: { name: 'Palldee Hammerbearer' },
      hkrul_pg: { name: 'Pieter de Groot' },
      hkrul_rasha: { name: 'Rashasawa' },
      hkrul_solkan: { name: 'Sword of Solkan' },
      mar_sea_wizard: { name: 'Sea Magicker', spellLore: SpellLores.mixed },
    },
  },

  grn_greenskins: {
    lords: {
      str_garbag: { name: 'Garbag', spellLore: SpellLores.lilWagh },

      frb_dark_land_orcs_legendary_lord: { name: 'Gormok the Dark Armourer' },
      frb_warboss_lord: { name: 'Dark Land Warboss' },
    },
    heroes: {
      str_garbag_spite: { name: 'Spite' },

      frb_orc_dragonrider: { name: 'Dark Land Drake Rider' },
    },
  },

  hef_high_elves: {
    lords: {
      // LCCP
      hef_calith_torinubar: { name: 'High Mage Torinubar', spellLore: SpellLores.high },
      hef_convoy: { name: 'Prince (Convoy)' },

      jbv2_hef_magister: { name: 'Magister Astrologer', spellLore: SpellLores.mixed },
    },
    heroes: {},
  },

  jbv_jade_vampires: {
    lords: {
      jbv2_xu_yaoji: { name: 'Xu Yaoji' },
      jbv_hei_lianhua: { name: 'Maiden of the Black Lotus', spellLore: SpellLores.mixed },
      jbv_witch_lord: { name: 'Ancestor Witch', spellLore: SpellLores.mixed },
      jbv_jade_blooded: { name: 'Jade-Blooded Master Warlock', spellLore: SpellLores.mixed },
      jbv_jade_blooded_a: { name: 'Jade-Blooded Master Warlock', spellLore: SpellLores.vampires },
      jbv_matron: { name: 'Jade-Blooded Matron', spellLore: SpellLores.mixed },
    },
    heroes: {
      jbv_channeler: { name: 'Channeler', spellLore: SpellLores.mixed },
      jbv_courtesan: { name: 'Jade-Blooded Courtesan' },
      jbv_jiangjun: { name: 'Jiangjun Revenant' },
      jbv_nugui: { name: 'Nü Gui' },
    },
  },

  kho_khorne: {
    lords: {
      hkrul_arbaal: { name: 'Arbaal the Undefeated' },
      hkrul_slaurith: { name: 'Lord Slaurith' },
    },
    heroes: {
      kho_karnak: { name: 'Karanak' },
    },
  },

  ksl_kislev: {
    lords: {
      ksl_shaman_amber: { name: 'Shaman (Beasts)', spellLore: SpellLores.beasts },
      ksl_shaman_jade: { name: 'Shaman (Life)', spellLore: SpellLores.life },
    },
    heroes: {
      ksl_ivan: { name: 'Ivan Radinov' },
      blade_master: { name: 'Blade Master' },
    },
  },

  nor_norsca: {
    lords: {
      hkrul_beorg: { name: 'Beorg Bearstruck' },
      hkrul_vroth: { name: 'Surtha Lenk' },
      hkrul_thorgar: { name: 'Thorgar the Blooded one' },
      hkrul_thorgar_daemon_prince: { name: 'Thorgar the Daemon Prince', spellLore: SpellLores.fire },
      hkrul_valbrand: { name: 'Valbrand Fireblade' },
      hkrul_volrik: { name: 'Volrik Clawhand' },
      rhox_volrik_chs_sorcerer_lord_tzeentch_mtze: {
        name: 'Chaos Sorcerer Lord of Tzeentch (Tzeentch)',
        spellLore: SpellLores.tzeentch,
      },
      rhox_valbrand_nor_marauder_chieftain_horde: { name: 'Marauder Chieftain' },
    },
    heroes: {
      hkrul_oerl: { name: 'Oerl the Young' },
    },
  },

  nur_nurgle: {
    lords: {
      hkrul_spew: { name: 'Orghotts Daemonspew' },
    },
    heroes: {},
  },

  ogr_ogre_kingdoms: {
    lords: {
      hkrul_hroth: { name: 'Hrothyogg' },

      str_gnoblar_head: { name: 'Head Honcho' },
    },
    heroes: {
      str_gnoblar_honcho: { name: 'Honcho' },
    },
  },

  skv_skaven: {
    lords: {
      str_crooktail_viciss: { name: 'Wastelord Viciss Baukis' }, // Crooktail

      str_skarrik: { name: 'Skarrik Spinemanglr' }, // Fester

      str_nelrich: { name: 'Nelrich the Suppurater' }, // Feesik
      str_feesik_plague_lord: { name: 'Lesser Plague Lord' },
      str_feesik_plague_lord_sling: { name: 'Lesser Plague Lord (Sling)' },

      // str_bileflesh: { name: 'Puskab Bileflesh' }, // Flem

      str_gangrous_szik: { name: 'Szik Vilepot' }, // Gangrous
      str_gangrous_plague_lord: { name: 'Imperator' },

      nathan_rat: { name: 'Rathan', spellLore: SpellLores.slaanesh }, // Grudge
      str_grudge_sybarite_shadows: { name: 'Sybarite (Shadows)', spellLore: SpellLores.shadows },
      str_grudge_sybarite_slaanesh: { name: 'Sybarite (Slaanesh)', spellLore: SpellLores.slaanesh },

      str_kreepus_misericorde: { name: 'Misericorde of Mordheim', spellLore: SpellLores.mixed }, //Kreepus
      str_kreepus_tsinge: { name: 'Shen Tsinge', spellLore: SpellLores.stealth },
      str_kreepus_stalkscent: { name: 'Shiwan Stalkscent' },
      str_kreepus_eshin_sorcerer_lord: { name: 'Eshin Sorcerer Lord', spellLore: SpellLores.stealth },

      str_treecherik_gristl: { name: 'Gristl Twitchslice' }, // Treecherik

      str_tenscratch: { name: 'Blight Tenscratch' }, // Verms
      str_verms_swarmleader: { name: 'Swarmleader' },

      clan_vrrtkin_lord_trikstab: { name: 'Trikstab Gribnode' }, // Vrrtkin

      bc_nurglitch: { name: 'Arch Plague Lord Nurglitch', spellLore: SpellLores.skvPlague }, // Pestilent Brotherhood
      str_skittice: { name: 'Grrzk Roteye' },
      str_pontifex_sitch: { name: 'Arch-Pontifex Sitch', spellLore: SpellLores.skvPlague },
      str_poxtooth: { name: 'Poxtooth, Befouler of Sotek', spellLore: SpellLores.skvPlague },
      bc_the_hidden: { name: 'The Hidden', spellLore: SpellLores.skvPlague },
      bc_plague_lord: { name: 'Plague Lord' },
      bc_plague_pontifex: { name: 'Plague Pontifex', spellLore: SpellLores.skvPlague },
      bc_skrimanx: { name: 'Archdeacon of Disease Lord Skrimanx' },
      bc_gritch: { name: 'Great Potentate of Pustules Lord Gritch' },
      bc_kreegrix: { name: 'The Ravener Lord Kreegrix' },
      bc_blistrox: { name: 'Spreader of the Word Lord Blistrox', spellLore: SpellLores.skvPlague },
      bc_grilok: { name: 'Pontifex of Plagues Lord Grilok', spellLore: SpellLores.skvPlague },
    },
    heroes: {
      str_kreepus_gnawlitch: { name: 'Gnawlitch Shun', spellLore: SpellLores.ruin }, // Kreepus
      str_kreepus_fellpaw: { name: 'Skulk Fellpaw' },
      str_kreepus_eshin_sorcerer: { name: 'Eshin Sorcerer (Warplock Pistol)', spellLore: SpellLores.mixed },

      str_verms_swarmcaller: { name: 'Swarmcaller' }, // Verms

      clan_vrrtkin_masterglobe: { name: 'Vrrtkin Master Globadier', spellLore: SpellLores.mixed }, // Vrrtkin

      bc_festering_chantor: { name: 'Festering Chantor' }, // Pestilent Brotherhood
      bc_stinking_thing: { name: 'Stinking Thing' },
    },
  },

  tmb_tomb_kings: {
    lords: {
      // LCCP
      hkrul_karitamen: { name: 'Lord Karitamen', spellLore: SpellLores.nehekhara },

      // TKE
      tmb_sea: { name: 'King Amenemhetum', spellLore: SpellLores.deeps },
      tmb_crim: { name: 'King Imrathepis' },
      tmb_scarab: { name: 'King Nekhenaten' },
      tmb_rakaph: { name: 'Prince Rakaph III' },
      tmb_rasut: { name: 'Queen Rasut', spellLore: SpellLores.mixed },
      tmb_rhupesh: { name: 'King Rhupesh VII' },
      tmb_sehenesmet: { name: 'Sehenesmet, Vizier of Quatar', spellLore: SpellLores.nehekhara },
      tmb_liche_high_priest_death: { name: 'Liche High Priest (Death)', spellLore: SpellLores.death },
      tmb_liche_high_priest_light: { name: 'Liche High Priest (Light)', spellLore: SpellLores.light },
      tmb_liche_high_priest_nehekhara: { name: 'Liche High Priest (Nehekhara)', spellLore: SpellLores.nehekhara },
      tmb_arkhan: { name: 'Arkhan the Black', spellLore: SpellLores.death },
      tmb_khalida: { name: 'High Queen Khalida' },
      tmb_khatep: { name: 'Grand Hierophant Khatep', spellLore: SpellLores.nehekhara },
      tmb_settra: { name: 'Settra the Imperishable', spellLore: SpellLores.nehekhara },
      tmb_tomb_king: { name: 'Tomb King' },
      tmb_tomb_king_wakhaf: { name: 'Wakhaf of the First Dynasty' },
      tmb_tomb_king_rakhash: { name: 'Rakhash of the Second Dynasty' },
      tmb_tomb_king_thutep: { name: 'Thutep of the Third Dynasty' },
      tmb_tomb_king_lahmizzash: { name: 'Lahmizzash of the Fourth Dynasty	' },
      tmb_tomb_king_setep: { name: 'Setep of the Fifth Dynasty' },
      tmb_tomb_king_alkhazzar_ii: { name: 'Alkhazzar II of the Sixth Dynasty' },
    },
    heroes: {
      // TKE
      loki_apophas: { name: 'Prince Apophas' },
      loki_nekaph: { name: 'Herald Nekaph' },
      tmb_necrotect: { name: 'Necrotect' },
    },
  },

  vmp_vampire_counts: {
    lords: {
      // Marienburg
      hkrul_mundvard: { name: 'Mundvard the Cruel', spellLore: SpellLores.mixed },
      hkrul_slaver: { name: 'Master Slavetrader', spellLore: SpellLores.vampires },
      jian_xiu_necro: { name: 'Yuwei Ha Feng', spellLore: SpellLores.mixed },
      jade_shugegnan: { name: 'Jade-Blooded Shugengan', spellLore: SpellLores.yin },

      // Champions of Undeath
      bm_abhorash_com: { name: 'Abhorash', spellLore: SpellLores.mixed },
      soggy_duke: { name: 'The Abyssal Revenant', spellLore: SpellLores.mixed },
      soggy_duke_prince: { name: 'The Abyssal Revenant: Ascended', spellLore: SpellLores.mixed },
      anark_von_carstein: { name: 'Anark von Carstein', spellLore: SpellLores.mixed },
      wallach_harkon: { name: 'Walach Harkon', spellLore: SpellLores.mixed },
      bm_bd_lord: { name: 'Blood Dragon Lord', spellLore: SpellLores.mixed },
      bm_dg_lord: { name: 'Depth Guard Lord', spellLore: SpellLores.mixed },
      bm_dt_lord: { name: 'Drakenhof Templar Lord', spellLore: SpellLores.mixed },
      vlad_bm_dt_lord: { name: 'Drakenhof Templar Lord (Vlad)', spellLore: SpellLores.mixed },

      // DotD
      dotd_master_necromancer: { name: 'Master Necromancer', spellLore: SpellLores.vampires },

      // LCCP
      hkrul_zach: { name: 'Zacharias the Everliving', spellLore: SpellLores.mixed },
    },
    heroes: {
      // Marienburg
      hkrul_alicia: { name: 'Alicia von Unterwald', spellLore: SpellLores.shadows },
      astrolicher_theak: { name: 'Dusk Wight', spellLore: SpellLores.mixed },

      // Champions of Undeath
      bm_abhorash_sh: { name: 'Abhorash: Sword and Shield', spellLore: SpellLores.mixed },
      bm_abhorash_dms: { name: 'Abhorash: Spear and Mace', spellLore: SpellLores.mixed },
      bm_abhorash_2hs: { name: 'Abhorash: Two Handed Sword', spellLore: SpellLores.mixed },
      bm_abhorash_2ha: { name: 'Abhorash: Two Handed Axe', spellLore: SpellLores.mixed },
      // bm_abhorash_2hp: { name: 'Abhorash: Pole Arm', spellLore: SpellLores.mixed },
      albrecht_rictus: { name: 'Albrecht Nictus' },
      black_grail_knight: { name: 'Black Grail Knights' },
      jade_blooded_vmp_dragon: { name: 'The Jade Daimyo', spellLore: SpellLores.mixed },
      ovn_khaled: { name: 'Khaled al Muntasir', spellLore: SpellLores.mixed },
      blood_dragon_kastellan: { name: 'The Last Kastellan', spellLore: SpellLores.mixed },
      cou_mikael_harkon: { name: 'Mikael Harkon', spellLore: SpellLores.mixed },
      rabe_bkc: { name: 'Rabe von Stahl', spellLore: SpellLores.mixed },
      tiberius_kael: { name: 'Tiberius Kael', spellLore: SpellLores.mixed },
      xxaggon_xugndhri: { name: 'Xxaggon Xugndhri', spellLore: SpellLores.mixed },
      bloodkin_squire: { name: 'Bloodkin Aspirant', spellLore: SpellLores.vampires },
      vlad_bloodkin_squire: { name: 'Von Carstein Aspirant', spellLore: SpellLores.vampires },
      blood_knight_champion: { name: 'Blood Dragon Champion', spellLore: SpellLores.mixed },
      depth_guard_champion: { name: 'Depth Guard Champion', spellLore: SpellLores.mixed },
      drakenhof_templar_champion: { name: 'Drakenhof Templar Champion', spellLore: SpellLores.mixed },
      vlad_drakenhof_templar_champion: { name: 'Drakenhof Templar Champion (Vlad)', spellLore: SpellLores.mixed },
      shaggoth_wight: { name: 'Skeleton Shaggoth Wight' },
      vlad_simp_agent: { name: 'Von Carstein Noble', spellLore: SpellLores.mixed },

      // DotD
      dotd_vmp_necromancer: { name: 'Necromancer', spellLore: SpellLores.vampires },
      dotd_wight_king: { name: 'Wight King' },
    },
  },

  wef_wood_elves: {
    lords: {
      hkrul_sceolan: { name: 'Sceolan' },
      sceolan_wef_spellweaver_ice: { name: 'Spellweaver (Ice)', spellLore: SpellLores.ice },
    },
    heroes: {
      sceolan_wef_spellsinger_ice: { name: 'Spellsinger (Ice)', spellLore: SpellLores.ice },
    },
  },

  str_rotblood: {
    lords: {
      str_bodvarr: { name: 'Bödvarr Ribspreader' },
      str_burblespue: { name: 'Burblespue Halescourge', spellLore: SpellLores.mixed },
      str_rotblood_blessed: { name: 'Blessed' },
      str_rotblood_caster_death: { name: 'Shaman Lord (Death)', spellLore: SpellLores.death },
      str_rotblood_caster_nurgle: { name: 'Shaman Lord (Nurgle)', spellLore: SpellLores.nurgle },
    },
    heroes: {
      str_rotblood_blightstorm_hero: { name: 'Greater Blightstormer', spellLore: SpellLores.death },
      str_rotblood_lifeleech_hero: { name: 'Greater Lifeleech', spellLore: SpellLores.nurgle },
      str_rotblood_eternal: { name: 'Rotblood Eternal' },
    },
  },
};

export default scm3Characters;
