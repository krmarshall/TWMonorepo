// If regex is a perf issue memoize this?
const cleanNodeSetKey = (key: string, force = false) => {
  if (process.env.NODE_ENV !== 'twdp' && force !== true) {
    return key;
  }
  const trimmedKey = key.replace(/_([sS]kills?)?(_?[nN]odes?)?(_?[sS]ets?)?$/, '');
  const keyName = trimmedKey.split(
    /node_set_|_skill_node_(?!set_)|^skill_set_|variety_agent_subtype_|wh[0-3]?_dlc[0-9]?[0-9]?_|rad_wh3_part3_main_unit_|^kou_skill_|^dust_skill_|^wh[0-3]?_pro[0-9]?[0-9]?_|^set_|rhox_lccp_/,
  );
  return keyName[keyName.length - 1];
};

export default cleanNodeSetKey;
