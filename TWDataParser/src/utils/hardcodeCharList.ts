import { CharacterListInterface } from '../@types/CharacterListInterface';
import { SpellLores } from '../@types/SpellLoresRef';

export const hardcodeNames = (characterList: CharacterListInterface) => {
  Object.keys(characterList).forEach((subcultureKey) => {
    Object.keys(characterList[subcultureKey].lords).forEach((lordKey) => {
      if (hardCodeNameData[lordKey] !== undefined) {
        characterList[subcultureKey].lords[lordKey].name = hardCodeNameData[lordKey].name;
        if (hardCodeNameData[lordKey].priority) {
          characterList[subcultureKey].lords[lordKey].priority = true;
        } else if (hardCodeNameData[lordKey].priority === false) {
          characterList[subcultureKey].lords[lordKey].depriority = true;
        }
      }
    });
    Object.keys(characterList[subcultureKey].heroes).forEach((heroKey) => {
      if (hardCodeNameData[heroKey] !== undefined) {
        characterList[subcultureKey].heroes[heroKey].name = hardCodeNameData[heroKey].name;
        if (hardCodeNameData[heroKey].priority) {
          characterList[subcultureKey].heroes[heroKey].priority = true;
        } else if (hardCodeNameData[heroKey].priority === false) {
          characterList[subcultureKey].heroes[heroKey].depriority = true;
        }
      }
    });
  });
};

export const hardcodePortraits = (characterList: CharacterListInterface) => {
  Object.keys(characterList).forEach((subcultureKey) => {
    Object.keys(characterList[subcultureKey].lords).forEach((lordKey) => {
      if (hardcodePortraitData[lordKey] !== undefined) {
        characterList[subcultureKey].lords[lordKey].portrait = hardcodePortraitData[lordKey];
      }
    });
    Object.keys(characterList[subcultureKey].heroes).forEach((heroKey) => {
      if (hardcodePortraitData[heroKey] !== undefined) {
        characterList[subcultureKey].heroes[heroKey].portrait = hardcodePortraitData[heroKey];
      }
    });
  });
};

const regexp = /\((?<loreName>[a-zA-Z]*)\)/;
export const hardcodeSpellLores = (characterList: CharacterListInterface) => {
  Object.keys(characterList).forEach((subcultureKey) => {
    Object.keys(characterList[subcultureKey].lords).forEach((lordKey) => {
      if (hardcodeSpellLoreData[lordKey] !== undefined) {
        characterList[subcultureKey].lords[lordKey].spellLore = hardcodeSpellLoreData[lordKey];
      } else {
        const loreName = characterList[subcultureKey].lords[lordKey].name.match(regexp)?.groups?.loreName.toLowerCase();
        if (loreName !== undefined && SpellLores[loreName as keyof typeof SpellLores] !== undefined)
          characterList[subcultureKey].lords[lordKey].spellLore = SpellLores[loreName as keyof typeof SpellLores];
      }
    });
    Object.keys(characterList[subcultureKey].heroes).forEach((heroKey) => {
      if (hardcodeSpellLoreData[heroKey] !== undefined) {
        characterList[subcultureKey].heroes[heroKey].spellLore = hardcodeSpellLoreData[heroKey];
      } else {
        const loreName = characterList[subcultureKey].heroes[heroKey].name.match(regexp)?.groups?.loreName.toLowerCase();
        if (loreName !== undefined && SpellLores[loreName as keyof typeof SpellLores] !== undefined)
          characterList[subcultureKey].heroes[heroKey].spellLore = SpellLores[loreName as keyof typeof SpellLores];
      }
    });
  });
};

