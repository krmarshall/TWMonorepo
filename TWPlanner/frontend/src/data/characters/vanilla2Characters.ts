import vanilla2Characters from './vanilla2.json';

const vanilla2CharactersMemes = JSON.parse(JSON.stringify(vanilla2Characters));
vanilla2CharactersMemes.bst_beastmen.lords.wh2_dlc17_skill_node_set_bst_taurox.name = 'Taurox Wants Wheaties';
vanilla2CharactersMemes.emp_empire.lords.wh_main_skill_node_set_emp_karl_franz.name = 'Karl Franz - Prince and Emperor';
vanilla2CharactersMemes.emp_empire.lords.wh_dlc03_skill_node_set_emp_boris_todbringer.name = 'Boris Bodbringer';
vanilla2CharactersMemes.vmp_vampire_counts.lords.wh_main_skill_node_set_vmp_mannfred.name = 'Mannlet von Carstein';
vanilla2CharactersMemes.vmp_vampire_counts.lords.wh_dlc04_skill_node_set_vmp_vlad_von_carstein.name =
  'Chad von Carstein';

export { vanilla2Characters, vanilla2CharactersMemes };
