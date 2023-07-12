export interface IElectronAPI {
  selectFolder: () => Promise<string>,
  installDeps: () => Promise<{
    message: string,
    status: 200 | 500,
  }>,
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
