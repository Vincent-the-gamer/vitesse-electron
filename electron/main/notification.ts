import { Notification } from "electron";
import type { NotificationType } from "types";

export function createNotification(noti: NotificationType) {
    const { title, body } = noti

    new Notification({
        title,
        body
    }).show()
}