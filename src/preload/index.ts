import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  selectFolder: () => ipcRenderer.invoke('dialog:openDirectory'),
  runScript: (
    input: string,
    output: string,
    filename: string,
    duration: number,
    optimize: boolean,
    quantize: number
  ) =>
    new Promise((resolve) => {
      ipcRenderer.send('script-run', input, output, filename, duration, optimize, quantize)
      ipcRenderer.on('script-message', (_, args) => {
        resolve(args)
      })
    })
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
