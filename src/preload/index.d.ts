import { ElectronAPI } from '@electron-toolkit/preload'

export interface API {
  selectFolder: () => Promise<string | undefined>
  runScript: (
    input: string,
    output: string,
    filename: string,
    duration: number,
    optimize?: boolean,
    quantize?: number
  ) => Promise<string>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
