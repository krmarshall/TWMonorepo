import { GlobalDataInterface } from '../interfaces/GlobalDataInterface';
import { AltFactionNodeSetsInterface, ItemInterface, SkillInterface } from '../interfaces/ProcessedTreeInterface';
import log from '../utils/log';

const collateNodes = (
  folder: string,
  globalData: GlobalDataInterface,
  completeNodes: Array<SkillInterface>,
  itemsArg: Array<ItemInterface>,
  subcultureKey: string,
  factionKeys: Set<string>,
) => {
  let skillTree: Array<Array<SkillInterface>> = [[], [], [], [], [], []];
  const backgroundSkills: Array<SkillInterface> = [];
  const items: Array<ItemInterface> = [...itemsArg];
  let altFactionNodeSets: AltFactionNodeSetsInterface | undefined = undefined;

  completeNodes.forEach((completeNode) => {
    if (completeNode.character_skill_key === 'wh3_main_skill_agent_action_success_scaling') {
      // Dont add
    } else if (completeNode.use_quest_for_prefix) {
      // Dont add (wh2 quest item)
    } else if (completeNode.is_background_skill || !completeNode.visible_in_ui) {
      if (completeNode.use_quest_for_prefix !== undefined) delete completeNode.use_quest_for_prefix;
      backgroundSkills.push(completeNode);
    } else if (completeNode.indent === 7 && completeNode.tier === 99) {
      // Cryswar hides vanilla nodes under indent 7 tier 99, so just ignore all of these
    } else if (completeNode.subculture && completeNode.subculture !== subcultureKey) {
      // Dont add
    } else if (completeNode.indent <= 5 && completeNode.faction === undefined) {
      if (skillTree[completeNode.indent] === undefined) skillTree[completeNode.indent] = [];
      if (completeNode.use_quest_for_prefix !== undefined) delete completeNode.use_quest_for_prefix;
      // if (skillTree[completeNode.indent][completeNode.tier] !== undefined) {
      //   log(`Overlapping node indent/tier: ${completeNode.key}`, 'yellow');
      // }
      skillTree[completeNode.indent][completeNode.tier] = completeNode;
    } else if (completeNode.indent <= 5 && completeNode.faction && factionKeys.has(completeNode.faction)) {
      if (altFactionNodeSets === undefined) altFactionNodeSets = {};
      if (altFactionNodeSets[completeNode.faction] === undefined) {
        const factionName = globalData.parsedData[folder].text[`factions_screen_name_${completeNode.faction}`];
        altFactionNodeSets[completeNode.faction] = { factionName: factionName ?? 'Missing Faction Name', nodes: [] };
      }
      altFactionNodeSets[completeNode.faction].nodes.push(completeNode);
    } else if (completeNode.faction && !factionKeys.has(completeNode.faction)) {
      // Dont add
    } else {
      if (completeNode.use_quest_for_prefix !== undefined) delete completeNode.use_quest_for_prefix;
      backgroundSkills.push(completeNode);
    }
  });

  // Clean null array elements
  skillTree = skillTree.filter((indent) => indent !== null);
  skillTree = skillTree.map((tier) => tier.filter((skill) => skill !== null));

  items.sort((a, b) => (a.unlocked_at_rank ?? 0) - (b.unlocked_at_rank ?? 0));
  return { skillTree, backgroundSkills, items, altFactionNodeSets };
};

export default collateNodes;
