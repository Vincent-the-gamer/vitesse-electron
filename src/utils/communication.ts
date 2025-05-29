import { ipcRenderer } from "electron"

interface Message {
    id: string,
    message: Record<string, any>
}

export function sendMessageToMainProcess(msg: Message) {
    ipcRenderer.send(msg.id, msg.message)
}