import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('appAPI', {
  selectFolder: () => ipcRenderer.invoke('dialog:openDirectory'),
  runScript: (input: string, output: string, filename: string, duration: number, size: number) => ipcRenderer.send('run-script', input, output, filename, duration, size),
});
