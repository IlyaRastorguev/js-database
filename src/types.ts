import { BaseStorage } from "./core/storage";

export type { IModel } from "./core/model";

export declare type StorageType = typeof BaseStorage;

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
