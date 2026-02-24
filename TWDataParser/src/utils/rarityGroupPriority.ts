export const rarityGroupPriority = (rarityGroups: Array<string>): string | undefined => {
  const rarityPrio = {
    wh_main_anc_group_unique: 5,
    wh_main_anc_group_rare: 4,
    wh_main_anc_group_uncommon: 3,
    wh_main_anc_group_common: 2,
    wh_main_anc_group_crafted: 1,
    wh2_dlc17_anc_group_rune: 0,
  };
  let highestPrio = 0;
  let highestGroup: string | undefined;
  rarityGroups.forEach((group) => {
    if (rarityPrio[group] > highestPrio) {
      highestPrio = rarityPrio[group];
      highestGroup = group;
    }
  });
  return highestGroup;
};
