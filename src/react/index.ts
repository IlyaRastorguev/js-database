import {
  EventHandlerType,
  IBaseStorage,
  IEventHandler,
  StorageEventType,
} from "../types";
import { useRef, useEffect } from "react";
import { DataBaseExecutor } from "../core/executor";

export const useStorageEvent = <T extends StorageEventType>(
  eventHandler: IEventHandler<any, any>,
  onWrite?: EventHandlerType<any, any>,
  onRemove?: EventHandlerType<any, any>
) => {
  const subscribed = useRef(() => {});
  useEffect(() => {
    subscribed.current = eventHandler.subscribe({ onWrite, onRemove });
    return () => {
      subscribed.current();
    };
  }, [onWrite, onRemove]);
};

export const useStorageWriteEvent = <T extends StorageEventType>(
  storage: IBaseStorage<any, any>,
  onWrite?: EventHandlerType<any, any>
) => {
  const subscribed = useRef(() => {});
  useEffect(() => {
    subscribed.current = storage.subscribe({ onWrite });
    return () => {
      subscribed.current();
    };
  }, [onWrite]);
};

export const useStorageRemoveEvent = <T extends StorageEventType>(
  storage: IBaseStorage<any, any>,
  onRemove?: EventHandlerType<any, any>
) => {
  const subscribed = useRef(() => {});
  useEffect(() => {
    subscribed.current = storage.subscribe({ onRemove });
    return () => {
      subscribed.current();
    };
  }, [onRemove]);
};

export const useStorageInit = (
  databaseName: string,
  dataBaseVersion: number,
  action: () => void,
  ...storages: IBaseStorage<any, any>[]
) => {
  useEffect(() => {
    self.addEventListener(databaseName, action);
    new DataBaseExecutor(databaseName, dataBaseVersion, ...storages);
    return () => {
      self.removeEventListener(databaseName, action);
    };
  }, []);
};
