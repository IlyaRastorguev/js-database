import { IModel } from "./model";
import { DataBaseExecutor } from "./executor";
import { EventHandler } from "./eventHandler";

/**
 * Base class of storage. Provides base storage operations
 * @constructor is private. Instance creating in "init" method
 * and avaliable in "storage" static field
 */
export class BaseStorage<T = {}, M = ""> extends EventHandler {
  private _model: IModel = {} as IModel;

  private dataBaseExecutor;
  private writeEventName: string = `${this.constructor.name}_write`;
  private removeEventName: string = `${this.constructor.name}_remove`;

  static storage: BaseStorage;

  constructor(executor: DataBaseExecutor) {
    super();
    this.dataBaseExecutor = executor;
  }

  /**
   * Creates instatce of storage and set it to storage field
   */
  public static init(storage: BaseStorage) {
    this.storage = storage;
  }

  public get model() {
    return this._model;
  }

  public set model(model: IModel) {
    this._model = model;
  }

  getObjectStore() {
    return new Promise((resolve, reject) => {
      this.dataBaseExecutor.getObjectStorage(this.model.name, resolve, reject);
    });
  }

  /**
   * Used when version of DB is incremented
   */
  public onDbUpgrade(dbProvider: any, request: any) {
    const isDataBaseExists: boolean =
      Object.values(dbProvider.objectStoreNames).indexOf(this.model.name) !==
      -1;
    if (!isDataBaseExists) {
      const objectStorage = dbProvider.createObjectStore(
        this.model.name,
        this.model.params
      );
      this.applyMigrations(objectStorage);
    } else {
      this.applyMigrations(request.transaction.objectStore(this.model.name));
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
      this.dataBaseExecutor.get(this.model.name, key, resolve, reject);
    });
  }

  /**
   * Method returns promise with db request for all items in storage
   * @returns any[]
   */
  public getAllItems() {
    return new Promise((resolve, reject) => {
      this.dataBaseExecutor.getAll(this.model.name, resolve, reject);
    });
  }

  /**
   * Method returns promise with db request for all items in storage
   * @returns Map<any, any>
   */
  public getAllItemsWithKeys() {
    return new Promise((resolve, reject) => {
      this.dataBaseExecutor.getAllWithKeys(this.model.name, resolve, reject);
    });
  }

  /**
   * Method used for setting new item to the storage
   */
  public setItem(item: T) {
    this.dataBaseExecutor.set(
      this.model.name,
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
      this.model.name,
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
      this.model.name,
      () => {
        this.fireEvent(this.removeEventName, { key: "*" });
      },
      () => {}
    );
  }
}
