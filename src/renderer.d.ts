export interface IElectronAPI {
  selectFolder: () => Promise<string>,
  runScript: (
    input: string,
    output: string,
    filename: string,
    duration: number,
    optimize?: boolean,
    quantize?: number,
  ) => Promise<string>,
}

declare global {
  interface Window {
    electron: IElectronAPI
  }
}
