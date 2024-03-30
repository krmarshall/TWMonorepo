import { GlobalDataInterface, TableRecord } from '../interfaces/GlobalDataInterface';
import { ItemInterface, SkillInterface } from '../interfaces/ProcessedTreeInterface';
import collateNodes from './collateNodes';
import processSkillNode from './processSkillNode';

const processNodeSet = (
  folder: string,
  globalData: GlobalDataInterface,
  nodeSet: TableRecord,
  subcultureKey: string,
  factionKeys: Set<string>,
) => {
  const completeNodes: Array<SkillInterface> = [];
  const items: Array<ItemInterface> = [];

  const skillNodeKeys: { [key: string]: boolean } = {};
  if (folder.includes('2')) {
    nodeSet.foreignRefs?.character_skill_nodes?.forEach((skillNode) => (skillNodeKeys[skillNode.key] = true));
  } else {
    nodeSet.foreignRefs?.character_skill_node_set_items?.forEach((nodeSetItem) => {
      if (nodeSetItem?.localRefs?.character_skill_nodes !== undefined) {
        skillNodeKeys[nodeSetItem?.localRefs?.character_skill_nodes.key] = true;
      }
    });
  }

  const subsetRequiredMap: { [key: string]: Array<SkillInterface> } = {};
  const requiredMap: { [key: string]: Array<SkillInterface> } = {};

  if (folder.includes('2')) {
    nodeSet.foreignRefs?.character_skill_nodes?.forEach((skillNode) => {
      const tempNode = processSkillNode(folder, globalData, skillNode, skillNodeKeys, items, subsetRequiredMap, requiredMap);
      if (tempNode !== undefined) {
        completeNodes.push(tempNode);
      }
    });
  } else {
    nodeSet.foreignRefs?.character_skill_node_set_items?.forEach((nodeSetItem) => {
      const skillNode = nodeSetItem.localRefs?.character_skill_nodes;
      if (nodeSetItem.mod_disabled === 'false' && skillNode !== undefined) {
        const tempNode = processSkillNode(folder, globalData, skillNode, skillNodeKeys, items, subsetRequiredMap, requiredMap);
        if (tempNode !== undefined) {
          completeNodes.push(tempNode);
        }
      }
    });
  }

  // After all nodes are processed go through subset_required children, give their highest tier parent right_arrow
  // Multiple nodes can share the same tier and overlap for diff circumstances, give them all right arrow as well
  Object.values(subsetRequiredMap).forEach((subsetRequiredNodes) => {
    let highest: Array<SkillInterface> = [subsetRequiredNodes[0]];
    for (let i = 0; i < subsetRequiredNodes.length; i++) {
      if (subsetRequiredNodes[i].tier > highest[0].tier) {
        highest = [subsetRequiredNodes[i]];
      } else if (subsetRequiredNodes[i].tier === highest[0].tier) {
        highest.push(subsetRequiredNodes[i]);
      }
    }
    highest.forEach((node) => (node.right_arrow = true));

    // Also give each parent node boxed if there are more than 1 of them
    if (subsetRequiredNodes.length > 1) {
      subsetRequiredNodes.forEach((node) => (node.boxed = true));
    }
  });
  // Go through required children, if more than 1 node requires the same parent give them boxed
  Object.values(requiredMap).forEach((requiredNodes) => {
    if (requiredNodes.length > 1) {
      requiredNodes.forEach((node) => (node.boxed = true));
    }
  });

  return collateNodes(folder, globalData, completeNodes, items, subcultureKey, factionKeys);
};

export default processNodeSet;
