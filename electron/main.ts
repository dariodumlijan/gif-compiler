import { exec } from 'child_process';
import * as path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  BrowserWindow, app, dialog, ipcMain,
} from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import * as isDev from 'electron-is-dev';
/* eslint-disable no-console */

let win: BrowserWindow | null = null;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  ipcMain.handle('dialog:openDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(win as BrowserWindow, {
      properties: ['openDirectory'],
    });
    if (!canceled) {
      return filePaths[0];
    }
  });
  ipcMain.on('run-script', (event, input, output, filename, duration, maxSize) => {
    let rubyScriptPath = path.join(__dirname, 'scripts', 'generate.py');
    if (isDev) {
      rubyScriptPath = 'scripts/generate.py';
    }

    const child = exec(`python3 ${rubyScriptPath} ${input} ${output} ${filename} ${duration} ${maxSize}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error.message}`);
        event.reply('script-execution-failed');

        return;
      }
      console.log(`Script output: ${stdout}`);
      if (stderr) console.error(`Script error: ${stderr}`);
      event.reply('script-execution-completed');
    });

    child.on('exit', (code) => {
      console.log(`Script process exited with code ${code}`);
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
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
