import { GlobalDataInterface, TableRecord } from './interfaces/GlobalDataInterface';
import log from './utils/log';
import { SchemaInterface } from './interfaces/SchemaInterfaces';
import findHighestVersionDB from './utils/findHighestVersionDB';

const overwriteMerge = (vanillaTable: Array<TableRecord>, moddedTables: Array<Array<TableRecord>>, sameProps: Array<string>) => {
  const mergedMap: { [key: string]: TableRecord } = {};
  vanillaTable.forEach((record) => {
    const recordKey = sameProps.reduce((prev, next) => prev + record[next], '');
    if (mergedMap[recordKey] === undefined) {
      mergedMap[recordKey] = record;
    } else {
      log(`mergeTables conflict: ${recordKey}`, 'red');
    }
  });

  moddedTables.forEach((modTable) => {
    modTable.forEach((modRecord) => {
      const recordKey = sameProps.reduce((prev, next) => prev + modRecord[next], '');
      mergedMap[recordKey] = modRecord;
    });
  });

  const mergedMapKeys = Object.keys(mergedMap);
  const mergedTable = mergedMapKeys.map((mapKey) => mergedMap[mapKey]);
  return mergedTable;
};

const mergeTablesIntoVanilla = (folder: string, globalData: GlobalDataInterface, schema: SchemaInterface) => {
  const vanillaFolder = folder.includes('2') ? 'vanilla2' : 'vanilla3';

  const vanillaKeys = Object.keys(globalData.parsedData[vanillaFolder].db);

  vanillaKeys.forEach((vanillaKey) => {
    const vanillaTable = globalData.parsedData[vanillaFolder].db[vanillaKey];
    if (globalData.extractedData[folder].db[vanillaKey] !== undefined) {
      const tableKeys: Array<string> = [];
      findHighestVersionDB(schema.definitions[vanillaKey], vanillaKey).fields.forEach((field) => {
        if (field.is_key) {
          tableKeys.push(field.name);
        }
      });

      const moddedKeys = Object.keys(globalData.extractedData[folder].db[vanillaKey]);
      const moddedTables = moddedKeys.map((moddedKey) => globalData.extractedData[folder].db[vanillaKey][moddedKey]);
      const mergedTable = overwriteMerge(vanillaTable, moddedTables, tableKeys);
      globalData.parsedData[folder].db[vanillaKey] = mergedTable;
    } else {
      globalData.parsedData[folder].db[vanillaKey] = vanillaTable;
    }
  });
};

const mergeLocsIntoVanilla = (folder: string, globalData: GlobalDataInterface) => {
  const vanillaFolder = folder.includes('2') ? 'vanilla2' : 'vanilla3';
  const vanillaLoc = globalData.parsedData[vanillaFolder].text;
  const modLoc = globalData.extractedData[folder].text;

  const combinedLoc = { ...vanillaLoc, ...modLoc };

  globalData.parsedData[folder].text = combinedLoc;
};

export { mergeTablesIntoVanilla, mergeLocsIntoVanilla };
