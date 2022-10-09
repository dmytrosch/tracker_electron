// https://electronjs.org/docs/tutorial/security
// Preload File that should be loaded into browser window instead of
// setting nodeIntegration: true for browser window

import { contextBridge, ipcRenderer } from "electron";
import EVENTS from "../constants/events";

contextBridge.exposeInMainWorld("electronService", {
  addOnLoadListener: (cb) => ipcRenderer.once(EVENTS.LOADED, cb),
  sendUpdateTrackersListEvent: (trackers) =>
    ipcRenderer.send(EVENTS.UPDATE_TRACKERS, { trackers }),

  addOnResetDataListener: (cb) => ipcRenderer.on(EVENTS.RESET_DATA, cb),

  sendRestoreAppMessage: () => ipcRenderer.send(EVENTS.RESTORE_APP),

  addNotificationsListener: (cb) =>
    ipcRenderer.on(EVENTS.SHOW_NOTIFICATION, cb),

  removeGlobalListeners: () => {
    ipcRenderer.removeAllListeners(EVENTS.SHOW_NOTIFICATION);
    ipcRenderer.removeAllListeners(EVENTS.LOADED);
    ipcRenderer.removeAllListeners(EVENTS.RESET_DATA);
  },
});
