import { GlobalDataInterface, RefKey, TableRecord } from './interfaces/GlobalDataInterface';
import { SchemaInterface, TableInterface } from './interfaces/SchemaInterfaces';
import cleanList from './lists/cleanLists';
import findHighestVersionDB from './utils/findHighestVersionDB';

const generateTables = (folder: string, globalData: GlobalDataInterface, dbList: Array<RefKey>, schema: SchemaInterface) => {
  const tables: { [key in RefKey]?: Table } = {};
  dbList.forEach((db) => {
    tables[db] = new Table(
      db,
      findHighestVersionDB(schema.definitions[db + '_tables'], db),
      globalData.parsedData[folder].db[db + '_tables'],
      globalData.parsedData[folder].text,
    );
  });

  const missingTablesSet = new Set<string>();
  Object.keys(tables).forEach((tableKey) => tables[tableKey as RefKey]?.linkTables(tables, missingTablesSet));
  return tables;
};

export default generateTables;

export class Table {
  tableName: RefKey;
  tableSchema: TableInterface;
  records: Array<TableRecord>;
  indexedKeys: { [key: string]: { [key: string]: number } };

  constructor(tableName: RefKey, tableSchema: TableInterface, tableData: Array<TableRecord>, tableLoc: TableRecord) {
    this.tableName = tableName;
    this.tableSchema = tableSchema;
    this.records = tableData;
    this.indexedKeys = {};

    // Grab keys for fields we want to index, and locs we want to link
    const tablePKeys: Array<string> = [];
    tableSchema.fields.forEach((field) => {
      if (field.is_key) {
        tablePKeys.push(field.name);
        this.indexedKeys[field.name] = {};
      }
    });
    const tableLocFields: { [key: string]: string } = {};
    tableSchema.localised_fields.forEach((field) => {
      if (field.description === 'Deprecated - do not fill in') {
        // Do nothing
      } else {
        tableLocFields[field.name] = field.default_value ?? '';
      }
    });

    const tableCleanList = cleanList[tableName];
    this.records.forEach((record: TableRecord, index: number) => {
      // Create index for keyed fields
      // record[pKey] will always be a string before linkTables()
      tablePKeys.forEach((pKey) => (this.indexedKeys[pKey][record[pKey] as string] = index));

      // Go through columns and delete unwanted ones
      if (tableCleanList !== undefined) {
        tableCleanList.forEach((column) => delete record[column]);
      }

      // Link locs to records
      Object.entries(tableLocFields).forEach((locField) => {
        if (tablePKeys.length === 1) {
          record[locField[0]] = tableLoc[`${tableName}_${locField[0]}_${record[tablePKeys[0]]}`] ?? locField[1];
        } else {
          const guessCompKey = tablePKeys.reduce((prev, cur) => prev + record[cur], '');
          const guessLoc = tableLoc[`${tableName}_${locField[0]}_${guessCompKey}`];
          record[locField[0]] = guessLoc ?? 'COMPOSITE KEY MISSING/INVALID LOC';
        }
      });
    });
  }

  findRecordByKey = (keyName: string, keyValue: string) => {
    const recordIndex = this.indexedKeys[keyName][keyValue];
    return this.records[recordIndex];
  };

  linkTables = (tables: { [key in RefKey]?: Table }, missingTablesSet: Set<string>) => {
    const referenceFields: Array<{ fieldName: string; refTable: RefKey; refKey: string }> = [];
    this.tableSchema.fields.forEach((field) => {
      if (field.is_reference !== null) {
        referenceFields.push({ fieldName: field.name, refTable: field.is_reference[0] as RefKey, refKey: field.is_reference[1] });
      }
    });

    this.records.forEach((record) => {
      referenceFields.forEach((refField) => {
        if (tables[refField.refTable] === undefined) {
          missingTablesSet.add(refField.refTable);
        } else if (record[refField.fieldName] === undefined) {
          // Ref field was deleted by cleanColumn
        } else {
          if (typeof record[refField.fieldName] !== 'string') {
            throw `Table already linked: ${this.tableName}`;
          }
          const fieldCurValue = record[refField.fieldName] as string;
          const refRecord = tables[refField.refTable]?.findRecordByKey(refField.refKey, fieldCurValue);
          if (refRecord !== undefined) {
            // Local Reference
            if (record.localRefs === undefined) record.localRefs = {};
            record.localRefs[refField.refTable as RefKey] = refRecord;

            // Foreign Reference
            if (refRecord.foreignRefs === undefined) refRecord.foreignRefs = {};
            if (refRecord.foreignRefs[this.tableName as RefKey] === undefined) refRecord.foreignRefs[this.tableName as RefKey] = [];
            refRecord.foreignRefs[this.tableName as RefKey]?.push(record);
          }
        }
      });
    });
  };
}