const hardCodeNameData: { [nodeSetKey: string]: { name: string; priority?: boolean } } = {
  wh_main_skill_node_set_raknik: { name: 'Raknik Spiderclaw', priority: false },
  wh_main_skill_node_set_oglok: { name: "Oglok the 'Orrible", priority: false },
  wh2_dlc09_skill_node_set_tmb_tomb_king_alkhazzar_ii: { name: 'Alkhazzar II of the Sixth Dynasty', priority: false },
  wh2_dlc09_skill_node_set_tmb_tomb_king_lahmizzash: { name: 'Lahmizzash of the Fourth Dynasty', priority: false },
  wh2_dlc09_skill_node_set_tmb_tomb_king_rakhash: { name: 'Rakhash of the Second Dynasty', priority: false },
  wh2_dlc09_skill_node_set_tmb_tomb_king_setep: { name: 'Setep of the Fifth Dynasty', priority: false },
  wh2_dlc09_skill_node_set_tmb_tomb_king_thutep: { name: 'Thutep of the Third Dynasty', priority: false },
  wh2_dlc09_skill_node_set_tmb_tomb_king_wakhaf: { name: 'Wakhaf of the First Dynasty', priority: false },
  wh2_dlc_11_skill_node_set_cst_admiral_tech_01: { name: 'Trusty Montford (Polearm - Vampires)', priority: false },
  wh2_dlc_11_skill_node_set_cst_admiral_tech_02: { name: "O'Bones Macdonald (Polearm - Deep)", priority: false },
  wh2_dlc_11_skill_node_set_cst_admiral_tech_03: { name: 'Burke Black (Polearm - Death)', priority: false },
  wh2_dlc_11_skill_node_set_cst_admiral_tech_04: { name: 'Two Toes Adley (Pistol - Deep)', priority: false },
  wh2_dlc17_node_set_vmp_kevon_lloydstein: { name: 'Kevin von Lloydstein', priority: true },

  dread_traitor_tomb_king_nebwaneph: { name: 'Traitor King Nebwaneph' },
  dread_traitor_tomb_king_omanhan_iii: { name: 'Traitor King Omanhan III' },
  bc_skrimanx: { name: 'Archdeacon of Disease Lord Skrimanx', priority: false },
  bc_gritch: { name: 'Great Potentate of Pustules Lord Gritch', priority: false },
  bc_kreegrix: { name: 'The Ravener Lord Kreegrix', priority: false },
  bc_blistrox: { name: 'Spreader of the Word Lord Blistrox', priority: false },
  bc_grilok: { name: 'Pontifex of Plagues Lord Grilok', priority: false },
};

