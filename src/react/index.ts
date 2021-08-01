import {IStaticStorage, StorageEventType} from "../types";
import { useRef, useEffect } from "react";
import {DataBaseExecutor} from "../core/executor";

export const useStorageEvent = <T extends StorageEventType>(
  storage: any,
  onWrite?: (result: T) => void,
  onRemove?: (result: T) => void,
) => {
  const subscribed = useRef(() => {})
  useEffect(() => {
    subscribed.current = storage.storage.subscribe(onWrite, onRemove)
    return () => {
      subscribed.current()
    };
  }, [onWrite, onRemove]);
};

export const useStorageInit = (databaseName: string, dataBaseVersion: number, action: () => void, ...storages: IStaticStorage[]) => {
  useEffect(() => {
    window.addEventListener(databaseName, action);
    new DataBaseExecutor(databaseName, dataBaseVersion, ...storages)
    return () => {
      window.removeEventListener(databaseName, action);
    };
  }, []);
};
