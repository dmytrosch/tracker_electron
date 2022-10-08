import { app, BrowserWindow, dialog } from "electron";
import path from "path";
import fs from 'fs'
import windowStateKeeper from "electron-window-state";
import TrackerStorage from "./storage";

export default class TrackerApp {
  constructor() {
    this.window = null;
    this.userDataDir = path.resolve(app.getPath("home"), ".tracker");

    const isDirectoryExist = fs.existsSync(this.userDataDir)
    if(!isDirectoryExist){
      fs.mkdirSync(this.userDataDir)
    }

    this.trackerStorage = new TrackerStorage(this.userDataDir)

    app.whenReady().then(this.createWindow);
    this.checkForTheSecondInstance()
    this.subscribeForAppEvents();
  }

  createWindow = () => {
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

  checkForTheSecondInstance = () => {
    const lock = app.requestSingleInstanceLock();
    if (!lock) {
      app.quit();
    } else {
      app.on("second-instance", () => {
        if (this.window) {
          this.window.show()
          this.window.focus()
          dialog.showErrorBox(
            'tracker',
            'Application has been already launched',
          )
        }
      });
    }
  };
}
