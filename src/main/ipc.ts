import { ipcMain } from "electron";
import {
  startSession,
  stopSession,
  getSession
} from "./sessionManager";

export function registerIPC() {
  ipcMain.handle("session:start", async () => {
    const session = startSession();

    console.log("Session Started:", session.id);

    return session;
  });

  ipcMain.handle("session:stop", async () => {
    const session = stopSession();

    console.log("Session Stopped");

    return session;
  });

  ipcMain.handle("session:get", async () => {
    return getSession();
  });
}