import { DataBaseReadyEvent } from "./../core/executor";
import { StorageEventType, StorageType } from "../types";
import { useRef, useEffect } from "react";
import { Observer } from "../core/observer";

export const useStorageEvent = <T extends StorageEventType>(
  storage: StorageType,
  onWrite?: (result: T) => {},
  onRemove?: (result: T) => {}
) => {
  const observer = useRef(new Observer(storage.storage, onWrite, onRemove));

  useEffect(() => {
    observer.current.subscribe();
    return () => {
      observer.current.unsubscribe();
    };
  }, []);
};

export const useStorageInit = (action: () => void) => {
  useEffect(() => {
    window.addEventListener(DataBaseReadyEvent, action);

    return () => {
      window.removeEventListener(DataBaseReadyEvent, action);
    };
  }, []);
};
