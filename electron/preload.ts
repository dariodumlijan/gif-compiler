// eslint-disable-next-line import/no-extraneous-dependencies
/* eslint-disable import/no-extraneous-dependencies */
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  selectFolder: () => ipcRenderer.invoke('dialog:openDirectory'),
  runScript: (
    input: string,
    output: string,
    filename: string,
    duration: number,
    optimize: boolean,
    quantize: number,
  ) => new Promise((resolve) => {
    ipcRenderer.send('script-run', input, output, filename, duration, optimize, quantize);
    ipcRenderer.on('script-message', (_, args) => {
      resolve(args);
    });
  }),
});
