import type { GlobalDataInterface, TableRecord } from '../@types/GlobalDataInterface.ts';
import type { EffectInterface } from '../@types/CharacterInterface.ts';
import type { TechNodeInterface } from '../@types/TechInterface.ts';
import findImage from '../utils/findImage.ts';
import stringInterpolator from '../utils/stringInterpolator.ts';
import processAncillary from './processAncillary.ts';
import processEffect from './processEffect.ts';

const processTechNode = (
  folder: string,
  globalData: GlobalDataInterface,
  techNode: TableRecord,
  techReqJuncMap: { [key: string]: Array<{ key: string; name: string }> },
  nodeLinksMap: { [key: string]: Array<string> },
) => {
  const tech = techNode.localRefs?.technologies;
  if (tech === undefined) {
    return;
  }

  const effects: Array<EffectInterface> = [];
  tech.foreignRefs?.technology_effects_junction?.forEach((effectJunc) => {
    effects.push(processEffect(folder, globalData, effectJunc));
  });
  effects.sort((a, b) => (a.priority as number) - (b.priority as number)).forEach((effect) => delete effect.priority);

  const returnTechNode: TechNodeInterface = {
    key: techNode.key as string,
    tier: techNode.tier as number,
    indent: (techNode.indent as number) + 2, // Indents start at -2 for some reason
    research_points_required: techNode.research_points_required as number,
    technology: {
      key: tech.key as string,
      icon_name: findTechImage(folder, globalData, tech.icon_name as string),
      onscreen_name: stringInterpolator(tech.onscreen_name as string, globalData.parsedData[folder].text),
      short_description: stringInterpolator(tech.short_description as string, globalData.parsedData[folder].text),
      effects: effects,
    },
  };

  if (techNode.cost_per_round !== 0) returnTechNode.cost_per_round = techNode.cost_per_round as number;
  if (techNode.required_parents !== 0 && techNode.required_parents !== undefined) {
    returnTechNode.required_parents = techNode.required_parents as number;
  }
  const uiGroup = techNode.localRefs?.technology_ui_groups?.key;
  if (uiGroup !== undefined) returnTechNode.ui_group = uiGroup as string;

  const required_buildings: Array<string> = [];
  tech.foreignRefs?.technology_required_building_levels_junctions?.forEach((buildingJunc) => {
    const buildingName = buildingJunc.localRefs?.building_levels?.foreignRefs?.building_culture_variants?.[0]?.name;
    if (buildingName !== undefined) {
      required_buildings.push(buildingName as string);
    }
  });
  if (required_buildings.length > 0) returnTechNode.technology.required_buildings = required_buildings;

  techNode.foreignRefs?.technology_nodes_to_ancillaries_junctions?.forEach((ancillaryJunc) => {
    if (returnTechNode.items === undefined) returnTechNode.items = [];
    returnTechNode.items.push(processAncillary(folder, globalData, ancillaryJunc, undefined));
  });

  Object.entries(techReqJuncMap).forEach((techJuncPair) => {
    const techJuncKey = techJuncPair[0];
    const techJuncReqs = techJuncPair[1];
    if (returnTechNode.technology.key !== techJuncKey) {
      return;
    }
    if (returnTechNode.required_tech_keys === undefined) returnTechNode.required_tech_keys = [];
    returnTechNode.required_tech_keys.push(...techJuncReqs);
  });

  const nodeLinks = nodeLinksMap[returnTechNode.key];
  if (nodeLinks !== undefined) {
    if (returnTechNode.required_tech_node_keys === undefined) returnTechNode.required_tech_node_keys = [];
    returnTechNode.required_tech_node_keys.push(...nodeLinks);
  }

  // Unit cards
  const related_unit_cards: Set<string> = new Set();
  returnTechNode.technology.effects.forEach((effect) => {
    effect.related_unit_cards_PARSER_ONLY?.forEach((card) => related_unit_cards.add(card));
    delete effect.related_unit_cards_PARSER_ONLY;
  });
  if (related_unit_cards.size > 0) returnTechNode.technology.related_unit_cards = Array.from(related_unit_cards);

  return returnTechNode;
};

export default processTechNode;

const findTechImage = (folder: string, globalData: GlobalDataInterface, iconArg: string) => {
  const icon = iconArg.replace('.png', '').trim();
  const searchArray = [`campaign_ui/technologies/${icon}`, `campaign_ui/technologies/${icon.toLowerCase()}`];

  return findImage(folder, globalData, searchArray, icon);
};
