import { app, BrowserWindow } from "electron";
import path from "path";
import windowStateKeeper from "electron-window-state";

export default class TrackerApp {
  constructor() {
    this.window = null;
    this.userDataDir = path.resolve(app.getPath("home"), ".tracker");

    app.whenReady().then(this.createWindow);
    this.subscribeForAppEvents();
  }

  createWindow = () => {
    console.log();
    const mainWindowState = windowStateKeeper({
      defaultWidth: 580,
      defaultHeight: 760,
      path: this.userDataDir,
    });

    this.window = new BrowserWindow({
      width: mainWindowState.width,
      height: mainWindowState.height,
      minHeight: 600,
      minWidth: 400,
      x: mainWindowState.x,
      y: mainWindowState.y,
      show: true,
      webPreferences: {
        preload: path.join(app.getAppPath(), "preload/index.js"),
      },
      fullscreenable: false,
    });

    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction) {
      this.window.loadFile(path.join(app.getAppPath(), "renderer/index.html"));
    } else {
      this.window.loadURL("http://localhost:3000/");
    }

    this.window.on("closed", () => {
      this.window = null;
    });

    mainWindowState.manage(this.window);
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
