import { Notification } from "electron";
import path from "path";
import fs from "fs";

export default class TrackerStorage {
  static initialStorage = {
    trackers: [],
  };

  constructor(dataDir) {
    this.dataDir = dataDir;
    this.file = path.join(this.dataDir, "storage.json");

    const isFileExist = fs.existsSync(this.file);
    if (!isFileExist) {
      this.writeToFile(TrackerStorage.initialStorage);
    }
  }

  getTrackers = () => {
    const storage = this.readFromFile();
    const { trackers } = storage;

    return trackers;
  };

  updateTrackers = (newTrackersList) => {
    const storage = this.readFromFile();
    const newStorage = { ...storage, trackers: newTrackersList };

    this.writeToFile(newStorage);
  };

  writeToFile = (data) => {
    fs.writeFileSync(this.file, JSON.stringify(data), { encoding: "utf-8" });
  };

  readFromFile = () => {
    return JSON.parse(fs.readFileSync(this.file, { encoding: "utf-8" }));
  };

  resetStorage = () => {
    this.writeToFile(TrackerStorage.initialStorage);

    new Notification({ title: "Your data was successfully reset!" });
  };
}
