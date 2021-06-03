import { IModel } from "./model";
import { DataBaseExecutor } from "./executor";
import { EventHandler } from "./eventHandler";

/**
 * Base class of storage. Provides base storage operations
 * @constructor is private. Instance creating in "init" method
 * and avaliable in "storage" static field
 */
export class BaseStorage<T = {}, M = ""> extends EventHandler {
  private _storageName: string = "";
  private _model: IModel = {} as IModel;

  private dataBaseExecutor;
  private writeEventName: string = `${this.constructor.name}_write`;
  private removeEventName: string = `${this.constructor.name}_remove`;

  static storage: BaseStorage;

  private constructor(executor: DataBaseExecutor) {
    super();
    this.dataBaseExecutor = executor;
  }

  /**
   * Creates instatce of storage and set it to storage field
   */
  public static init(executor: DataBaseExecutor) {
    this.storage = this.constructor.call(executor);
  }

  public get storageName(): string {
    return this._storageName;
  }

  public get model() {
    return this._model;
  }

  getObjectStore() {
    return new Promise((resolve, reject) => {
      this.dataBaseExecutor.getObjectStorage(
        this._storageName,
        resolve,
        reject
      );
    });
  }

  /**
   * Used when version of DB is incremented
   */
  public onDbUpgrade(dbProvider: any, request: any) {
    const isDataBaseExists: boolean =
      Object.values(dbProvider.objectStoreNames).indexOf(this.storageName) !==
      -1;
    if (!isDataBaseExists) {
      const objectStorage = dbProvider.createObjectStore(
        this.model.name,
        this.model.params
      );
      this.applyMigrations(objectStorage);
    } else {
      this.applyMigrations(request.transaction.objectStore(this.storageName));
    }
  }

  /**
   * Method used for changing structure of storage
   * for example creating index
   */
  public applyMigrations(objectStore: IDBObjectStore) {}

  /**
   * Method returns promise with db request by key
   * @returns any
   */
  public getItem(key: M) {
    return new Promise((resolve, reject) => {
      this.dataBaseExecutor.get(this._storageName, key, resolve, reject);
    });
  }

  /**
   * Method returns promise with db request for all items in storage
   * @returns any[]
   */
  public getAllItems() {
    return new Promise((resolve, reject) => {
      this.dataBaseExecutor.getAll(this._storageName, resolve, reject);
    });
  }

  /**
   * Method returns promise with db request for all items in storage
   * @returns Map<any, any>
   */
  public getAllItemsWithKeys() {
    return new Promise((resolve, reject) => {
      this.dataBaseExecutor.getAllWithKeys(this._storageName, resolve, reject);
    });
  }

  /**
   * Method used for setting new item to the storage
   */
  public setItem(item: T) {
    this.dataBaseExecutor.set(
      this._storageName,
      item,
      (result: unknown) => {
        this.fireEvent(this.writeEventName, { result });
      },
      () => {}
    );
  }

  public setItems(items: T[]) {}
  /**
   * Method used for removing item from storage by key
   */
  public removeItem(key: M) {
    this.dataBaseExecutor.remove(
      this._storageName,
      key,
      () => {
        this.fireEvent(this.removeEventName, { key });
      },
      () => {}
    );
  }

  /**
   * Method used for removing all items in storage
   * @returns Map<any, any>
   */
  public removeAllItems() {
    this.dataBaseExecutor.clear(
      this._storageName,
      () => {
        this.fireEvent(this.removeEventName, { key: "*" });
      },
      () => {}
    );
  }
}
