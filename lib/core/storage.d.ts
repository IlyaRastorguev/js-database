import { IModel } from "./model";
import { DataBaseExecutor } from "./executor";
import { EventHandler } from "./eventHandler";
import { IBaseStorage } from "../types";
/**
 * Base class of storage. Provides base storage operations
 * @constructor is private. Instance creating in "init" method
 * and available in "storage" static field
 */
export declare class BaseStorage<T = {}, M = ""> extends EventHandler<M, T> implements IBaseStorage<M, T> {
    private _model;
    private dataBaseExecutor;
    static storage: IBaseStorage<any, any>;
    constructor();
    /**
     * Set executor for database
     */
    static init(executor: DataBaseExecutor): void;
    get model(): IModel;
    set model(model: IModel);
    getObjectStore(): Promise<unknown>;
    /**
     * Used when version of DB is incremented
     */
    onDbUpgrade(dbProvider: any, request: any): void;
    /**
     * Method used for changing structure of storage
     * for example creating index
     */
    applyMigrations(objectStore: IDBObjectStore): void;
    /**
     * Method returns promise with db request by key
     * @returns any
     */
    getItem(key: M): Promise<T>;
    /**
     * Method returns promise with db request for all items in storage
     * @returns any[]
     */
    getAllItems(): Promise<T[]>;
    /**
     * Method returns promise with db request for all items in storage
     * @returns Map<any, any>
     */
    getAllItemsWithKeys(): Promise<Map<M, T>>;
    getItemsByQuery(query: IDBKeyRange | IDBKeyRange[], index?: any): Promise<T[]>;
    /**
     * Method used for setting new item to the storage
     */
    setItem(item: T, key?: M): void;
    /**
     * Method used for setting list of item to the storage
     */
    setItems(items: T[]): void;
    /**
     * Method used for partial update of storage item
     * @param key - key of item
     * @param chunk - object with keys, that will be updated
     */
    partialUpdate(key: M, chunk: {}): void;
    /**
     * Method used for partial update items that matches with query
     * @param chunk - object with keys, that will be updated
     * @param query - key range of items
     * @param index - index for query
     */
    partialUpdateByQuery(chunk: {}, query: IDBKeyRange | IDBKeyRange[], index?: any): Promise<void>;
    /**
     * Method used for partial update items that matches with query
     * @param chunk - object with keys, that will be updated
     */
    partialAllUpdate(chunk: {}): Promise<void>;
    /**
     * Method used for removing item from storage by key
     */
    removeItemsByQuery(query: IDBKeyRange | IDBKeyRange[], index?: any): void;
    /**
     * Method used for removing item from storage by key
     */
    removeItem(key: M): void;
    /**
     * Method used for removing all items in storage
     * @returns Map<any, any>
     */
    removeAllItems(): void;
}
//# sourceMappingURL=storage.d.ts.map