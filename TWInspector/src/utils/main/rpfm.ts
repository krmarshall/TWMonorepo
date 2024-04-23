import { exec } from 'child_process';
import { IpcMainInvokeEvent } from 'electron';

export const handleRefreshSchemas = (_event: IpcMainInvokeEvent, rpfmPath: string, schemaPath: string) => {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    exec(`${rpfmPath} -g warhammer_3 schemas update --schema-path "${schemaPath}"`, (error, stdout, stderr) => {
      resolve({ stdout, stderr });
    });
  });
};

export const handleConvertSchemas = (_event: IpcMainInvokeEvent, rpfmPath: string, schemaPath: string) => {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    exec(`${rpfmPath} -g warhammer_3 schemas to-json --schemas-path "${schemaPath}"`, (error, stdout, stderr) => {
      resolve({ stdout, stderr });
    });
  });
};
