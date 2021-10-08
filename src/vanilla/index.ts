import { DataBaseExecutor } from "../core/executor";
import { IBaseStorage } from "../types";

export const initDataBase = (
  dataBaseName: string,
  dataBaseVersion: number,
  callback: () => void,
  ...storages: IBaseStorage<any, any>[]
) => {
  self.addEventListener(dataBaseName, callback);
  new DataBaseExecutor(dataBaseName, dataBaseVersion, ...storages);
};
