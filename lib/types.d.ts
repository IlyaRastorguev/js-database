import { DataBaseExecutor } from "./core/executor";
import { IModel } from "./core/model";
export type { IModel } from "./core/model";
export declare type QueryBoundType = [
    any,
    any,
    boolean,
    boolean
];
export declare type QueryLowerBoundType = [
    any,
    boolean
];
export declare type QueryUpperBoundType = [
    any,
    boolean
];
export declare type QueryOnlyType = any;
export declare type StorageEventType = {
    detail: {
        [key: string]: any;
    };
};
export declare type EventHandlerParams<K, V> = {
    key?: K | K[];
    value?: V | V[];
};
export declare type EventHandlerType<K, V> = (params?: EventHandlerParams<K, V>) => void;
export interface IBaseStorage<K, V> {
    getItem: (key: K) => Promise<V>;
    getAllItems: () => Promise<V[]>;
    getAllItemsWithKeys: () => Promise<Map<K, V>>;
    getItemsByQuery: (query: IDBKeyRange | IDBKeyRange[], index?: any) => Promise<V[]>;
    setItem: (item: V, key?: K) => void;
    setItems: (items: V[]) => void;
    removeItem: (key: K) => void;
    removeAllItems: () => void;
    removeItemsByQuery: (query: IDBKeyRange | IDBKeyRange[], index?: any) => void;
    model: IModel;
    onDbUpgrade: (dbProvider: any, request: any) => void;
}
export interface IStaticStorage {
    storage: IBaseStorage<any, any>;
    init: (executor: DataBaseExecutor) => void;
}
//# sourceMappingURL=types.d.ts.map