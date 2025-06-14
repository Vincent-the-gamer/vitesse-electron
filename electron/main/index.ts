import { release } from 'node:os'
import path, { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { app, BrowserWindow, nativeImage, shell } from 'electron'
import { useTray } from './tray'
import { useIpcMain } from './ipcMain'
import { dockMenu, useApplicationMenu } from './menu'
import { useAppPath } from './appPath'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1'))
  app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32')
  app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
export const url = process.env.VITE_DEV_SERVER_URL
export const indexHtml = join(process.env.DIST, 'index.html')

const title = 'Vitesse Electron'

async function createWindow() {
  win = new BrowserWindow({
    title,
    width: 960,
    height: 540,
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: false,
  })

  // trick: show window only after page is loaded
  win.once("ready-to-show", () => {
    win?.show()
  })

  win.on("blur", () => {
    win?.setTitle("Ciallo~(∠・ω< )⌒★!")
  })

  win.on("focus", () => {
    win?.setTitle(title)
  })

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url as string)
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools()
  }
  else {
    win.loadFile(indexHtml)
  }

  win.on("close", (event) => {
    event.preventDefault()
    win?.hide()
  })

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:'))
      shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

const appPath = useAppPath()
const iconPath = join(appPath, "./icons/tray.png")
const dockIcon = nativeImage.createFromPath(iconPath)

app.whenReady()
  .then(() => {
    // macOS: Dock
    app.dock?.setMenu(dockMenu)
    app.dock?.setIcon(dockIcon)
  })
  .then(() => {
    createWindow()
    // Tray
    useTray(win!)
    // Menu
    useApplicationMenu(win!)
  })

app.on('window-all-closed', () => {
  win = null
  app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized())
      win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length)
    allWindows[0].focus()

  else
    createWindow()
})

// ipcMain handlers
useIpcMain()