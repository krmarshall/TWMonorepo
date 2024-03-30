interface StatEffectInterface {
  value: number;
  stat: string;
  how: string;
  description: string;
  icon: string;
  sort_order?: number;
}

interface AttributeInterface {
  key: string;
  description: string;
  bullet_text: string;
  icon: string;
}

interface PhaseInterface {
  icon: string;
  order: number;
  target_enemies: boolean;
  target_self: boolean;
  target_friends: boolean;
  duration: number;
  effect_type: string;
  onscreen_name?: string;
  recharge_time?: number;
  is_hidden_in_ui: boolean;
  mana_max_depletion_mod?: number;
  fatigue_change_ratio?: number;
  mana_regen_mod?: number;
  ability_recharge_change?: number;
  resurrect?: boolean;
  hp_change_frequency?: number;
  heal_amount?: number;
  barrier_heal_amount?: number;
  damage_amount?: number;
  damage_chance?: number;
  max_damaged_entities?: number;
  imbue_magical?: boolean;
  imbue_ignition?: boolean;
  imbue_contact?: PhaseInterface;
  cant_move?: boolean;
  unbreakable?: boolean;
  replenish_ammo?: number;
  spread_radius?: number; // Linked through specialAbilityPhases spreading fk
  remove_magical?: boolean;
  execute_ratio?: number;
  stat_effects?: Array<StatEffectInterface>;
  attributes?: Array<AttributeInterface>;
}

interface VortexInterface {
  vortex_key: string;
  duration: number;
  damage: number;
  damage_ap: number;
  goal_radius: number;
  movement_speed: number;
  is_magical?: boolean;
  is_flaming?: boolean;
  delay: number;
  num_vortexes?: number;
  delay_between_vortexes?: number;
  affects_allies: boolean;
  contact_effect?: PhaseInterface;
}

interface ProjectileExplosionInterface {
  key: string;
  detonation_radius: number;
  detonation_damage: number;
  detonation_damage_ap: number;
  is_magical?: boolean;
  is_flaming?: boolean;
  affects_allies: boolean;
  contact_phase_effect?: PhaseInterface;
}

interface ProjectileInterface {
  key: string;
  projectile_number?: number;
  damage: number;
  ap_damage: number;
  effective_range: number;
  base_reload_time: number;
  bonus_v_infantry?: number;
  bonus_v_large?: number;
  shockwave_radius: number;
  burst_size?: number;
  is_magical?: boolean;
  is_flaming?: boolean;
  shots_per_volley?: number;
  can_damage_allies?: boolean;
  contact_stat_effect?: PhaseInterface;
  explosion_type?: ProjectileExplosionInterface;
  spawned_vortex?: VortexInterface;
}

interface ProjectileBombardmentInterface {
  bombardment_key: string;
  num_projectiles?: number;
  start_time: number;
  arrival_window: number;
  radius_spread: number;
  projectile_type: ProjectileInterface;
}

interface UiEffectInterface {
  key: string;
  sort_order?: number;
  localised_text: string;
  effect_state?: string;
}

interface AbilityInterface {
  effect: string;
  bonus_value_id: string;
  unit_ability: {
    key: string;
    icon_name: string;
    overpower_option: string;
    requires_effect_enabling?: boolean;
    type: {
      key: string;
      icon_path: string;
      onscreen_name: string;
    };
    is_hidden_in_ui: boolean;
    onscreen_name: string;
    ui_effects?: Array<UiEffectInterface>;
    active_time?: number;
    recharge_time?: number;
    shared_recharge_time?: number;
    wind_up_time?: number;
    effect_range: number;
    min_range?: number;
    target_friends: boolean;
    target_enemies: boolean;
    target_ground: boolean;
    target_self: boolean;
    enabled_if?: Array<string>;
    target_if?: Array<string>;
    num_effected_friendly_units?: number;
    num_effected_enemy_units?: number;
    target_intercept_range: number;
    mana_cost?: number;
    miscast_chance?: number;
    num_uses?: number;
    random_phases?: boolean;
    phases?: Array<PhaseInterface>;
    vortex?: VortexInterface;
    activated_projectile?: ProjectileInterface;
    bombardment?: ProjectileBombardmentInterface;
  };
}

