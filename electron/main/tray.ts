import { app, Menu, Tray, nativeImage, BrowserWindow } from 'electron'
import { join } from 'node:path'
import { useAppPath } from './appPath'

const appPath = useAppPath()

let tray: Tray | null = null
const iconPath = process.platform === "win32" ? 
                  join(appPath, './icons/icon-small.ico') : 
                  join(appPath, './icons/tray.png')
const trayIcon = nativeImage.createFromPath(iconPath)

export function useTray(win: BrowserWindow) {
    // Tray
    tray = new Tray(trayIcon)
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Show",
            accelerator: "CmdOrCtrl+O",
            click: () => {
                win.show()
            }
        },
        {
            label: "Hide",
            accelerator: "CmdOrCtrl+W",
            click: () => {
                win.hide()
            }
        },
        {
            label: "Quit App",
            accelerator: "CmdOrCtrl+Q",
            click: () => {
                win.destroy()
                app.quit()
            }
        }
    ])
    tray.setToolTip("Vitesse Electron")
    tray.setContextMenu(contextMenu)
}