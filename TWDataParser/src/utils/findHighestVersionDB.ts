import { TableInterface } from '../interfaces/SchemaInterfaces';

const findHighestVersionDB = (tableVersions: Array<TableInterface>, dbKey: string) => {
  if (tableVersions.length === 0) {
    throw `Table missing schema definition: ${dbKey}`;
  } else if (tableVersions.length === 1) {
    return tableVersions[0];
  } else {
    let highestVersionIndex = 0;
    let highestVersion = tableVersions[0].version;
    tableVersions.forEach((table, index) => {
      if (table.version > highestVersion) {
        highestVersionIndex = index;
        highestVersion = table.version;
      }
    });

    return tableVersions[highestVersionIndex];
  }
};

export default findHighestVersionDB;
