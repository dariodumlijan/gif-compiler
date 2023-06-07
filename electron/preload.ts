// eslint-disable-next-line import/no-extraneous-dependencies
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('appAPI', {
  selectFolder: () => ipcRenderer.invoke('dialog:openDirectory'),
  runScript: (
    input: string,
    output: string,
    filename: string,
    duration: number,
    size: number,
  ) => new Promise((resolve) => {
    ipcRenderer.send('script-run', input, output, filename, duration, size);
    ipcRenderer.on('script-message', (_, args) => {
      resolve(args);
    });
  }),
});
