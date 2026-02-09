import { basename } from 'node:path';
import type { GlobalDataInterface, RefKey, TableRecord } from './@types/GlobalDataInterface.ts';
import { vanillaFolders } from './lists/vanillaFolders.ts';
import type RpfmClient from './rpfmClient.ts';
import type { Definition } from './@types/CustomRpfmTypes.ts';

export const parser = async (
  folder: string,
  globalData: GlobalDataInterface,
  rpfmClient: RpfmClient,
  dbList: Array<RefKey>,
) => {
  // For every table (eg. ancillaries) we extract
  const dbPromises = dbList.map(async (dbTable) => {
    const parsedSubTables: { [key: string]: Array<TableRecord> } = {};

    // Get all the sub table paths of that tableName eg. db/ancillaries_table/data__
    const tablePaths = await rpfmClient.getTablePathsByTableName(dbTable);

    // For each of those sub table paths decode and parse it
    const tablePromises = tablePaths.map(async (subTablePath) => {
      let subTableName = basename(subTablePath);
      const { definition, table_data } = await rpfmClient.decodeDbTable(subTablePath);

      const parsedSubTable: Array<TableRecord> = table_data.map((row) => {
        const parsedRow: { [key: string]: string | number | boolean } = {};
        row.forEach((field, index) => {
          // field value from the table_date, have to get the field key from the definitions
          let value = Object.values(field)[0];
          if (typeof value === 'number') {
            value = parseFloat(value.toFixed(4));
          }
          const key = definition.fields[index].name;
          parsedRow[key] = value;
        });
        return parsedRow;
      });
      // Put parsed sub table into temp object, ensure we dont have duplicate sub table names
      while (parsedSubTables[subTableName] !== undefined) {
        subTableName += '0';
      }
      parsedSubTables[subTableName] = parsedSubTable;
      return;
    });

    const tableDefinition = await rpfmClient.getTableDefinition(dbTable);
    await Promise.all(tablePromises);
    addSortedSubTablesToGlobalData(folder, globalData, parsedSubTables, tableDefinition, dbTable);
    return;
  });

  const locPromise = addLocsToGlobalData(folder, globalData, rpfmClient);

  await Promise.all([...dbPromises, locPromise]);
  return;
};

const addSortedSubTablesToGlobalData = (
  folder: string,
  globalData: GlobalDataInterface,
  parsedSubTables: { [key: string]: Array<TableRecord> },
  tableDefinition: Definition,
  dbTable: RefKey,
) => {
  // Vanilla should only have the data__ sub tables
  if (vanillaFolders.includes(folder)) {
    globalData.parsedData[folder].db[dbTable] = parsedSubTables['data__'];
    return;
  }

  // Mods needs to merge multiple sub tables
  let mergedMap: { [key: string]: TableRecord } = {};
  // Find the primary/composite keys for the dbTable
  const tableKeys: Array<string> = [];
  tableDefinition.fields.forEach((field) => {
    if (field.is_key) tableKeys.push(field.name);
  });

  // Add vanilla records before any mods
  const vanillaTable = folder.includes('3') ? 'vanilla3' : 'vanilla2';
  globalData.parsedData[vanillaTable].db[dbTable].forEach((record) => {
    let recordCompositeKey = '';
    tableKeys.forEach((key) => (recordCompositeKey += record[key]));
    mergedMap[recordCompositeKey] = record;
  });
  // Reverse sort the individual sub table names to roughly follow table load priority (a overwrites z) https://tw-modding.com/index.php/Tutorial:Submodding
  const reverseSortedSubTableNames = Object.keys(parsedSubTables).sort((a, b) => b.localeCompare(a));
  // Check if any mods datacore the table
  if (reverseSortedSubTableNames.includes('data__')) {
    mergedMap = {};
  }
  // Insert each sub table overtop each other
  reverseSortedSubTableNames.forEach((tableName) => {
    parsedSubTables[tableName].forEach((modRecord) => {
      let recordCompositeKey = '';
      tableKeys.forEach((key) => (recordCompositeKey += modRecord[key]));
      mergedMap[recordCompositeKey] = modRecord;
    });
  });

  // Convert the map back into a table to add to globalData
  const mergedMapKeys = Object.keys(mergedMap);
  const mergedTable = mergedMapKeys.map((mapKey) => mergedMap[mapKey]);
  globalData.parsedData[folder].db[dbTable] = mergedTable;
};

const addLocsToGlobalData = async (folder: string, globalData: GlobalDataInterface, rpfmClient: RpfmClient) => {
  // Container for each parsed loc path eg. { 'ancillaries__': { 'ancillary_example_key': 'example_text', 'ancillary_example_key_another': 'example_text' } }
  const parsedLocTables: { [key: string]: Array<{ [key: string]: string }> } = {};
  const locPaths = await rpfmClient.getLocPaths();
  const locPromises = locPaths.map(async (locPath) => {
    if (!locPath.endsWith('.loc')) {
      return;
    }
    const { table_data } = await rpfmClient.decodeLoc(locPath);
    const parsedLocTable = table_data.map((row) => {
      const key = row[0].StringU16 as string;
      const text = row[1].StringU16 as string;
      return { [key]: text };
    });
    parsedLocTables[locPath] = parsedLocTable;
    return;
  });

  await Promise.all(locPromises);

  // Dont worry about merging vanilla, just iterate through each and add it
  if (vanillaFolders.includes(folder)) {
    const locObject: { [key: string]: string } = {};
    Object.values(parsedLocTables).forEach((locTable) =>
      locTable.forEach((loc) => {
        Object.entries(loc).forEach((value) => {
          const key = value[0];
          const text = value[1];
          locObject[key] = text;
        });
      }),
    );

    globalData.parsedData[folder].text = locObject;
  } else {
    // Grab vanilla locs as a base to overwrite
    const vanillaFolder = folder.includes('2') ? 'vanilla2' : 'vanilla3';
    const vanillaLoc = globalData.parsedData[vanillaFolder].text;
    const modLocObj = { ...vanillaLoc };

    // Mods need to follow load prio (a overwrites z) https://tw-modding.com/index.php/Tutorial:Submodding
    const reverseSortedLocTableNames = Object.keys(parsedLocTables).sort((a, b) => b.localeCompare(a));
    reverseSortedLocTableNames.forEach((locTableName) => {
      const locTable = parsedLocTables[locTableName];
      locTable.forEach((loc) => {
        Object.entries(loc).forEach((value) => {
          const key = value[0];
          const text = value[1];
          modLocObj[key] = text;
        });
      });
    });

    globalData.parsedData[folder].text = modLocObj;
  }

  return;
};
