import light from './wh_main_lore_passive_exorcism.webp';
import fire from './wh_main_lore_passive_kindleflame.webp';
import death from './wh_main_lore_passive_life_leeching.webp';
import metal from './wh_main_lore_passive_metalshifting.webp';
import heavens from './wh_main_lore_passive_roiling_skies.webp';
import bigWagh from './wh_main_lore_passive_power_of_da_waaagh.webp';
import lilWagh from './wh_main_lore_passive_sneaky_stealin.webp';
import vampires from './wh_main_lore_passive_the_curse_of_undeath.webp';
import beasts from './wh_dlc03_lore_passive_wild_heart.webp';
import wild from './wh_dlc03_lore_passive_bestial_surge.webp';
import shadows from './wh_dlc05_lore_passive_smoke_and_mirrors.webp';
import life from './wh_dlc05_spell_life_life_bloom.webp';
import skvPlague from './wh2_main_lore_passive_plague_rash.webp';
import ruin from './wh2_main_lore_passive_musk_of_fear.webp';
import stealth from './wh2_dlc14_skill_all_magic_stealth_02_toxic_rain_lore_attribute.webp';
import high from './wh2_main_lore_passive_shield_of_saphery.webp';
import wefHigh from './wh2_dlc16_lore_passive_ancients_protection.webp';
import dark from './wh2_main_lore_passive_spiteful_conjuration.webp';
import nehekhara from './wh2_dlc09_lore_nehekhara.webp';
import deeps from './wh2_dlc11_lore_deeps.webp';
import runic from './wh2_dlc17_rune_abilities_rune_of_speed.webp';
import ice from './wh3_main_lore_passive_frost_shield.webp';
import tempest from './wh3_main_lore_passive_freezing_winds.webp';
import yin from './wh3_main_lore_passive_power_of_yin.webp';
import yang from './wh3_main_lore_passive_strength_of_yang.webp';
import tzeentch from './wh3_main_lore_passive_fires_of_change.webp';
import nurgle from './wh3_main_lore_passive_children_of_nurgle.webp';
import slaanesh from './wh3_main_lore_passive_blissful_rapture.webp';
import greatMaw from './wh3_main_lore_passive_bloodgruel.webp';
import hashut from './wh3_dlc23_lore_passive_killing_fire.webp';
import hag from './wh3_dlc24_lore_passive_fate_of_interlopers.webp';
import mixed from './mixedBG.webp';

const spellLoreIcons = {
  light: {
    image: light,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #706842fd) drop-shadow(0.1rem 0.1rem 0.25rem #706842fd)',
  },
  fire: { image: fire, shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #9e3722) drop-shadow(0.1rem 0.1rem 0.25rem #9e3722)' },
  death: {
    image: death,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #5a1551) drop-shadow(0.1rem 0.1rem 0.25rem #5a1551)',
  },
  metal: {
    image: metal,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #6c3f27) drop-shadow(0.1rem 0.1rem 0.25rem #6c3f27)',
  },
  heavens: {
    image: heavens,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #2e5e67) drop-shadow(0.1rem 0.1rem 0.25rem #2e5e67)',
  },
  bigWagh: {
    image: bigWagh,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #4d1e0dfe) drop-shadow(0.1rem 0.1rem 0.25rem #4d1e0dfe)',
  },
  lilWagh: {
    image: lilWagh,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #4d1e0dfe) drop-shadow(0.1rem 0.1rem 0.25rem #4d1e0dfe)',
  },
  vampires: {
    image: vampires,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #5b191c) drop-shadow(0.1rem 0.1rem 0.25rem #5b191c)',
  },
  beasts: {
    image: beasts,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #916c1e) drop-shadow(0.1rem 0.1rem 0.25rem #916c1e)',
  },
  wild: { image: wild, shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #3e664e) drop-shadow(0.1rem 0.1rem 0.25rem #3e664e)' },
  shadows: {
    image: shadows,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #434673) drop-shadow(0.1rem 0.1rem 0.25rem #434673)',
  },
  life: { image: life, shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #4c571c) drop-shadow(0.1rem 0.1rem 0.25rem #4c571c)' },
  plague: {
    image: skvPlague,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #827921) drop-shadow(0.1rem 0.1rem 0.25rem #827921)',
  },
  ruin: { image: ruin, shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #52771d) drop-shadow(0.1rem 0.1rem 0.25rem #52771d)' },
  stealth: {
    image: stealth,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #516022) drop-shadow(0.1rem 0.1rem 0.25rem #516022)',
  },
  hag: { image: hag, shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #1e637d) drop-shadow(0.1rem 0.1rem 0.25rem #1e637d)' },
  high: { image: high, shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #1d5a76) drop-shadow(0.1rem 0.1rem 0.25rem #1d5a76)' },
  wefHigh: {
    image: wefHigh,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #1b5265) drop-shadow(0.1rem 0.1rem 0.25rem #1b5265)',
  },
  dark: { image: dark, shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #3f1c65) drop-shadow(0.1rem 0.1rem 0.25rem #3f1c65)' },
  nehekhara: {
    image: nehekhara,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #379583) drop-shadow(0.1rem 0.1rem 0.25rem #379583)',
  },
  deep: {
    image: deeps,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #1c6350) drop-shadow(0.1rem 0.1rem 0.25rem #1c6350)',
  },
  runic: {
    image: runic,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #396173) drop-shadow(0.1rem 0.1rem 0.25rem #396173)',
  },
  ice: {
    image: ice,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #15635efe) drop-shadow(0.1rem 0.1rem 0.25rem #15635efe)',
  },
  tempest: {
    image: tempest,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #1e637d) drop-shadow(0.1rem 0.1rem 0.25rem #1e637d)',
  },
  yin: {
    image: yin,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #791608fe) drop-shadow(0.1rem 0.1rem 0.25rem #791608fe)',
  },
  yang: {
    image: yang,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #7d1206fe) drop-shadow(0.1rem 0.1rem 0.25rem #7d1206fe)',
  },
  tzeentch: {
    image: tzeentch,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #08849c) drop-shadow(0.1rem 0.1rem 0.25rem #08849c)',
  },
  nurgle: {
    image: nurgle,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #706a1c) drop-shadow(0.1rem 0.1rem 0.25rem #706a1c)',
  },
  slaanesh: {
    image: slaanesh,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #8c2776) drop-shadow(0.1rem 0.1rem 0.25rem #8c2776)',
  },
  'great maw': {
    image: greatMaw,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #684717) drop-shadow(0.1rem 0.1rem 0.25rem #684717)',
  },
  hashut: {
    image: hashut,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #9e3722) drop-shadow(0.1rem 0.1rem 0.25rem #9e3722)',
  },
  mixed: {
    image: mixed,
    shadow: 'drop-shadow(0.1rem 0.1rem 0.4rem #80612f) drop-shadow(0.1rem 0.1rem 0.25rem #80612f)',
  },
};

export default spellLoreIcons;
