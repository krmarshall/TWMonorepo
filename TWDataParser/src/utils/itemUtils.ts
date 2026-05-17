import { ItemRarityEnum } from '../@types/ItemInterface.ts';

export const rarityLookup = (uniquenessScore: number, game: string) => {
  // Comment on ancillaries_tables uniqueness score is wrong? Follow ancillary_uniqueness_groupings?
  if (game === 'warhammer_2') {
    if (uniquenessScore <= 29) {
      return ItemRarityEnum.Common;
    } else if (uniquenessScore <= 49) {
      return ItemRarityEnum.Uncommon;
    } else if (uniquenessScore <= 100) {
      return ItemRarityEnum.Rare;
    } else if (uniquenessScore <= 150) {
      return ItemRarityEnum.Crafted;
    } else if (uniquenessScore <= 999) {
      return ItemRarityEnum.Unique;
    } else {
      throw `Bad Item Uniqueness Score: ${uniquenessScore}`;
    }
  }
  if (game === 'warhammer_3') {
    if (uniquenessScore === 199) {
      return ItemRarityEnum.Crafted;
    } else if (uniquenessScore === 151) {
      return ItemRarityEnum.Rune;
    } else if (uniquenessScore <= 50) {
      return ItemRarityEnum.Common;
    } else if (uniquenessScore <= 100) {
      return ItemRarityEnum.Uncommon;
    } else if (uniquenessScore <= 150) {
      return ItemRarityEnum.Rare;
    } else if (uniquenessScore <= 200) {
      return ItemRarityEnum.Unique;
    } else {
      throw `Bad Item Uniqueness Score: ${uniquenessScore}`;
    }
  }
  throw `Missing Rarity Lookup For Game: ${game}`;
};
