import { DataBaseExecutor } from "./core/executor";
import { StorageType } from "./types";

export { BaseStorage } from "./core/storage";
export {Query} from "./core/query"
export { useStorageEvent, useStorageInit } from "./react";
export { subscribeForChanges, subscribeForDatabaseReady } from "./vanilla";

export const initializeDatabase = (
  dataBaseName: string,
  dataBaseVersion: number,
  ...storages: StorageType[]
) => {
  new DataBaseExecutor(dataBaseName, dataBaseVersion, ...storages);
};
