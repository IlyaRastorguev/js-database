import {IModel} from "./model";
import {DataBaseExecutor} from "./executor";
import {EventHandler} from "./eventHandler";
import {IBaseStorage} from "../types";

/**
 * Base class of storage. Provides base storage operations
 * @constructor is private. Instance creating in "init" method
 * and available in "storage" static field
 */
export class BaseStorage<T = {}, M = ""> extends EventHandler<M, T> implements IBaseStorage<M, T> {
    private _model: IModel = {} as IModel;

    private dataBaseExecutor;

    public static storage: IBaseStorage<any, any>;

    constructor() {
        super();
        this.createEvents(this.model.name)
        this.dataBaseExecutor = {} as DataBaseExecutor
    }

    /**
     * Set executor for database
     */
    public static init(executor: DataBaseExecutor) {
        // @ts-ignore
        this.storage[`dataBaseExecutor`] = executor;
    }

    public get model() {
        return this._model;
    }

    public set model(model: IModel) {
        this._model = model;
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
    public applyMigrations(objectStore: IDBObjectStore) {
    }

    /**
     * Method returns promise with db request by key
     * @returns any
     */
    public getItem(key: M) {
        return new Promise<T>((resolve, reject) => {
            this.dataBaseExecutor.get(this.model.name, key, resolve, reject);
        });
    }

    /**
     * Method returns promise with db request for all items in storage
     * @returns any[]
     */
    public getAllItems() {
        return new Promise<T[]>((resolve, reject) => {
            this.dataBaseExecutor.getAll(this.model.name, resolve, reject);
        });
    }

    /**
     * Method returns promise with db request for all items in storage
     * @returns Map<any, any>
     */
    public getAllItemsWithKeys() {
        return new Promise<Map<M, T>>((resolve, reject) => {
            this.dataBaseExecutor.getAllWithKeys(this.model.name, resolve, reject);
        });
    }

    public getItemsByQuery(query: IDBKeyRange | IDBKeyRange[], index?: any) {
        return new Promise<T[]>((resolve, reject) => {
            this.dataBaseExecutor.getWithQuery(this.model.name, query, index, resolve, reject)
        })
    }

    /**
     * Method used for setting new item to the storage
     */
    public setItem(item: T, key?: M) {
        if (key) {
            this.dataBaseExecutor.setByKey(
                this.model.name,
                item,
                key,
                (key: any) => {
                    this.onWrite({key, value: item});
                },
                () => {
                }
            );
        } else
            this.dataBaseExecutor.set(
                this.model.name,
                item,
                (key: any) => {
                    this.onWrite({key, value: item})
                },
                () => {
                }
            );
    }

    /**
     * Method used for setting list of item to the storage
     */
    public setItems(items: T[]) {
        this.dataBaseExecutor.setList(
            this.model.name,
            items,
            (keys) => {
                // @ts-ignore
                this.onWrite({key: keys, value: items})
            },
            () => {
            }
        );
    }

    /**
     * Method used for partial update of storage item
     * @param key - key of item
     * @param chunk - object with keys, that will be updated
     */
    public partialUpdate(key: M, chunk: {}) {
        this.getItem(key).then((item) => {
            if (item) this.setItem({...item, ...chunk})
        })
    }

    /**
     * Method used for partial update items that matches with query
     * @param chunk - object with keys, that will be updated
     * @param query - key range of items
     * @param index - index for query
     */
    public partialUpdateByQuery(chunk: {}, query: IDBKeyRange | IDBKeyRange[], index?: any,) {
        return new Promise<M[]>((resolve) => {
            this.getItemsByQuery(query, index).then((items: any) => {
                Promise.all<M>(items.map((item: any) => this.dataBaseExecutor.set(this.model.name, {...item, ...chunk}))).then((list) => {
                    resolve ? resolve(list): this.onWrite({key: list})
                })
            })
        })
    }

    /**
     * Method used for partial update all items in storage
     * @param chunk - object with keys, that will be updated
     */
    public partialAllUpdate(chunk: {}) {
        return new Promise<void>((resolve) => {
            this.getAllItems().then((items: any) => {
                Promise.all(items.map((item: any) => this.dataBaseExecutor.set(this.model.name, {...item, ...chunk}))).then(() => {
                    resolve ? resolve(): this.onWrite()
                })
            })
        })
    }

    /**
     * Method used for removing item from storage by key
     */
    public removeItemsByQuery(query: IDBKeyRange | IDBKeyRange[], index?: any) {
        this.dataBaseExecutor.removeWithQuery(
            this.model.name,
            query,
            index,
            (keys) => {
                this.onDelete({key: Array.from(keys)})
            },
            () => {
            }
        );
    }

    /**
     * Method used for removing item from storage by key
     */
    public removeItem(key: M) {
        this.dataBaseExecutor.remove(
            this.model.name,
            key,
            () => {
                this.onDelete({key})
            },
            () => {
            }
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
                this.onDelete()
            },
            () => {
            }
        );
    }
}
