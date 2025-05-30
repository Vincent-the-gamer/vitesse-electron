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
            label: "Quit App",
            type: "normal",
            click: () => {
                app.quit()
            }
        }
    ])
    tray.setToolTip("Vitesse Electron")
    tray.setContextMenu(contextMenu)

    tray.on("click", (event) => {
        win?.show()
    })

    tray.on("right-click", () => {
        tray?.popUpContextMenu(contextMenu)
    })
}