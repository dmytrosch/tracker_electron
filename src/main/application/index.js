import { app, BrowserWindow } from "electron";
import path from "path";

export default class TrackerApp {
  constructor() {
    this.window = null
    app.whenReady().then(this.createWindow);

    this.subscribeForAppEvents();
  }

  createWindow = () => {
    this.window = new BrowserWindow({
      title: CONFIG.name,
      width: CONFIG.width,
      height: CONFIG.height,
      webPreferences: {
        worldSafeExecuteJavaScript: true,
        preload: path.join(app.getAppPath(), "preload", "index.js"),
      },
    });

    this.window.loadURL("http://localhost:3000/");

    this.window.on("closed", () => {
      this.window = null;
    });
  };

  subscribeForAppEvents = () => {
    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });
  };
}
