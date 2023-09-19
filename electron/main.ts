/* eslint-disable no-console */
import { exec } from 'child_process';
import * as path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  BrowserWindow, app, dialog, ipcMain,
} from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import * as isDev from 'electron-is-dev';

// getAppPath = /Applications/app_name.app/Contents/Resources/app.asar
const resourcesPath = app.getAppPath().replace('app.asar', '');

let win: BrowserWindow | null = null;

function createWindow() {
  win = new BrowserWindow({
    title: 'Gif Compiler',
    height: 700,
    width: 650,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // C++ version
  ipcMain.on('script-run', (event, input, output, filename, duration, optimize, quantize) => {
    const scriptPath = path.join(resourcesPath, 'scripts', 'generate');
    const command = `"${scriptPath}" "${input}" "${output}" "${filename}" ${duration} ${optimize} ${quantize}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        event.sender.send('script-message', `Error: ${error.message}`);

        return;
      }

      if (stderr) {
        const message = stderr.toString().trim();
        console.error(`Error: ${message}`);
        event.sender.send('script-message', `Error: ${message}`);
      }

      if (stdout) {
        const message = stdout.toString().trim();
        console.log(message);
        event.sender.send('script-message', message);
      }

      console.log('Script process exited');
    });
  });

  if (isDev) {
    win.loadURL('http://localhost:3000/index.html');
  } else {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  }

  // eslint-disable-next-line no-return-assign
  win.on('closed', () => win = null);

  // Hot Reloading
  if (isDev) {
    // 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      forceHardReset: true,
      hardResetMethod: 'exit',
    });
  }

  // DevTools
  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS).then((name) => console.log(`Added Extension:  ${name}`)).catch((err) => console.log('An error occurred: ', err));
    win.webContents.openDevTools();
  }
}

ipcMain.handle('dialog:openDirectory', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(win as BrowserWindow, {
    properties: ['openDirectory'],
  });
  if (!canceled) return filePaths[0];
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (win === null) createWindow();
});
