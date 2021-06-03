import { EventHandler } from "./eventHandler";
import { BaseStorage } from "./storage";

declare type StorageType = typeof BaseStorage;

export class DataBaseExecutor extends EventHandler {
  private dbInstanceName: string;
  private storages: Set<StorageType>;
  private indexeddb = window.indexedDB;

  constructor(
    instanseName: string,
    version: number,
    ...storages: StorageType[]
  ) {
    super();
    this.dbInstanceName = instanseName;
    this.storages = new Set([...storages]);
    const request = this.indexeddb.open(this.dbInstanceName, version);
    request.onsuccess = () => {
      this.storages.forEach((storage) => {
        storage.init(this);
      });
      this.fireEvent("onDataBaseReady", { status: true });
    };
    request.onerror = (ev) => {
      console.error(
        "the initialization of the indexed db ended with error: ",
        ev
      );
    };

    request.onupgradeneeded = ({ target: { result } }: any) => {
      const unusedStorages = new Set([...result.objectStoreNames]);
      this.storages.forEach((storage) => {
        storage.storage.onDbUpgrade(result, request);
        unusedStorages.delete(storage.storage.storageName);
      });

      unusedStorages.forEach((storageName) => {
        result.deleteObjectStore(storageName);
      });
    };
  }

  public getObjectStorage(
    storageName: string,
    onSuccess: (value: unknown) => void,
    onError: (reason?: any) => void
  ) {
    const request = this.indexeddb.open(this.dbInstanceName);
    request.onerror = (ev) => {
      onError(ev.toString());
    };
    request.onsuccess = ({ target: { result } }: any) => {
      const db = result;
      const transaction = db.transaction([storageName], "readwrite");
      const objectStore = transaction.objectStore(storageName);
      onSuccess(objectStore);
    };
  }

  get(
    from: string,
    key: any,
    onSuccess: (value: unknown) => void,
    onError: (reason?: any) => void
  ) {
    const request = this.indexeddb.open(this.dbInstanceName);
    request.onerror = (ev) => {
      onError(ev.toString());
    };
    request.onsuccess = ({ target: { result } }: any) => {
      const db = result;
      const transaction = db.transaction([from], "readwrite");
      const objectStore = transaction.objectStore(from);
      if (key) {
        const request = objectStore.get(key);
        request.onerror = function (event: any) {
          onError(event.toString());
        };
        request.onsuccess = function ({ target: { result } }: any) {
          onSuccess(result);
        };
      }
    };
  }

  getAll(
    from: string,
    onSuccess: (value: unknown) => void,
    onError: (reason?: any) => void
  ) {
    const request = this.indexeddb.open(this.dbInstanceName);
    request.onerror = (ev) => {
      onError(ev.toString());
    };
    request.onsuccess = ({ target: { result } }: any) => {
      const db = result;
      const transaction = db.transaction([from], "readwrite");
      const objectStore = transaction.objectStore(from);
      const request = objectStore.getAll();
      request.onerror = function (event: any) {
        onError(event.toString());
      };
      request.onsuccess = function ({ target: { result } }: any) {
        onSuccess(result);
      };
    };
  }

  getAllWithKeys(
    from: string,
    onSuccess: (value: unknown) => void,
    onError: (reason?: any) => void
  ) {
    const request = this.indexeddb.open(this.dbInstanceName);
    request.onerror = (ev) => {
      onError(ev.toString());
    };
    request.onsuccess = ({ target: { result } }: any) => {
      const items = new Map();
      const db = result;
      const transaction = db.transaction([from], "readwrite");
      const objectStore = transaction.objectStore(from);
      const request = objectStore.openCursor();
      request.onerror = function (event: any) {
        onError(event.toString());
      };
      request.onsuccess = function ({ target: { result } }: any) {
        if (result) {
          const key = result.primaryKey;
          const value = result.value;
          items.set(key, value);
          result.continue();
        } else {
          onSuccess(items);
        }
      };
    };
  }

  set(
    from: string,
    value: any,
    onSuccess: (value: unknown) => void,
    onError: (reason?: any) => void
  ) {
    const request = this.indexeddb.open(this.dbInstanceName);
    request.onerror = (ev) => {
      onError(ev.toString());
    };
    request.onsuccess = ({ target: { result } }: any) => {
      const db = result;
      const transaction = db.transaction([from], "readwrite");
      const objectStore = transaction.objectStore(from);
      const request = objectStore.put(value);
      request.onerror = function (event: any) {
        onError(event.toString());
      };
      request.onsuccess = function ({ target: { result } }: any) {
        onSuccess(result);
      };
    };
  }

  remove(
    from: string,
    key: any,
    onSuccess: () => void,
    onError: (reason?: any) => void
  ) {
    const request = this.indexeddb.open(this.dbInstanceName);
    request.onerror = (ev) => {
      onError(ev.toString());
    };
    request.onsuccess = ({ target: { result } }: any) => {
      const db = result;
      const transaction = db.transaction([from], "readwrite");
      const objectStore = transaction.objectStore(from);
      const request = objectStore.delete(key);
      request.onerror = function (event: any) {
        onError(event.toString());
      };
      request.onsuccess = function () {
        onSuccess();
      };
    };
  }

  clear(
    from: string,
    onSuccess: (value: unknown) => void,
    onError: (reason?: any) => void
  ) {
    const request = this.indexeddb.open(this.dbInstanceName);
    request.onerror = (ev) => {
      onError(ev.toString());
    };
    request.onsuccess = ({ target: { result } }: any) => {
      const db = result;
      const transaction = db.transaction([from], "readwrite");
      const objectStore = transaction.objectStore(from);
      const request = objectStore.clear();
      request.onerror = function (event: any) {
        onError(event.toString());
      };
      request.onsuccess = function ({ target: { result } }: any) {
        onSuccess(result);
      };
    };
  }
}
