import { DataBaseReadyEvent } from "../core/executor";
import { Observer } from "../core/observer";
import { StorageEventType, StorageType } from "../types";

export const subscribeForChanges = <T extends StorageEventType>(
  storage: StorageType,
  onWrite?: (result: T) => {},
  onRemove?: (result: T) => {}
) => {
  const observer = new Observer(storage.storage, onWrite, onRemove);

  observer.subscribe();
};

export const subscribeForDatabaseReady = (action: () => void) => {
  window.addEventListener(DataBaseReadyEvent, action);
};
