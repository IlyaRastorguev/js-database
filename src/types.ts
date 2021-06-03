import { BaseStorage } from "./core/storage";

export type { IModel } from "./core/model";

export declare type StorageType = typeof BaseStorage;

export declare type StorageEventType = {
  detail: {
    [key: string]: any;
  };
};
