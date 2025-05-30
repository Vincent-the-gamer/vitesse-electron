import { app, Menu, Tray, nativeImage, BrowserWindow } from 'electron'
import { join } from 'node:path'

const appPath = app.getAppPath()

let tray: Tray | null = null
const iconPath = join(appPath, "./icons/tray.png")
const trayIcon = nativeImage.createFromPath(iconPath)

export function useTray(win: BrowserWindow) {
    // Tray
    tray = new Tray(trayIcon)
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Show Main Window",
            click: () => {
                win.show()
            }
        },
        {
            label: "Hide Main Window",
            click: () => {
                win.hide()
            }
        },
        {
            label: "Quit App",
            click: () => {
                win.destroy()
                app.quit()
            }
        }
    ])
    tray.setToolTip("Vitesse Electron")
    tray.setContextMenu(contextMenu)
}