import { Notification, app } from "electron";
import type { LoginConfig, NotificationType } from "types";

export function createNotification(noti: NotificationType) {
    const { title, body } = noti

    new Notification({
        title,
        body
    }).show()
}

export function configLogin(config: LoginConfig) {
    app.setLoginItemSettings({
        openAtLogin: config.openAtLogin
    })
}