import { StorageEventType, StorageType } from "../types";
import { useRef, useEffect } from "react";
import { Observer } from "../core/observer";

export const useStorageEvent = <T extends StorageEventType>(
  storage: StorageType,
  onWrite?: (key: T) => {},
  onRemove?: (key: T) => {}
) => {
  const observer = useRef(new Observer(storage.storage, onWrite, onRemove));

  useEffect(() => {
    observer.current.subscribe();
    return () => {
      observer.current.unsubscribe();
    };
  }, []);
};
