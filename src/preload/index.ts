// https://electronjs.org/docs/tutorial/security
// Preload File that should be loaded into browser window instead of
// setting nodeIntegration: true for browser window

import { contextBridge, ipcRenderer } from "electron";
import EVENTS from "../constants/events";
import { TrackerListType } from "../constants/types";

const electronServices = {
  addOnLoadListener: (cb: () => void) => ipcRenderer.once(EVENTS.LOADED, cb),
  sendUpdateTrackersListEvent: (trackers: TrackerListType) =>
    ipcRenderer.send(EVENTS.UPDATE_TRACKERS, { trackers }),

  addOnResetDataListener: (cb: () => void) =>
    ipcRenderer.on(EVENTS.RESET_DATA, cb),

  sendRestoreAppMessage: () => ipcRenderer.send(EVENTS.RESTORE_APP),

  addNotificationsListener: (cb: () => void) =>
    ipcRenderer.on(EVENTS.SHOW_NOTIFICATION, cb),

  removeGlobalListeners: () => {
    ipcRenderer.removeAllListeners(EVENTS.SHOW_NOTIFICATION);
    ipcRenderer.removeAllListeners(EVENTS.LOADED);
    ipcRenderer.removeAllListeners(EVENTS.RESET_DATA);
  },
};

contextBridge.exposeInMainWorld("electronService", electronServices);
