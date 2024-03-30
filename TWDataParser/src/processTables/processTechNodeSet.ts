import { Table } from '../generateTables';
import { GlobalDataInterface, RefKey, TableRecord } from '../interfaces/GlobalDataInterface';
import { NodeLinkInterface, TechNodeInterface, TechSetInterface } from '../interfaces/TechInterface';
import log from '../utils/log';
import { parseBoolean, parseInteger } from '../utils/parseStringToTypes';
import collateTechNodes from './collateTechNodes';
import outputTechNodeSet from './outputTechNodeSet';
import processTechNode from './processTechNode';

const processTechNodeSet = (
  folder: string,
  globalData: GlobalDataInterface,
  techNodeSet: TableRecord,
  tables: { [key in RefKey]?: Table },
) => {
  const returnTechNodeSet: TechSetInterface = {
    key: techNodeSet.key,
    faction_key: techNodeSet.faction_key,
    culture: techNodeSet.culture,
    tree: [],
    node_links: [],
  };

  const techNodeRequiredJuncMap: { [key: string]: Array<{ key: string; name: string }> } = {};
  tables.technology_required_technology_junctions?.records?.forEach((techJunc) => {
    if (techNodeRequiredJuncMap[techJunc.technology] === undefined) techNodeRequiredJuncMap[techJunc.technology] = [];
    const reqTech = tables.technologies?.findRecordByKey('key', techJunc.required_technology) as TableRecord;
    techNodeRequiredJuncMap[techJunc.technology].push({ key: techJunc.required_technology, name: reqTech.onscreen_name });
  });

  const nodeLinksMap: { [key: string]: Array<TableRecord> } = {};
  const nodeLinksMapChild: { [key: string]: Array<string> } = {};
  techNodeSet.foreignRefs?.technology_nodes?.forEach((techNode) => {
    techNode.foreignRefs?.technology_node_links?.forEach((nodeLink) => {
      if (techNode.key === nodeLink.parent_key) {
        if (nodeLinksMap[techNode.key] === undefined) nodeLinksMap[techNode.key] = [];
        nodeLinksMap[techNode.key].push(nodeLink);
      } else if (techNode.key === nodeLink.child_key) {
        if (nodeLinksMapChild[techNode.key] === undefined) nodeLinksMapChild[techNode.key] = [];
        nodeLinksMapChild[techNode.key].push(nodeLink.parent_key);
      }
    });
  });

  const processedNodes: Array<TechNodeInterface> = [];
  techNodeSet.foreignRefs?.technology_nodes?.forEach((techNode) => {
    const tempNode = processTechNode(folder, globalData, techNode, techNodeRequiredJuncMap, nodeLinksMapChild);
    if (tempNode !== undefined) {
      processedNodes.push(tempNode);
    }
  });

  const { tree, uiGroups } = collateTechNodes(processedNodes);
  returnTechNodeSet.tree = tree;

  Object.keys(uiGroups).forEach((uiGroupKey) => {
    const uiGroupRecord = tables.technology_ui_groups?.findRecordByKey('key', uiGroupKey);
    if (uiGroupRecord === undefined) {
      log(`Missing ui group: ${uiGroupKey}`, 'red');
      return;
    }

    const nodeJunc = uiGroupRecord.foreignRefs?.technology_ui_groups_to_technology_nodes_junctions?.[0] as TableRecord;
    const botRightNode = tables.technology_nodes?.findRecordByKey('key', nodeJunc.bottom_right_node);
    const topLeftNode = tables.technology_nodes?.findRecordByKey('key', nodeJunc.top_left_node);
    // const optTopRightNode = tables.technology_nodes?.findRecordByKey('key', nodeJunc.optional_top_right_node);
    // const optBotLeftNode = tables.technology_nodes?.findRecordByKey('key', nodeJunc.optional_bottom_left_node);

    if (botRightNode === undefined || topLeftNode === undefined) {
      return;
    }
    // Indent = y, Tier = x
    const topBound = parseInteger(topLeftNode.indent) + 2;
    const bottomBound = parseInteger(botRightNode.indent) + 2;
    const leftBound = parseInteger(topLeftNode.tier);
    const rightBound = parseInteger(botRightNode.tier);

    for (let y = topBound; y <= bottomBound; y++) {
      for (let x = leftBound; x <= rightBound; x++) {
        if (returnTechNodeSet.tree[y] === null || returnTechNodeSet.tree[y] === undefined) returnTechNodeSet.tree[y] = [];
        if (returnTechNodeSet.tree[y][x] === null || returnTechNodeSet.tree[y][x] === undefined)
          returnTechNodeSet.tree[y][x] = { bgFiller: true };
        returnTechNodeSet.tree[y][x].ui_group = uiGroupKey;
        returnTechNodeSet.tree[y][x].ui_group_colour = uiGroupRecord.colour_hex;
        returnTechNodeSet.tree[y][x].ui_group_position = '';

        if (y === topBound) {
          returnTechNodeSet.tree[y][x].ui_group_position += 'top';
        }
        if (y === bottomBound) {
          returnTechNodeSet.tree[y][x].ui_group_position += 'bottom';
        }
        if (x === leftBound) {
          returnTechNodeSet.tree[y][x].ui_group_position += 'left';
        }
        if (x === rightBound) {
          returnTechNodeSet.tree[y][x].ui_group_position += 'right';
        }
      }
    }
  });

  Object.values(nodeLinksMap).forEach((nodeLinks) => {
    nodeLinks.forEach((nodeLink) => {
      const returnLink: NodeLinkInterface = {
        parent_key: nodeLink.parent_key,
        child_key: nodeLink.child_key,
        parent_link_position: translatePosition(nodeLink.parent_link_position, nodeLink.parent_key),
        child_link_position: translatePosition(nodeLink.child_link_position, nodeLink.child_key),
      };
      if (nodeLink.visible_in_ui !== undefined) returnLink.visible_in_ui = parseBoolean(nodeLink.visible_in_ui);
      returnTechNodeSet.node_links.push(returnLink);
    });
  });

  outputTechNodeSet(returnTechNodeSet, folder);
};

export default processTechNodeSet;

const translatePosition = (number: string, parent_key: string) => {
  switch (number) {
    case '0': {
      return 'auto';
    }
    case '1': {
      return 'top';
    }
    case '2': {
      return 'right';
    }
    case '3': {
      return 'bottom';
    }
    case '4': {
      return 'left';
    }
    default: {
      log(`invalid link position for: ${parent_key}`, 'red');
      return 'right';
    }
  }
};
