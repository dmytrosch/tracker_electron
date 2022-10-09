import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import windowStateKeeper from "electron-window-state";
import TrackerStorage from "./storage";
import createAppMenu from "./menu";
import EVENTS from "../../constants/events";
import icon from '../../../resources/icon.png'
import createAppTray from "./tray";

export default class TrackerApp {
  constructor() {
    this.window = null;
    this.userDataDir = path.resolve(app.getPath("home"), ".tracker");

    const isDirectoryExist = fs.existsSync(this.userDataDir);
    if (!isDirectoryExist) {
      fs.mkdirSync(this.userDataDir);
    }

    this.trackerStorage = new TrackerStorage(this.userDataDir);

    app.whenReady().then(this.onReady);
    this.checkForTheSecondInstance();
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
      icon: path.resolve(__dirname, icon),
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

    mainWindowState.manage(this.window);

    this.window.on("closed", () => {
      this.window = null;
    });

    this.window.webContents.on("did-finish-load", () => {
      const trackers = this.trackerStorage.getTrackers();
      this.window.webContents.send(EVENTS.LOADED, {
        trackers,
      });
      this.sendNotification('Welcome back!')
    });

    ipcMain.on(EVENTS.UPDATE_TRACKERS, (_, { trackers }) =>
      this.trackerStorage.updateTrackers(trackers)
    );
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
          this.window.show();
          this.window.focus();
          dialog.showErrorBox(
            "tracker",
            "Application has been already launched"
          );
        }
      });
    }
  };

  sendNotification = (text) =>
    this.window.webContents.send(EVENTS.SHOW_NOTIFICATION, { text });

  onResetData = () => {
    this.trackerStorage.resetStorage;
    this.sendNotification("Your data was successfully reset!");
  };

  onReady = () => {
    this.createWindow();
    this.menu = createAppMenu({
      window: this.window,
      onResetData: this.onResetData,
    });
    this.tray = createAppTray({
      window: this.window,
    })
  };
}
