import {IStaticStorage} from "../types";
import {DataBaseExecutor} from "../core/executor";

export const subscribeForDatabaseReady = (databaseName: string, action: () => void) => {
  window.addEventListener(databaseName, action);
};

export const initDataBase = (dataBaseName: string, dataBaseVersion: number, callback: () => void, ...storages: IStaticStorage[]) => {
  window.addEventListener(dataBaseName, callback)
  new DataBaseExecutor(dataBaseName, dataBaseVersion, ...storages)
}