export const hardcodePortraitData: { [nodeSetKey: string]: string } = {
  wh_dlc06_skill_node_set_dwf_thane_ghost_2: 'dwf_thane_ghost_02_0',
  wh2_dlc15_skill_node_set_hef_archmage_beasts: 'hef_archmage_campaign_01_0',
  wh2_dlc15_skill_node_set_hef_archmage_death: 'hef_archmage_campaign_01_0',
  wh2_dlc15_skill_node_set_hef_archmage_fire: 'hef_archmage_campaign_01_0',
  wh2_dlc15_skill_node_set_hef_archmage_heavens: 'hef_archmage_campaign_01_0',
  wh2_dlc15_skill_node_set_hef_archmage_life: 'hef_archmage_campaign_01_0',
  wh2_dlc15_skill_node_set_hef_archmage_light: 'hef_archmage_campaign_01_0',
  wh2_dlc15_skill_node_set_hef_archmage_metal: 'hef_archmage_campaign_01_0',
  wh2_dlc15_skill_node_set_hef_archmage_shadows: 'hef_archmage_campaign_01_0',
  wh2_dlc15_skill_node_set_hef_mage_beasts: 'hef_mage_campaign_01_0',
  wh2_dlc15_skill_node_set_hef_mage_death: 'hef_mage_campaign_01_0',
  wh2_dlc15_skill_node_set_hef_mage_fire: 'hef_mage_campaign_01_0',
  wh2_dlc10_skill_node_set_hef_mage_heavens: 'hef_mage_campaign_01_0',
  wh2_main_skill_node_set_hef_mage_life: 'hef_mage_campaign_01_0',
  wh2_main_skill_node_set_hef_mage_light: 'hef_mage_campaign_01_0',
  wh2_dlc15_skill_node_set_hef_mage_metal: 'hef_mage_campaign_01_0',
  wh2_dlc10_skill_node_set_hef_mage_shadows: 'hef_mage_campaign_01_0',
  wh3_main_skill_node_set_ksl_ice_witch_tempest: 'ksl_ice_witch_campaign_01_0',
  wh2_main_skill_node_set_lzd_slann_mage_priest_beasts: 'lzd_slann_campaign_01_0',
  wh2_main_skill_node_set_lzd_slann_mage_priest_death: 'lzd_slann_campaign_01_0',
  wh2_main_skill_node_set_lzd_slann_mage_priest_metal: 'lzd_slann_campaign_01_0',
  wh2_main_skill_node_set_lzd_slann_mage_priest_shadows: 'lzd_slann_campaign_01_0',
  wh2_main_skill_node_set_lzd_slann_mage_priest_fire: 'lzd_slann_campaign_01_0',
  wh2_main_skill_node_set_lzd_slann_mage_priest_heavens: 'lzd_slann_campaign_01_0',
  wh2_main_skill_node_set_lzd_slann_mage_priest_high: 'lzd_slann_campaign_01_0',
  wh2_main_skill_node_set_lzd_slann_mage_priest_life: 'lzd_slann_campaign_01_0',
  wh_dlc08_skill_node_set_nor_shaman_sorcerer_fire: 'nor_cha_shaman_sorcerer_campaign_01_0',
  wh_dlc08_skill_node_set_nor_shaman_sorcerer_metal: 'nor_cha_shaman_sorcerer_campaign_01_0',
  wh2_dlc_11_skill_node_set_cst_admiral_tech_03: 'cst_vampire_fleet_admiral_male_campaign_01_0',
  wh2_dlc_11_skill_node_set_cst_admiral_tech_02: 'cst_vampire_fleet_admiral_male_campaign_01_0',
  wh2_dlc16_skill_node_set_wef_spellweaver_dark: 'wef_spellweaver_campaign_01_0',
  wh2_dlc16_skill_node_set_wef_spellweaver_high: 'wef_spellweaver_campaign_01_0',
  wh2_dlc16_skill_node_set_wef_spellweaver_life: 'wef_spellweaver_campaign_01_0',
  wh2_dlc16_skill_node_set_wef_spellweaver_shadows: 'wef_spellweaver_campaign_01_0',
  wh_dlc05_skill_node_set_wef_spellsinger_life: 'wef_spellsinger_campaign_01_0',
  wh_dlc05_skill_node_set_wef_spellsinger_shadow: 'wef_spellsinger_campaign_01_0',

  Helgar_longplaits: 'helgar_longplaits',
  skill_node_set_hkrul_erkstein: 'hkrul_erkstein',
  skill_node_set_hkrul_gunter: 'hkrul_gunter',
  skill_node_set_hkrul_aldred: 'hkrul_aldred',
  dread_possessed_hero_02: 'dread_possessed_hero_02',
  skill_node_set_hkrul_guzunda: 'hkrul_guzunda',
  skill_node_set_hkrul_egmond: 'hkrul_mar_egmond',
  skill_node_set_hkrul_jk: 'hkrul_jk',
  skill_node_set_hkrul_mack: 'hkrul_mack',
  skill_node_set_hkrul_hendrik: 'hkrul_hendrik',
  skill_node_set_hkrul_lector_manann: 'hkrul_lector_manann_1',
  skill_node_set_mar_caravan_master: 'hrul_mar_caravan_commander_06',
  bm_db_witch_hunter_general_Set: 'bm_db_witch_hunter_general_campaign_01',
  skill_node_set_hkrul_cross: 'hkrul_cross',
  skill_node_set_hkrul_crispijn: 'hkrul_crispijn',
  skill_node_set_hkrul_lisette: 'hkrul_lisette',
  skill_node_set_hkrul_harb: 'hkrul_harb',
  skill_node_set_hkrul_pg: 'hkrul_pg',
  skill_node_set_hkrul_solkan: 'hkrul_solkan_1',
  cth_yinyin_nodeset: 'cth_yinyin_campaign',
  skill_node_set_hkrul_slaver: 'hkrul_slaver_1',
  skill_node_set_hkrul_alicia: 'hkrul_alicia',
  shaggoth_wight_set: 'shaggoth_wight_hero_01_0',
  vlad_simp_agent_set: 'vlad_simps_rejoice_01_0',
  jbv_hei_lianhua_nodeset: 'jbv_hei_lianhua',
  jbv_nugui_node_set: 'jbv_nugui_01',
};

