import { contextBridge, ipcRenderer } from 'electron';
import { CharacterInterface } from './@types/CharacterInterfaceRef';
import { CharacterListInterface } from './@types/CharacterListInterfaceRef';
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

export const API = {
  getFilePaths: (): Promise<Array<string>> => ipcRenderer.invoke('dialog:getFilePaths'),
  getFilePath: (): Promise<string> => ipcRenderer.invoke('dialog:getFilePath'),
  getFolderPath: (): Promise<string> => ipcRenderer.invoke('dialog:getFolderPath'),
  getCharList: (workspacePath: string): Promise<CharacterListInterface> => ipcRenderer.invoke('dialog:getCharList', workspacePath),
  getSkillTree: (workspacePath: string, faction: string, agentKey: string): Promise<CharacterInterface> =>
    ipcRenderer.invoke('dialog:getSkillTree', workspacePath, faction, agentKey),
  refreshSchemas: (rpfmPath: string, schemaPath: string): Promise<{ stdout: string; stderr: string }> =>
    ipcRenderer.invoke('dialog:refreshSchemas', rpfmPath, schemaPath),
  convertSchemas: (rpfmPath: string, schemaPath: string): Promise<{ stdout: string; stderr: string }> =>
    ipcRenderer.invoke('dialog:convertSchemas', rpfmPath, schemaPath),
  build: (
    rpfmPath: string,
    schemaPath: string,
    workspacePath: string,
    warhammer3Location: string,
    modFilePaths: Array<string>,
    forceExtract: boolean,
  ): Promise<string> =>
    ipcRenderer.invoke('dialog:build', rpfmPath, schemaPath, workspacePath, warhammer3Location, modFilePaths, forceExtract),
};

contextBridge.exposeInMainWorld('API', API);
