import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("capsule", {
  startSession: () => ipcRenderer.invoke("session:start"),
  stopSession: () => ipcRenderer.invoke("session:stop"),
  getSession: () => ipcRenderer.invoke("session:get")
});