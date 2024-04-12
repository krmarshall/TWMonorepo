import vanilla3Characters from '../../../../TWPData/charLists/vanilla3.json';

const vanilla3CharactersMemes = JSON.parse(JSON.stringify(vanilla3Characters));
vanilla3CharactersMemes.bst_beastmen.lords.wh2_dlc17_skill_node_set_bst_taurox.name = 'Taurox Wants Wheaties';
vanilla3CharactersMemes.emp_empire.lords.wh_main_skill_node_set_emp_karl_franz.name = 'Karl Franz - Prince and Emperor';
vanilla3CharactersMemes.emp_empire.lords.wh_dlc03_skill_node_set_emp_boris_todbringer.name = 'Boris Bodbringer';
vanilla3CharactersMemes.vmp_vampire_counts.lords.wh_main_skill_node_set_vmp_mannfred.name = 'Mannlet von Carstein';
vanilla3CharactersMemes.vmp_vampire_counts.lords.wh_dlc04_skill_node_set_vmp_vlad_von_carstein.name =
  'Chad von Carstein';
vanilla3CharactersMemes.vmp_vampire_counts.heroes.wh_dlc04_skill_node_set_vmp_vlad_von_carstein_hero.name =
  'Chad von Carstein (Hero)';
vanilla3CharactersMemes.chs_chaos.lords.wh3_dlc20_skill_node_set_nur_festus.name = 'Festus the Chinlord';

export { vanilla3Characters, vanilla3CharactersMemes };
