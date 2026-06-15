import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("capsule", {
  startSession: () => ipcRenderer.invoke("session:start"),
  stopSession: () => ipcRenderer.invoke("session:stop"),
  getSession: () => ipcRenderer.invoke("session:get"),

  onTranscript: (callback: (text: string) => void) => {
    ipcRenderer.on("transcript:new", (_, text) => {
      callback(text);
    });
  }
});