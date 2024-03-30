import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { handleGetFilePaths, handleGetFilePath, handleGetFolderPath, handleGetSkillTree, handleGetCharList } from './utils/main/files';
import { handleConvertSchemas, handleRefreshSchemas } from './utils/main/rpfm';
import { handleBuild } from './utils/main/worker';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//app.on('ready', createWindow);
app
  .whenReady()
  .then(() => {
    ipcMain.handle('dialog:getFilePaths', handleGetFilePaths);
    ipcMain.handle('dialog:getFilePath', handleGetFilePath);
    ipcMain.handle('dialog:getFolderPath', handleGetFolderPath);
    ipcMain.handle('dialog:getCharList', handleGetCharList);
    ipcMain.handle('dialog:getSkillTree', handleGetSkillTree);
    ipcMain.handle('dialog:refreshSchemas', handleRefreshSchemas);
    ipcMain.handle('dialog:convertSchemas', handleConvertSchemas);
    ipcMain.handle('dialog:build', handleBuild);
    createWindow();
  })
  .catch((error) => {
    throw error;
  });

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
