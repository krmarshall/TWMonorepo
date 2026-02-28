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
export type ItemRarityEnum = (typeof ItemRarityEnum)[keyof typeof ItemRarityEnum];

export interface FactionDataInterface {
  name: string;
  img: string; // factions have a proper img path, (sub)cultures have the key for factionImages.ts on the frontend
}

export interface ExtendedItemInterface extends ItemInterface {
  rarity: keyof typeof ItemRarityEnum;
  category: string; // Armour / Arcane Item / Mount / Banner / etc.
  subcategory?: string; // Banner / Rune / Follower
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
  remove?: boolean; // If true, the ancillary is available to NOT the faction/culture above
  randomly_dropped?: boolean;
  can_be_destroyed?: boolean; // Destroyed for scrap or fused.
  transferrable?: boolean;
}
