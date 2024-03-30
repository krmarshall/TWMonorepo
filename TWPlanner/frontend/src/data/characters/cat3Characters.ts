import { SpellLores } from '../../types/interfaces/GameInterface';

const cat3Characters = {
  dwf_dwarfs: {
    lords: {
      kraka_cromson: { name: 'Thorgard Cromson' },
      kraka_wardlord: { name: 'Wardlord', spellLore: SpellLores.runic },
    },
    heroes: {},
  },

  hef_high_elves: {
    lords: {
      AK_aislinn: { name: 'Aislinn' },
      AK_hef_seahelm: { name: 'Sea Helm' },
    },
    heroes: {},
  },

  teb_southern_realms: {
    lords: {
      teb_borgio_the_besieger: { name: 'Borgio the Besieger' },
      teb_cadavo: { name: 'El Cadavo' },
      teb_eldaddio: { name: 'Eustaquio Sunscryer' },
      teb_gashnag: { name: 'Gashnag, the Black Prince', spellLore: SpellLores.shadows },
      teb_catrazza: { name: 'Leonardo Catrazza' },
      teb_lorenzo_lupo: { name: 'Lorenzo Lupo' },
      teb_lucrezzia_belladonna: { name: 'Lucrezzia Belladonna', spellLore: SpellLores.death },
      teb_lupio: { name: 'Lupio Sunscryer' },
      teb_colombo: { name: 'Marco Colombo' },
      teb_gausser: { name: 'Valmir Gausser' },
      teb_templar_lord: { name: 'High Eagle' },
      teb_merc_general: { name: 'Mercenary General' },
      til_merchant: { name: 'Merchant Prince' },
      est_inquisitor: { name: 'Inquisitor Lord' },
      bor_ranger_lord: { name: 'Pathfinder' },
    },
    heroes: {
      teb_duellist_hero: { name: 'Master Duellist' },
      teb_merc_captain: { name: 'Mercenary Captain' },
      teb_priestess: { name: 'Priestess of Myrmidia' },
    },
  },
};

export default cat3Characters;
