import { DataBaseExecutor } from "./core/executor";
import { StorageType } from "./types";

export { BaseStorage } from "./core/storage";

export const initializeDatabase = (
  dataBaseName: string,
  dataBaseVersion: number,
  ...storages: StorageType[]
) => {
  new DataBaseExecutor(dataBaseName, dataBaseVersion, ...storages);
};
