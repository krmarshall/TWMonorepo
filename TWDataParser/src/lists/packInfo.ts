export const vanillaPackInfo = {
  vanilla2: {
    db: 'data',
    loc: 'local_en',
    imgs: ['data'],
  },
  vanilla3: {
    db: 'db',
    loc: 'local_en',
    imgs: ['data', 'data_1', 'data_2', 'data_3', 'data_bl', 'data_bm', 'data_tk', 'data_we', 'data_wp_'],
  },
};

export interface ModInfoInterface {
  pack: string;
  id: number;
  name?: string;
}

interface ModPackInfoInterface {
  [modKey: string]: Array<ModInfoInterface>;
}

export const modPackInfo: ModPackInfoInterface = {
  mixu3: [
    { pack: 'ab_mixu_legendary_lords', id: 2802810577, name: "Mixu's Legendary Lords" },
    { pack: 'ab_mixu_mousillon', id: 2985441419, name: "Mixu's Mousillon" },
    { pack: 'ab_unwashed_masses', id: 2825728189, name: 'Gnoblar Hordes - The Unwashed Masses' },
    // { pack: 'ab_mixu_slayer', id: 2853477423, name: "Mixu's Slayer" },
    { pack: 'ab_mixu_shadowdancer', id: 2933920316, name: "Mixu's Shadowdancer" },
  ],
  radious3: [
    { pack: 'Radious_WH3_Mod_Part1', id: 2791750313 },
    { pack: 'Radious_WH3_Mod_Part2', id: 2791750896 },
    { pack: 'Radious_WH3_Mod_Part3', id: 2791750075 },
    { pack: 'Radious_WH3_Mod_Part4', id: 2813892035 },
  ],
  sfo3: [{ pack: 'sfo_grimhammer_3_main', id: 2792731173 }],
  lege3: [{ pack: '!scm_legendary', id: 3305233283 }], // { pack: '!str_legendary', id: 2826930183 }
  crys3: [{ pack: 'crys_leaders', id: 2880244265 }],
  scm3: [
    { pack: '!scm_lccp', id: 3236567583, name: 'LCCP' },
    { pack: '!scm_totn', id: 3236566964, name: 'Tribes of the North' },
    { pack: 'str_skaven_clans', id: 2986543735, name: 'Skaven Clans' },
    { pack: '!scm_marienburg', id: 3030996759, name: 'Marienburg' },
    { pack: '!!!!!!Champions_of_undeath_merged_fun_tyme', id: 3022054734, name: 'Champions of Undeath' },
    { pack: 'jade_vamp_pol', id: 2880515805, name: 'JBV: Curse of Nongchang' },
    { pack: 'jade_vamp_pol_IotM', id: 3032432016, name: 'JBV: Islanders of the Moon' },
    { pack: 'AAA_dynasty_of_the_damned', id: 2991431203, name: 'Dynasty of the Damned' },
    { pack: '!xou_age_TKExtended', id: 3029928348, name: 'Tomb Kings Extended' },
    { pack: 'str_rotblood', id: 2838941228, name: 'Rotblood Tribe' },
    { pack: '@xou_emp', id: 2890463744, name: "Sigmar's Heirs" },
    { pack: '@xou_emp_assets', id: 2890463783 },
    { pack: '!scm_empire_secessionists', id: 3030410786, name: 'Empire Secessionists' },
    { pack: 'froeb_dark_land_orcs', id: 2919542060, name: 'Dark Land Orcs' },
    { pack: 'dead_cult_possessed_unit_V2', id: 2891621259, name: "Dead's Cult of the Possessed" },
    { pack: 'cth_yinyin_pol', id: 2989226363, name: 'RotJS: Yin-Yin, the Sea Dragon' },
  ],
  cat3: [
    { pack: '!ak_teb3', id: 2927296206, name: "Cataph's Southern Realms (TEB)" },
    { pack: '!ak_kraka3', id: 2878423760, name: "Cataph's Kraka Drak: the Norse Dwarfs" },
    { pack: '!ak_seapatrol', id: 2968330247, name: "Cataph's High Elf Sea Patrol" },
  ],
  ovn3: [
    { pack: 'ovn_albion', id: 2873961274, name: 'Albion' },
    { pack: 'ovn_araby', id: 3134922105, name: 'Araby' },
    { pack: 'ovn_citadel_of_dusk', id: 2950121489, name: 'Citadel of Dusk' },
    { pack: 'ovn_dread_king', id: 3016830682, name: 'Dread King Legions' },
    { pack: 'ovn_fimir', id: 2899955636, name: 'Fimir' },
    { pack: 'ovn_grudgebringers', id: 2989710828, name: 'Grudgebringers' },
  ],
  hol3: [
    { pack: '!ak_teb3', id: 2927296206 },
    { pack: 'inq_lol_hero', id: 2931087074 },
  ],
};
