import * as path from 'path';
import * as fs from 'fs';
import { TrackerListType } from '../../constants/types';

interface ITrackerStorage {
  trackers: TrackerListType;
}

class TrackerStorage {
  static initialStorage: ITrackerStorage = {
    trackers: [],
  };

  private dataDir: string;
  private file: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    this.file = path.join(this.dataDir, 'storage.json');

    const isFileExist = fs.existsSync(this.file);
    if (!isFileExist) {
      this.writeToFile(TrackerStorage.initialStorage);
    }
  }

  public getTrackers = (): TrackerListType => {
    const storage = this.readFromFile();
    const { trackers } = storage;

    return trackers;
  };

  public updateTrackers = (newTrackersList: TrackerListType): void => {
    const storage = this.readFromFile();
    const newStorage: ITrackerStorage = {
      ...storage,
      trackers: newTrackersList,
    };

    this.writeToFile(newStorage);
  };

  private writeToFile = (data: ITrackerStorage): void => {
    fs.writeFileSync(this.file, JSON.stringify(data), { encoding: 'utf-8' });
  };

  private readFromFile = (): ITrackerStorage => {
    return JSON.parse(fs.readFileSync(this.file, { encoding: 'utf-8' }));
  };

  public resetStorage = (): void => {
    this.writeToFile(TrackerStorage.initialStorage);
  };
}

export default TrackerStorage;
