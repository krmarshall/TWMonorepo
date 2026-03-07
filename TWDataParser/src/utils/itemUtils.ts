import { ItemRarityEnum } from '../@types/ItemInterface.ts';

export const rarityLookup = (rarityGroup: string | undefined, uniquenessScore: number) => {
  if (rarityGroup !== undefined) {
    switch (rarityGroup) {
      case 'wh_main_anc_group_unique':
        return ItemRarityEnum.Unique;
      case 'wh_main_anc_group_rare':
        return ItemRarityEnum.Rare;
      case 'wh_main_anc_group_uncommon':
        return ItemRarityEnum.Uncommon;
      case 'wh_main_anc_group_common':
        return ItemRarityEnum.Common;
      case 'wh_main_anc_group_crafted':
        return ItemRarityEnum.Crafted;
      case 'wh2_dlc17_anc_group_rune':
        return ItemRarityEnum.Rune;
      default:
        throw `Bad Item Rarity Group: ${rarityGroup}`;
    }
  }
  // CA made Uncommons 30 and Commons 35, idk
  if (uniquenessScore === 30) {
    return ItemRarityEnum.Uncommon;
  } else if (uniquenessScore <= 35) {
    return ItemRarityEnum.Common;
  } else if (uniquenessScore <= 130) {
    return ItemRarityEnum.Rare;
  } else if (uniquenessScore <= 200) {
    return ItemRarityEnum.Unique;
  } else {
    throw `Bad Item Uniqueness Score: ${uniquenessScore}`;
  }
};

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
