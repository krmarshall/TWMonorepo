import { EffectInterface, ItemInterface } from './ProcessedTreeInterface';

interface NodeLinkInterface {
  parent_key: string;
  child_key: string;
  parent_link_position: string;
  child_link_position: string;
  visible_in_ui?: boolean;
}

interface TechSkillInterface {
  key: string;
  icon_name: string;
  onscreen_name: string;
  short_description: string;
  required_buildings?: Array<string>;
  effects: Array<EffectInterface>;
}

interface TechNodeInterface {
  key: string;
  tier: number;
  indent: number;
  research_points_required: number;
  cost_per_round?: number;
  optional_ui_group?: string;
  required_parents?: number;
  required_tech_keys?: Array<{ key: string; name: string }>;
  required_tech_node_keys?: Array<string>;
  technology: TechSkillInterface;
  items?: Array<ItemInterface>;
  ui_group?: string;
  ui_group_colour?: string;
  ui_group_position?: string;
}

interface TechNodeBgFillerInterface {
  bgFiller: boolean;
  ui_group?: string;
  ui_group_colour?: string;
  ui_group_position?: string;
}

interface TechSetInterface {
  key: string;
  faction_key: string;
  culture: string;
  tree: Array<Array<TechNodeInterface | TechNodeBgFillerInterface>>;
  node_links: Array<NodeLinkInterface>;
}

export type { TechSetInterface, TechNodeInterface, NodeLinkInterface, TechNodeBgFillerInterface };
