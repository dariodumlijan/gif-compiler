import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { exec } from 'child_process'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// getAppPath = /Applications/<productName>.app/Contents/Resources/app.asar
const resourcesPath = app.getAppPath().replace('app.asar', '')

let win: BrowserWindow | null = null

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: 'Gif Compiler',
    height: 700,
    width: 650,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  win = mainWindow

  // C++ code
  ipcMain.on('script-run', (event, input, output, filename, duration, optimize, quantize) => {
    const scriptPath = join(resourcesPath, 'scripts', 'generate')
    const command = `"${scriptPath}" "${input}" "${output}" "${filename}" ${duration} ${optimize} ${quantize}`

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`)
        event.sender.send('script-message', `Error: ${error.message}`)

        return
      }

      if (stderr) {
        const message = stderr.toString().trim()
        console.error(`Error: ${message}`)
        event.sender.send('script-message', `Error: ${message}`)
      }

      if (stdout) {
        const message = stdout.toString().trim()
        console.log(message)
        event.sender.send('script-message', message)
      }

      console.log('Script process exited')
    })
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

ipcMain.handle('dialog:openDirectory', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(win as BrowserWindow, {
    properties: ['openDirectory']
  })

  if (!canceled) return filePaths[0]

  return undefined
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
