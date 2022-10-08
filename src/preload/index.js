// https://electronjs.org/docs/tutorial/security
// Preload File that should be loaded into browser window instead of
// setting nodeIntegration: true for browser window

import { contextBridge, ipcRenderer } from "electron";
import EVENTS from "../constants/events";

contextBridge.exposeInMainWorld("electronService", {
  addOnLoadListener: (cb) => ipcRenderer.on(EVENTS.LOADED, cb),
  removeOnLoadListener: () => ipcRenderer.removeAllListeners(EVENTS.LOADED),

  sendUpdateTrackersListEvent: (trackers) =>
    ipcRenderer.send(EVENTS.UPDATE_TRACKERS, { trackers }),

  sendShowNativeNotificationEvent: (text, options) =>
    ipcRenderer.send(EVENTS.SHOW_NOTIFICATION, { text, options }),
});
