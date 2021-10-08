import { IBaseStorage } from "../types";

export class DataBaseExecutor {
  private readonly dbInstanceName: string;
  private storages: Set<IBaseStorage<any, any>>;
  private indexeddb = self.indexedDB;

  constructor(
    instanceName: string,
    version: number,
    ...storages: IBaseStorage<any, any>[]
  ) {
    this.dbInstanceName = instanceName;
    this.storages = new Set([...storages]);
    const request = this.indexeddb.open(this.dbInstanceName, version);

    this.storages.forEach((storage) => {
      storage.init(this);
    });

    request.onsuccess = () => {
      this.fireEvent(this.dbInstanceName, { status: true });
    };
    request.onerror = (ev) => {
      this.fireEvent(this.dbInstanceName, { status: false });
      console.error("Невозможно создать БД", ev);
    };

    request.onupgradeneeded = ({ target: { result } }: any) => {
      const unusedStorages = new Set([...result.objectStoreNames]);
      this.storages.forEach((storage) => {
        storage.onDbUpgrade(result, request);
        unusedStorages.delete(storage.model.name);
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
    onSuccess: (value: any) => void,
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
    onSuccess: (value: any) => void,
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
    onSuccess: (value: any) => void,
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

  getWithQuery(
    from: string,
    query: IDBKeyRange | IDBKeyRange[],
    index: any | any[],
    onSuccess: (value: any) => void,
    onError: (reason?: any) => void
  ) {
    const request = this.indexeddb.open(this.dbInstanceName);
    request.onerror = (ev) => {
      onError(ev.toString());
    };
    request.onsuccess = ({ target: { result } }: any) => {
      const list: any[] = [];
      const db = result;
      const transaction = db.transaction([from], "readwrite");
      let objectStore = transaction.objectStore(from);

      if (index) {
        if (Array.isArray(index)) {
          objectStore = objectStore.index(index.join(", "));
        } else objectStore = objectStore.index(index);
      }

      if (Array.isArray(query)) {
        query.forEach((q) => {
          objectStore.openCursor(q).onsuccess = ({
            target: { result: cursor },
          }: any) => {
            if (cursor) {
              list.push(cursor.value);
              cursor.continue();
            } else {
              onSuccess(list);
            }
          };
        });
      } else
        objectStore.openCursor(query).onsuccess = ({
          target: { result: cursor },
        }: any) => {
          if (cursor) {
            list.push(cursor.value);
            cursor.continue();
          } else {
            onSuccess(list);
          }
        };
    };
  }

  set(
    from: string,
    value: any,
    onSuccess: (value: unknown) => void = () => {},
    onError: (reason?: any) => void = () => {}
  ) {
    const request = this.indexeddb.open(this.dbInstanceName);
    request.onerror = (ev) => {
      onError(ev.toString());
    };
    request.onsuccess = ({ target: { result } }: any) => {
      const db = result;
      const transaction = db.transaction([from], "readwrite");
      const objectStore = transaction.objectStore(from);
      if (objectStore) {
        const request = objectStore.put(value);
        request.onerror = function (event: any) {
          onError(event.toString());
        };
        request.onsuccess = function ({ target: { result } }: any) {
          onSuccess(result);
        };
      }
    };
  }

  setByKey(
    from: string,
    value: any,
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
      if (objectStore) {
        const request = objectStore.put(value, key);
        request.onerror = function (event: any) {
          onError(event.toString());
        };
        request.onsuccess = function ({ target: { result } }: any) {
          onSuccess(result);
        };
      }
    };
  }

  setList(
    from: string,
    value: any[],
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
      Promise.all(
        value.map((item) => {
          return new Promise<void>((resolve, reject) => {
            const request = objectStore.put(item);
            request.onerror = function (event: any) {
              reject(event);
            };
            request.onsuccess = function () {
              resolve();
            };
          });
        })
      )
        .then(() => {
          onSuccess();
        })
        .catch((e) => {
          onError(e.toString());
        });
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
      if (objectStore) {
        const request = objectStore.delete(key);
        request.onerror = function (event: any) {
          onError(event.toString());
        };
        request.onsuccess = function () {
          onSuccess();
        };
      }
    };
  }

  removeWithQuery(
    from: string,
    query: IDBKeyRange | IDBKeyRange[],
    index: any | any[],
    onSuccess: (keys: Set<any>) => void,
    onError: (reason?: any) => void
  ) {
    const request = this.indexeddb.open(this.dbInstanceName);
    request.onerror = (ev) => {
      onError(ev.toString());
    };
    request.onsuccess = ({ target: { result } }: any) => {
      const keys: Set<any> = new Set();
      const db = result;
      const transaction = db.transaction([from], "readwrite");
      let objectStore = transaction.objectStore(from);

      if (index) {
        if (Array.isArray(index)) {
          objectStore = objectStore.index(index.join(", "));
        } else objectStore = objectStore.index(index);
      }

      if (Array.isArray(query)) {
        query.forEach((q) => {
          objectStore.openCursor(q).onsuccess = ({
            target: { result: cursor },
          }: any) => {
            if (cursor) {
              keys.add(cursor.primaryKey);
              cursor.delete();
              cursor.continue();
            } else {
              onSuccess(keys);
            }
          };
        });
      } else
        objectStore.openCursor(query).onsuccess = ({
          target: { result: cursor },
        }: any) => {
          if (cursor) {
            keys.add(cursor.primaryKey);
            cursor.delete();
            cursor.continue();
          } else {
            onSuccess(keys);
          }
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
      if (objectStore) {
        const request = objectStore.clear();
        request.onerror = function (event: any) {
          onError(event.toString());
        };
        request.onsuccess = function ({ target: { result } }: any) {
          onSuccess(result);
        };
      }
    };
  }

  protected fireEvent(eventName: string, detail: any) {
    self.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
}
