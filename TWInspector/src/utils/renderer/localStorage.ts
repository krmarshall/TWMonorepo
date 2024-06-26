export const loadRpfmPath = () => {
  return localStorage.getItem('rpfmPath') ?? '';
};

export const saveRpfmPath = (path: string) => {
  localStorage.setItem('rpfmPath', path);
};

export const loadSchemaPath = () => {
  return localStorage.getItem('schemaPath') ?? '';
};

export const saveSchemaPath = (path: string) => {
  window.API.setWorkspacePath(path);
  localStorage.setItem('schemaPath', path);
};

export const loadWorkspacePath = () => {
  const path = localStorage.getItem('workspacePath') ?? '';
  window.API.setWorkspacePath(path);
  return path;
};

export const saveWorkspacePath = (path: string) => {
  localStorage.setItem('workspacePath', path);
};

export const loadLastSelectedModPaths = () => {
  return JSON.parse(localStorage.getItem('lastSelectedModPaths') ?? '[]');
};

export const saveLastSelectedModPaths = (filePaths: Array<string>) => {
  localStorage.setItem('lastSelectedModPaths', JSON.stringify(filePaths));
};

export const loadWarhammer3Location = () => {
  return localStorage.getItem('warhammer3Location') ?? '';
};

export const saveWarhammer3Location = (location: string) => {
  localStorage.setItem('warhammer3Location', location);
};
