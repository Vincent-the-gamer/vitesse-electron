import type { NotificationType } from 'types';
import { sendMessageToMainProcess } from '~/utils/communication';

export default function useNotification(noti: NotificationType) {
    const { title, body } = noti
    sendMessageToMainProcess({
        id: "notification",
        message: {
            title,
            body
        }
    })
}