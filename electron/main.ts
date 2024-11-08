import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import type { AppWindowAction } from '~/types'

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js
// │ ├─┬ preload
// │ │ └── index.js
// │ ├─┬ renderer
// │ │ └── index.html
process.env.APP_ROOT = path.join(__dirname, '..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, '.output/public')

process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      preload: path.join(MAIN_DIST, 'preload.js'),
    },
    frame: false,
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(process.env.VITE_PUBLIC!, 'index.html'))
  }

  initWin()
}

function initIpc() {
  ipcMain.handle('app-window', (event, args: AppWindowAction | AppWindowAction[]) => {
    if (!win) return;

    const actions = Array.isArray(args) ? args : [args]

    switch (actions[0].action) {
      case 'minimize':
        win.minimize()
        break
      case 'maximize':
        win.maximize()
        break
      case 'toggleMaximize':
        win.isMaximized() ? win.unmaximize() : win.maximize()
        break;
      case 'close':
        win.close()
        break
    }
    return win.isMaximized()
  })
}

function initWin() {
  win?.on("maximize", () => win?.webContents.send("app-window-change", {
    isMaximized: win?.isMaximized()
  }))

  win?.on("unmaximize", () => win?.webContents.send("app-window-change", {
    isMaximized: win?.isMaximized()
  }))

  win?.on('minimize', () => win?.webContents.send("app-window-change", {
    isMinimized: true
  }))

  win?.on('restore', () => win?.webContents.send("app-window-change", {
    isMinimized: false
  }))
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  initIpc()
  createWindow()
})
