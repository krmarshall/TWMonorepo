import { IpcMainInvokeEvent, dialog } from 'electron';
import { readJson } from 'fs-extra';

export const handleGetFilePaths = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Select Pack File(s) to Open',
    filters: [
      { name: 'Packs', extensions: ['pack'] },
      { name: 'All Files', extensions: ['*'] },
    ],
    properties: ['openFile', 'multiSelections'],
  });

  if (!canceled) {
    return filePaths;
  }
};

export const handleGetFilePath = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Select rpfm_cli.exe',
    filters: [
      { name: 'Executables', extensions: ['exe'] },
      { name: 'All Files', extensions: ['*'] },
    ],
    properties: ['openFile'],
  });

  if (!canceled) {
    return filePaths[0];
  }
};

export const handleGetFolderPath = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Select Folder',
    properties: ['openDirectory'],
  });

  if (!canceled) {
    return filePaths[0];
  }
};

export const handleGetCharList = async (_event: IpcMainInvokeEvent, workspacePath: string) => {
  return readJson(`${workspacePath}/characterList.json`);
};

export const handleGetSkillTree = async (
  _event: IpcMainInvokeEvent,
  workspacePath: string,
  faction: string,
  agentKey: string,
) => {
  return readJson(`${workspacePath}/output/skills/mod/${faction}/${agentKey}.json`);
};
