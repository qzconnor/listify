import { ipcRenderer, contextBridge } from 'electron'
import type { IpcRendererEvent } from 'electron'
// --------- Expose some API to the Renderer process ---------

export const api = {
  on<I extends unknown[]>(channel: string, listener: (event: IpcRendererEvent, ...args: I) => void) {
    ipcRenderer.on(channel, listener)
    return this
  },
  off<I extends unknown[]>(channel: string, listener: (event: IpcRendererEvent, ...args: I) => void) {
    ipcRenderer.off(channel, listener)
    return this
  },
  send<I extends unknown[]>(channel: string, ...args: I) {
    ipcRenderer.send(channel, ...args)
  },
  invoke<O, I extends unknown[]>(channel: string, ...args: I) {
    return ipcRenderer.invoke(channel, ...args) as Promise<O>
  },
  // invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
  //   const [channel, ...omit] = args
  //   return ipcRenderer.invoke(channel, ...omit)
  // },

  // You can expose other APTs you need here.
  // ...
}



contextBridge.exposeInMainWorld('ipcRenderer', api)
