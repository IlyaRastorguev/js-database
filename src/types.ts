import {DataBaseExecutor} from "./core/executor";
import {IModel} from "./core/model";

export type { IModel } from "./core/model";

export declare type QueryBoundType = [
  any,
  any,
  boolean,
  boolean
]

export declare type QueryLowerBoundType = [
  any,
  boolean
]

export declare type QueryUpperBoundType = [
  any,
  boolean
]

export declare type QueryOnlyType = any

export declare type StorageEventType = {
  detail: {
    [key: string]: any;
  };
};

export declare type EventHandlerParams<K, V> = Map<K, V> | Set<K>

export declare type EventHandlerType<K, V> = (params?: EventHandlerParams<K, V>) => void

export declare type QueryDecorator = (v: any, i?: number) => any

export interface ISubscribe<K, V> {
    onWrite?: EventHandlerType<K, V>;
    onRemove?: EventHandlerType<K, V>
}

export interface IEventHandler<K, V> {
  subscribe: (params: ISubscribe<K, V>) => () => void;
  onWrite?: EventHandlerType<K, V>;
  onDelete?: EventHandlerType<K, V>;
}

export interface IBaseStorage<K, V> extends IEventHandler<K, V>{
  init: (executor: DataBaseExecutor) => void;
  getItem: (key: K) => Promise<V>;
  getAllItems: () => Promise<V[]>;
  getAllItemsWithKeys: () => Promise<Map<K, V>>;
  getItemsByQuery: (query: IDBKeyRange | IDBKeyRange[], index?: any) => Promise<V[]>;
  setItem: (item: V, key?: K) => void;
  setItems: (items: V[]) => void;
  removeItem: (key: K) => void;
  removeAllItems: () => void;
  removeItemsByQuery: (query: IDBKeyRange | IDBKeyRange[], index?: any) => void;
  partialUpdate: (key: K, chunk: Partial<V>) => Promise<void>;
  partialAllUpdate: (chunk: Partial<V>) => Promise<void>;
  partialUpdateByQuery: (chunk: Partial<V>, query: IDBKeyRange | IDBKeyRange[], index?: any) => Promise<K[]>;
  model: IModel;
  onDbUpgrade: (dbProvider: any, request: any) => void;
}