const hardcodeSpellLoreData: { [nodeSetKey: string]: SpellLores } = {
  wh_dlc03_skill_node_set_bst_malagor: SpellLores.mixed,
  wh_dlc07_skill_node_set_brt_fay_enchantress: SpellLores.life,
  wh3_dlc23_skill_node_set_chd_astragoth: SpellLores.mixed,
  wh3_dlc23_skill_node_set_chd_drazhoath: SpellLores.hashut,
  wh3_main_skill_node_set_dae_cha_be_lakor_0: SpellLores.shadows,
  wh2_main_skill_node_set_def_malekith: SpellLores.dark,
  wh2_main_skill_node_set_def_morathi: SpellLores.mixed,
  wh_dlc17_skill_node_set_dwf_thorek: SpellLores.runic,
  wh_dlc06_skill_node_set_dwf_runelord: SpellLores.runic,
  wh_main_skill_node_set_all_runesmith: SpellLores.runic,
  wh_dlc06_skill_node_set_dwf_runesmith_ghost: SpellLores.runic,
  wh_main_skill_node_set_emp_balthasar: SpellLores.metal,
  wh3_dlc23_skill_node_set_ksl_ulrika: SpellLores.shadows,
  wh_dlc03_skill_node_set_emp_amber_wizard: SpellLores.beasts,
  wh2_pro07_skill_node_set_emp_amethyst_wizard: SpellLores.death,
  wh_main_skill_node_set_emp_bright_wizard: SpellLores.fire,
  wh_main_skill_node_set_emp_celestial_wizard: SpellLores.heavens,
  wh_dlc05_skill_node_set_grey_wizard: SpellLores.shadows,
  wh_dlc05_skill_node_set_jade_wizard: SpellLores.life,
  wh_main_skill_node_set_emp_light_wizard: SpellLores.light,
  wh3_main_skill_node_set_cth_miao_ying: SpellLores.mixed,
  wh3_dlc24_skill_node_set_cth_yuan_bo: SpellLores.mixed,
  wh3_main_skill_node_set_cth_zhao_ming: SpellLores.mixed,
  wh3_main_skill_node_set_cth_alchemist: SpellLores.metal,
  wh3_main_skill_node_set_cth_astromancer: SpellLores.heavens,
  wh_main_skill_node_set_grn_azhag: SpellLores.death,
  wh_dlc06_skill_node_set_grn_wurrzag_da_great_prophet: SpellLores.bigWagh,
  wh_main_skill_node_set_raknik: SpellLores.lilWagh,
  wh_main_skill_node_set_grn_goblin_great_shaman: SpellLores.lilWagh,
  wh_main_skill_node_set_grn_night_goblin_shaman: SpellLores.lilWagh,
  wh_main_skill_node_set_grn_orc_shaman: SpellLores.bigWagh,
  wh2_dlc15_skill_node_set_grn_river_troll_hag: SpellLores.death,
  wh2_dlc15_skill_node_set_hef_eltharion: SpellLores.high,
  wh2_main_skill_node_set_hef_teclis: SpellLores.mixed,
  wh2_main_skill_node_set_hef_loremaster_of_hoeth: SpellLores.mixed,
  wh3_main_skill_node_set_ksl_katarin: SpellLores.ice,
  wh3_dlc24_skill_node_set_ksl_mother_ostankya: SpellLores.hag,
  wh2_main_skill_node_set_lzd_lord_mazdamundi: SpellLores.mixed,
  wh2_dlc12_skill_node_set_lzd_tehenhauin: SpellLores.beasts,
  wh2_dlc12_skill_node_set_lzd_lord_kroak: SpellLores.mixed,
  wh2_dlc17_skill_node_set_lzd_skink_oracle: SpellLores.mixed,
  wh_dlc08_skill_node_set_nor_arzik: SpellLores.tzeentch,
  wh3_main_ie_skill_node_set_nor_burplesmirk_spewpit: SpellLores.nurgle,
  wh_dlc08_skill_node_set_nor_kihar: SpellLores.slaanesh,
  wh3_main_skill_node_set_nur_kugath: SpellLores.nurgle,
  wh3_dlc20_skill_node_set_chs_daemon_prince_nurgle: SpellLores.mixed,
  wh3_main_skill_node_set_ogr_skrag_the_slaughterer: SpellLores['great maw'],
  wh3_main_skill_node_set_ogr_firebelly: SpellLores.fire,
  wh2_dlc12_skill_node_set_ikit_claw: SpellLores.ruin,
  wh2_main_skill_node_set_skv_lord_skrolk: SpellLores.plague,
  wh2_dlc12_skill_node_set_skv_warlock_master: SpellLores.ruin,
  wh2_main_skill_node_set_skv_warlock_engineer: SpellLores.ruin,
  wh2_main_skill_node_set_skv_plague_priest: SpellLores.plague,
  wh2_dlc14_skill_node_set_skv_eshin_sorcerer: SpellLores.stealth,
  wh3_main_skill_node_set_sla_nkari: SpellLores.slaanesh,
  wh3_dlc20_skill_node_set_chs_daemon_prince_slaanesh: SpellLores.mixed,
  wh2_dlc09_skill_node_set_tmb_arkhan: SpellLores.death,
  wh2_dlc09_skill_node_set_tmb_khatep: SpellLores.nehekhara,
  wh2_dlc09_skill_node_set_tmb_settra: SpellLores.nehekhara,
  wh3_dlc24_skill_node_set_tze_the_changeling: SpellLores.tzeentch,
  wh3_main_skill_node_set_tze_kairos: SpellLores.mixed,
  wh3_dlc20_skill_node_set_chs_daemon_prince_tzeentch: SpellLores.mixed,
  wh3_dlc24_skill_node_set_tze_blue_scribes: SpellLores.mixed,
  wh3_main_skill_node_set_tze_cultist: SpellLores.fire,
  wh2_dlc11_skill_node_set_cst_cylostra: SpellLores.deep,
  wh2_dlc11_skill_node_set_cst_noctilus: SpellLores.mixed,
  wh2_dlc11_skill_node_set_cst_admiral_fem_death: SpellLores.death,
  wh2_dlc11_skill_node_set_cst_admiral_fem_deep: SpellLores.deep,
  wh2_dlc_11_skill_node_set_cst_admiral_tech_04: SpellLores.deep,
  wh2_dlc11_skill_node_set_cst_admiral_fem: SpellLores.vampires,
  wh2_dlc11_skill_node_set_cst_admiral_death: SpellLores.death,
  wh2_dlc_11_skill_node_set_cst_admiral_tech_03: SpellLores.death,
  wh2_dlc11_skill_node_set_cst_admiral_deep: SpellLores.deep,
  wh2_dlc_11_skill_node_set_cst_admiral_tech_02: SpellLores.deep,
  wh2_dlc_11_skill_node_set_cst_admiral_tech_01: SpellLores.vampires,
  wh2_dlc11_skill_node_set_cst_admiral: SpellLores.vampires,
  wh_main_skill_node_set_vmp_heinrich: SpellLores.vampires,
  wh_dlc04_skill_node_set_vmp_helman_ghorst: SpellLores.vampires,
  wh_pro02_skill_node_set_vmp_isabella_von_carstein: SpellLores.vampires,
  wh_main_skill_node_set_vmp_mannfred: SpellLores.vampires,
  wh_dlc05_skill_node_set_vmp_red_duke: SpellLores.vampires,
  wh_dlc04_skill_node_set_vmp_vlad_von_carstein: SpellLores.vampires,
  wh2_dlc11_skill_node_set_vmp_bloodline_blood_dragon_lord: SpellLores.vampires,
  wh2_dlc11_skill_node_set_vmp_bloodline_lahmian_lord: SpellLores.mixed,
  wh2_dlc11_skill_node_set_vmp_bloodline_necrarch_lord: SpellLores.mixed,
  wh2_dlc11_skill_node_set_vmp_bloodline_strigoi_lord: SpellLores.mixed,
  wh2_dlc11_skill_node_set_vmp_bloodline_von_carstein_lord: SpellLores.mixed,
  wh_main_skill_node_set_vmp_master_necromancer: SpellLores.vampires,
  wh_dlc04_skill_node_set_vmp_strigoi_ghoul_king: SpellLores.mixed,
  wh_main_skill_node_set_vmp_lord: SpellLores.vampires,
  wh_pro02_skill_node_set_vmp_isabella_von_carstein_hero: SpellLores.vampires,
  wh_dlc04_skill_node_set_vmp_vlad_von_carstein_hero: SpellLores.vampires,
  wh_main_skill_node_set_vmp_necromancer: SpellLores.vampires,
  wh_main_skill_node_set_chs_archaon: SpellLores.mixed,
  wh3_dlc20_skill_node_set_sla_azazel: SpellLores.slaanesh,
  wh3_dlc20_skill_node_set_nur_festus: SpellLores.nurgle,
  wh3_dlc20_skill_node_set_tze_vilitch: SpellLores.tzeentch,
  wh_dlc16_skill_node_set_wef_drycha: SpellLores.shadows,
  wh_dlc05_skill_node_set_wef_durthu: SpellLores.beasts,
  wh_dlc05_skill_node_set_wef_ancient_treeman: SpellLores.life,
  wh_dlc16_skill_node_set_wef_ariel: SpellLores.mixed,
  wh_dlc16_skill_node_set_wef_coeddil: SpellLores.mixed,
  wh_dlc05_skill_node_set_wef_branchwraith: SpellLores.mixed,

  skill_node_set_brt_cha_lost: SpellLores.mixed,
  skill_node_set_grn_cha_savageboss: SpellLores.bigWagh,
  skill_node_set_nor_cha_fimir: SpellLores.mixed,
  skill_node_set_tmb_cha_arch_liche: SpellLores.mixed,
  sm_rws_skill_node_vpr_herald_of_mathlann: SpellLores.mixed,
  sm_rws_skill_node_vpr_strigoi: SpellLores.mixed,
  mixu_skill_node_set_bst_slugtongue: SpellLores.mixed,
  mixu_skill_node_set_dwf_kragg_the_grim: SpellLores.runic,
  mixu_skill_node_set_emp_elspeth: SpellLores.death,
  mixu_skill_node_set_hef_belannaer: SpellLores.mixed,
  mixu_skill_node_set_lzd_lord_huinitenuchli: SpellLores.mixed,
  mixu_skill_node_set_lzd_tetto_eko: SpellLores.heavens,
  mixu_skill_node_set_chs_egrimm_van_horstmann: SpellLores.mixed,
  mixu_skill_node_set_cst_drekla: SpellLores.mixed,
  mixu_skill_node_set_vmp_dieter_helsnicht: SpellLores.mixed,
  mixu_skill_node_set_tze_melekh_the_changer: SpellLores.fire,
  mixu_skill_node_set_wef_naieth_the_prophetess: SpellLores.heavens,
  mixu_skill_node_set_wef_shadowdancer: SpellLores.mixed,
  mixu_node_set_msl_lady_of_the_black_grail: SpellLores.shadows,
  mixu_node_set_msl_lord: SpellLores.shadows,
  mixu_node_set_msl_aucassin_de_hane: SpellLores.mixed,
  mixu_node_set_msl_nicolete_de_oisement: SpellLores.mixed,
  str_thyrus_skills: SpellLores.fire,
  kou_aurelion_ll: SpellLores.mixed,
  str_skill_node_set_bassiano_dutra: SpellLores.death,
  kou_frob_nobber_skill_nodes_set: SpellLores.lilWagh,
  kou_talarian: SpellLores.mixed,
  dead_ice_mage: SpellLores.tempest,
  str_dazharr: SpellLores.hashut,
  str_frostmaw: SpellLores.ice,
  str_nastasya_skills: SpellLores.mixed,
  str_sssel_skills: SpellLores.slaanesh,
  str_amon_skills: SpellLores.mixed,
  str_scribes_skills: SpellLores.mixed,
  str_changeling_skills: SpellLores.tzeentch,
  str_rahtep_skills: SpellLores.mixed,
  str_obadiah: SpellLores.vampires,
  dust_gutrot_plaguefleet_captain_node_set: SpellLores.mixed,
  kraka_wardlord: SpellLores.runic,
  teb_gashnag: SpellLores.shadows,
  teb_lucrezzia_belladonna: SpellLores.death,
  allor: SpellLores.beasts,
  luther_flamenstrike: SpellLores.fire,
  ovn_grudge_skill_node_set_ksl_ice_mage_ice: SpellLores.mixed,
  wh_main_skill_node_set_emp_stormrider: SpellLores.mixed,
  wh2_main_skill_node_set_tmb_Dread_King: SpellLores.vampires,
  elo_hand_of_nagash: SpellLores.vampires,
  dread_possessed_hero_01: SpellLores.shadows,
  dread_possessed_hero_02: SpellLores.beasts,
  dread_traitor_tomb_king_haptmose: SpellLores.nehekhara,
  node_set_elo_dread_larenscheld: SpellLores.vampires,
  node_set_dural_durak: SpellLores.mixed,
  node_set_morrigan: SpellLores.mixed,
  node_set_truth_truth: SpellLores.mixed,
  node_set_albion_wizard: SpellLores.mixed,
  node_set_fimir_daemon_octopus_kroll: SpellLores.mixed,
  wh_main_skill_node_fim_meargh_skattach: SpellLores.mixed,
  elo_boglar_shaman: SpellLores.mixed,
  wh_main_skill_node_set_sultan_jaffar: SpellLores.mixed,
  wh_main_skill_node_set_arb_golden_magus: SpellLores.mixed,
  wh_main_skill_node_set_arb_vizier_desert: SpellLores.mixed,
  ovn_skill_node_set_arb_magician_desert: SpellLores.mixed,
  skill_node_set_hkrul_dauphine: SpellLores.mixed,
  skill_node_set_hkrul_egmond: SpellLores.mixed,
  emp_gold_wizard: SpellLores.metal,
  ovn_skill_node_set_mar_sea_wizard: SpellLores.mixed,
  cth_yinyin_nodeset: SpellLores.mixed,
  wh_main_skill_node_set_hef_calith_torinubar: SpellLores.high,
  jbv2_hef_magister_nodeset: SpellLores.mixed,
  skill_node_set_hkrul_thorgar: SpellLores.fire,
  rhox_volrik_chs_sorcerer_lord_tzeentch_mtze: SpellLores.tzeentch,
  nathan_rat_node_set: SpellLores.slaanesh,
  str_kreepus_misericorde: SpellLores.mixed,
  str_kreepus_tsinge: SpellLores.stealth,
  str_kreepus_eshin_sorcerer_lord: SpellLores.stealth,
  bc_nurglitch: SpellLores.plague,
  str_pontifex_sitch: SpellLores.plague,
  str_poxtooth: SpellLores.plague,
  bc_the_hidden: SpellLores.plague,
  bc_plague_pontifex: SpellLores.plague,
  bc_blistrox: SpellLores.plague,
  bc_grilok: SpellLores.plague,
  str_kreepus_gnawlitch: SpellLores.ruin,
  str_kreepus_eshin_sorcerer: SpellLores.mixed,
  clan_vrrtkin_masterglobe: SpellLores.mixed,
  skill_node_set_hkrul_karitamen: SpellLores.nehekhara,
  wh2_main_skill_node_set_tmb_sea: SpellLores.nehekhara,
  wh2_main_skill_node_set_tmb_sehenesmet: SpellLores.nehekhara,
  vmp_teb_commandant_set: SpellLores.mixed,
  vmp_teb_captain: SpellLores.mixed,
  grackul_scar_veteran_wight_set: SpellLores.mixed,
  jade_shugegnan: SpellLores.yin,
  skill_node_set_hkrul_mundvard: SpellLores.mixed,
  wallach_harkon_set: SpellLores.mixed,
  jian_xiu_necro_set: SpellLores.mixed,
  skill_node_set_hkrul_zach: SpellLores.mixed,
  bm_abhorash_com_set: SpellLores.mixed,
  anark_von_carstein_set: SpellLores.mixed,
  bm_bd_lord: SpellLores.mixed,
  bm_dg_lord: SpellLores.mixed,
  vlad_bm_dt_lord_Set: SpellLores.mixed,
  bm_dt_lord: SpellLores.mixed,
  dotd_master_necromancer: SpellLores.vampires,
  skill_node_set_hkrul_slaver: SpellLores.vampires,
  soggy_duke_skills: SpellLores.mixed,
  soggy_duke_prince_skills: SpellLores.mixed,
  skill_node_set_hkrul_alicia: SpellLores.shadows,
  astrolicher_theak: SpellLores.mixed,
  bm_abhorash_dms_set: SpellLores.mixed,
  bm_abhorash_sh_set: SpellLores.mixed,
  bm_abhorash_2ha_set: SpellLores.mixed,
  bm_abhorash_2hs_set: SpellLores.mixed,
  jade_blooded_vmp_dragon_skill_node_set: SpellLores.mixed,
  ovn_khaled_skills: SpellLores.mixed,
  blood_dragon_kastellan_set: SpellLores.mixed,
  cou_mikael_harkon_set: SpellLores.mixed,
  rabe_bkc_skills: SpellLores.mixed,
  tiberius_kael_skills: SpellLores.mixed,
  xxaggon_xugndhri_set: SpellLores.mixed,
  bloodkin_squire_set: SpellLores.vampires,
  vlad_bloodkin_squire_set: SpellLores.vampires,
  blood_knight_champion_set: SpellLores.mixed,
  depth_guard_champion_set: SpellLores.mixed,
  vlad_drakenhof_templar_champion_set: SpellLores.mixed,
  drakenhof_templar_champion_set: SpellLores.mixed,
  vlad_simp_agent_set: SpellLores.mixed,
  dotd_vmp_necromancer: SpellLores.vampires,
  merga: SpellLores.tzeentch,
  magister: SpellLores.death,
  rhox_lccp_sceolan_wef_spellweaver_ice: SpellLores.ice,
  rhox_lccp_sceolan_wef_spellsinger_ice: SpellLores.ice,
  jbv_witch_lord_nodeset: SpellLores.mixed,
  jbv_jade_blooded_nodeset: SpellLores.mixed,
  jbv_jade_blooded_a_nodeset: SpellLores.vampires,
  jbv_matron_nodeset: SpellLores.mixed,
  jbv_hei_lianhua_nodeset: SpellLores.mixed,
  jbv_channeler_node_set: SpellLores.mixed,
  str_burblespue: SpellLores.mixed,
  str_rotblood_blightstorm_hero: SpellLores.death,
  str_rotblood_lifeleech_hero: SpellLores.nurgle,
  bannaga_skill_node: SpellLores.beasts,
  vile_prince_skill_node: SpellLores.nurgle,
};
