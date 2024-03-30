import { TechNodeBgFillerInterface, TechNodeInterface } from '../interfaces/TechInterface';

const collateTechNodes = (processedNodes: Array<TechNodeInterface>) => {
  const uiGroups: { [key: string]: Array<TechNodeInterface> } = {};
  const tree: Array<Array<TechNodeInterface | TechNodeBgFillerInterface>> = [];
  processedNodes.forEach((node) => {
    if (node.indent > 100 || node.indent > 100) {
      return;
    }

    if (node.ui_group !== undefined) {
      if (uiGroups[node.ui_group] === undefined) uiGroups[node.ui_group] = [];
      uiGroups[node.ui_group].push(node);
    }

    if (tree[node.indent] === undefined) tree[node.indent] = [];
    tree[node.indent][node.tier] = node;
  });

  return { tree, uiGroups };
};

export default collateTechNodes;
