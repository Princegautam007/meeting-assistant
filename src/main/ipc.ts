import { ipcMain, BrowserWindow } from "electron";
import {
  startSession,
  stopSession,
  getSession
} from "./sessionManager";

let transcriptInterval: NodeJS.Timeout | null = null;

export function registerIPC() {
  ipcMain.handle("session:start", async () => {
    const session = startSession();

    const win = BrowserWindow.getAllWindows()[0];

    let count = 1;

    transcriptInterval = setInterval(() => {
      win.webContents.send(
        "transcript:new",
        `Mock transcript line ${count++}`
      );
    }, 3000);

    return session;
  });

  ipcMain.handle("session:stop", async () => {
    if (transcriptInterval) {
      clearInterval(transcriptInterval);
    }

    return stopSession();
  });

  ipcMain.handle("session:get", async () => {
    return getSession();
  });
}