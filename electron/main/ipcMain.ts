import { app, ipcMain, BrowserWindow } from "electron";
import { configLogin, createNotification } from './actions'
import type { NotificationType, LoginConfig } from 'types'
import { indexHtml, url } from "./index";

export function useIpcMain() {
    // New window example arg: new windows url
    ipcMain.handle('open-win', (_, arg) => {
        const childWindow = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        })

        if (process.env.VITE_DEV_SERVER_URL)
            childWindow.loadURL(`${url}#${arg}`)

        else
            childWindow.loadFile(indexHtml, { hash: arg })
    })

    // Notification message
    ipcMain.on('notification', (_, msg: NotificationType) => {
        createNotification({
            title: msg.title,
            body: msg.body
        })
    })

    // Login message
    // send run on login config to renderer
    ipcMain.on("get-login-config", (event, _) => {
        const { openAtLogin } = app.getLoginItemSettings()
        event.reply("get-login-config-reply", openAtLogin)
    })

    // set login config
    ipcMain.on("login-config", (_, msg: LoginConfig) => {
        configLogin(msg)
    })
}