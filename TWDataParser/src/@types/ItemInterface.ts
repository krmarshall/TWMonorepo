import type { EffectInterface } from './CharacterInterface.ts';

export interface ItemSetInterface {
  key: string;
  name: string;
  description: string;
  contains?: Array<{ icon: string; name: string }>;
  effects?: Array<EffectInterface>;
  related_unit_cards?: Array<string>;
}

export interface ItemInterface {
  key: string;
  character_skill?: string;
  effects?: Array<EffectInterface>;
  onscreen_name: string;
  colour_text: string;
  unlocked_at_rank?: number;
  ui_icon: string;
  item_set?: ItemSetInterface;
  related_unit_cards?: Array<string>;
}

export const ItemRarityEnum = {
  Unique: 'Unique',
  Rare: 'Rare',
  Uncommon: 'Uncommon',
  Common: 'Common',
  Crafted: 'Crafted',
  Rune: 'Rune',
} as const;
export type ItemRarityEnumType = (typeof ItemRarityEnum)[keyof typeof ItemRarityEnum];

// ancillaries_categories_tables, follow sort order as placement order here
export const ItemCategoryEnum = {
  armour: 'Armour',
  weapon: 'Weapon',
  mount: 'Mount',
  talisman: 'Talisman',
  enchanted_item: 'Enchanted Item',
  arcane_item: 'Arcane Item',
  general: 'General', // Stuff like banners
  form: 'Form', // Placeholder
} as const;
export type ItemCategoryEnumType = (typeof ItemCategoryEnum)[keyof typeof ItemCategoryEnum];

// ancillaries_subcategories_tables
export const ItemSubcategoryEnum = {
  armour_rune: 'Armour Rune',
  banner: 'Banner',
  banner_rune: 'Banner Rune',
  character_rune: 'Character Rune',
  engineering_rune: 'Engineering Rune',
  follower: 'Follower',
  gift: 'Gift of Chaos',
  mark: 'Mark of Chaos',
  poison: 'Poison',
  rune: 'Rune',
  spell_fragment: 'Spell Fragment',
} as const;
export type ItemSubcategoryEnumType = (typeof ItemSubcategoryEnum)[keyof typeof ItemSubcategoryEnum];

export interface FactionDataInterface {
  name: string;
  img: string; // factions have a proper img path, (sub)cultures have the key for factionImages.ts on the frontend
}

export interface ExtendedItemInterface extends ItemInterface {
  rarity: ItemRarityEnumType;
  category: ItemCategoryEnumType;
  subcategory?: ItemSubcategoryEnumType;
  agent_subtypes?: Array<string>; // Agents that can use the item, eg Karl Franz
  agent_types?: Array<string>; // Agent types that can use the item, eg, wizards
  available?: {
    all?: boolean;
    factions: Record<string, FactionDataInterface>;
    subcultures: Record<string, FactionDataInterface>;
    cultures: Record<string, FactionDataInterface>;
  };
  unavailable?: {
    factions: Record<string, FactionDataInterface>;
    subcultures: Record<string, FactionDataInterface>;
    cultures: Record<string, FactionDataInterface>;
  };
  randomly_dropped?: boolean;
  can_be_destroyed?: boolean; // Destroyed for scrap or fused.
  transferrable?: boolean;
}