interface EffectInterface {
  key: string;
  description: string;
  icon: string;
  priority?: number;
  value?: number;
  scope?: string;
  related_abilities?: Array<AbilityInterface>;
  related_phases?: Array<PhaseInterface>;
  related_attributes?: Array<AttributeInterface>;
}

interface FactionEffectsInterface {
  effects: Array<EffectInterface>;
  key: string;
  localised_description: string;
  localised_title: string;
  ui_icon: string;
}

interface ItemSetInterface {
  key: string;
  name: string;
  description: string;
  contains?: Array<{ icon: string; name: string }>;
  effects?: Array<EffectInterface>;
}

interface ItemInterface {
  key: string;
  character_skill?: string;
  effects?: Array<EffectInterface>;
  onscreen_name: string;
  colour_text: string;
  unlocked_at_rank?: number;
  ui_icon: string;
  item_set?: ItemSetInterface;
}

interface SkillLevelInterface {
  unlocked_at_rank?: number;
  auto_unlock_at_rank?: number;
  blocks_skill_node_keys?: Array<string>;
  effects?: Array<EffectInterface>;
  mount_unit_stats?: UnitStatsInterface;
}

interface SkillInterface {
  key: string;
  subculture?: string;
  faction?: string;
  image_path: string;
  is_background_skill: boolean;
  localised_name: string;
  localised_description: string;
  character_skill_key: string;
  tier: number;
  indent: number;
  points_on_creation: number;
  required_num_parents: number;
  parent_required?: Array<string>;
  parent_subset_required?: Array<string>;
  visible_in_ui: boolean;
  right_arrow?: boolean;
  boxed?: boolean;
  use_quest_for_prefix?: boolean;
  levels?: Array<SkillLevelInterface>;
}

interface UnitStatsInterface {
  run_speed: number;
  fly_speed?: number;
  mass: number;
  size: string;
  can_siege?: boolean;
  can_skirmish?: boolean;

  barrier?: number;
  hit_points: number;
  bonus_hit_points: number;
  armour: number;
  missile_block_chance: number;
  morale: number;
  damage_mod_flame: number;
  damage_mod_magic: number;
  damage_mod_physical: number;
  damage_mod_missile: number;
  damage_mod_all: number;

  melee_attack: number;
  melee_defence: number;
  charge_bonus: number;
  bonus_v_large: number;
  bonus_v_infantry: number;
  damage: number;
  ap_damage: number;
  splash_target_size_limit: string;
  splash_attack_max_attacks: number;
  melee_attack_interval: number;
  is_flaming?: boolean;
  is_magical?: boolean;
  contact_phase?: PhaseInterface;

  projectile?: ProjectileInterface;
  accuracy?: number;
  reload?: number;
  primary_ammo?: number;
  secondary_ammo?: number;
  fire_arc?: number;

  attributes?: Array<AttributeInterface>;
  abilities?: Array<AbilityInterface>;
}

interface AltFactionNodeSetsInterface {
  [key: string]: { factionName: string; nodes: Array<SkillInterface> };
}

interface StartPosTraitInterface {
  [key: string]: { name: string; campaign: string; faction: string; trait: SkillInterface };
}

interface ProcessedAgentInterface {
  key: string;
  skillTree: Array<Array<SkillInterface>>;
  unitStats: UnitStatsInterface;
  factionEffects?: FactionEffectsInterface;
  items?: Array<ItemInterface>;
  backgroundSkills?: Array<SkillInterface>;
  altFactionNodeSets?: AltFactionNodeSetsInterface;
  startPosTraits?: StartPosTraitInterface;
}

export {
  EffectInterface,
  StatEffectInterface,
  AttributeInterface,
  PhaseInterface,
  VortexInterface,
  ProjectileBombardmentInterface,
  ProjectileExplosionInterface,
  ProjectileInterface,
  UiEffectInterface,
  AbilityInterface,
  FactionEffectsInterface,
  ItemInterface,
  SkillLevelInterface,
  SkillInterface,
  UnitStatsInterface,
  AltFactionNodeSetsInterface,
  ProcessedAgentInterface,
  StartPosTraitInterface,
  ItemSetInterface,
};
