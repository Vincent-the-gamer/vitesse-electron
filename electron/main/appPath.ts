import { app } from "electron"
import { dirname } from "path"

export function useAppPath(): string {
    if (app.isPackaged) {
        return process.platform === "win32" ? dirname(app.getPath("exe")) : process.resourcesPath
    } else {
        return app.getAppPath()
    }
}