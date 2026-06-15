import { BrowserWindow, app } from "electron";
import path from "path";

export async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.webContents.openDevTools();

  const isDev = !app.isPackaged;

  if (isDev) {
    await win.loadURL("http://localhost:5173");
  } else {
    await win.loadFile(
      path.join(__dirname, "../../dist/index.html")
    );
  }

  return win;
}