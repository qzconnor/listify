import { IpcRendererEvent } from "electron"

export default function <T extends unknown[]>(channel: string, listener: (event: IpcRendererEvent, ...args: T) => void) {
    onMounted(() => window.ipcRenderer.on(channel, listener))
    onUnmounted(() => window.ipcRenderer.off(channel, listener))
}