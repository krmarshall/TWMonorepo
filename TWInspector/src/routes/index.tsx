import { createFileRoute } from '@tanstack/react-router';
import { useContext, useState } from 'react';
import { ElectronContext, ElectronContextActions } from '../contexts/ElectronContext';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { state, dispatch } = useContext(ElectronContext);
  const { warhammer3Location, lastSelectedModPaths, rpfmPath, schemaPath, workspacePath } = state;

  const [log, setLog] = useState('');

  const setRpfmPath = async () => {
    const path = await window.API.getFilePath();
    dispatch({ type: ElectronContextActions.changeRpfmPath, payload: { rpfmPath: path } });
  };

  const setSchemaPath = async () => {
    const path = await window.API.getFolderPath();
    dispatch({ type: ElectronContextActions.changeSchemaPath, payload: { schemaPath: path } });
  };

  const setWorkspacePath = async () => {
    const path = await window.API.getFolderPath();
    dispatch({ type: ElectronContextActions.changeWorkspacePath, payload: { workspacePath: path } });
  };

  const setWH3Path = async () => {
    const path = await window.API.getFolderPath();
    dispatch({ type: ElectronContextActions.changeWarhammer3Location, payload: { warhammer3Location: path } });
  };

  const setModFilePaths = async () => {
    const paths = await window.API.getFilePaths();
    dispatch({ type: ElectronContextActions.changeLastSelectedModPaths, payload: { lastSelectedModPaths: paths } });
  };

  const refreshSchemas = async () => {
    const { stdout, stderr } = await window.API.refreshSchemas(rpfmPath, schemaPath);
    setLog(stdout + '\n' + stderr);
  };

  const convertSchemas = async () => {
    const { stdout, stderr } = await window.API.convertSchemas(rpfmPath, schemaPath);
    setLog(stdout + '\n' + stderr);
  };

  const clearLog = () => {
    setLog('');
  };

  const build = async () => {
    setLog(await window.API.build(rpfmPath, schemaPath, workspacePath, warhammer3Location, lastSelectedModPaths, false));
  };

  const buildForce = async () => {
    setLog(await window.API.build(rpfmPath, schemaPath, workspacePath, warhammer3Location, lastSelectedModPaths, true));
  };

  return (
    <div className="p-2">
      <p>rpfm_cli Location: {rpfmPath}</p>
      <button className="border p-1" onClick={setRpfmPath}>
        Set rpfm_cli location
      </button>

      <p>schemas Location: {schemaPath}</p>
      <button className="border p-1" onClick={setSchemaPath}>
        Set schemas location
      </button>

      <p>Workspace Location: {workspacePath}</p>
      <button className="border p-1" onClick={setWorkspacePath}>
        Set workspace location
      </button>

      <p>Warhammer 3 Data Location: {warhammer3Location}</p>
      <button className="border p-1" onClick={setWH3Path}>
        Set WH3 Location
      </button>

      <p>Mod File Paths: {lastSelectedModPaths}</p>
      <button className="border p-1" onClick={setModFilePaths}>
        Select Mods
      </button>

      <hr />
      <button className="border p-1" onClick={refreshSchemas}>
        Refresh Schemas
      </button>
      <button className="border p-1" onClick={convertSchemas}>
        Convert Schemas
      </button>
      <button className="border p-1" onClick={build}>
        Build
      </button>
      <button className="border p-1" onClick={buildForce}>
        Force Build
      </button>

      <hr />
      <button className="border p-1" onClick={clearLog}>
        Clear Log
      </button>
      <p>{log}</p>
    </div>
  );
}
