import { EventHandlerType, IBaseStorage, IEventHandler, StorageEventType } from "../types";
export declare const useStorageEvent: <T extends StorageEventType>(eventHandler: IEventHandler<any, any>, onWrite?: EventHandlerType<any, any> | undefined, onRemove?: EventHandlerType<any, any> | undefined) => void;
export declare const useStorageWriteEvent: <T extends StorageEventType>(storage: IBaseStorage<any, any>, onWrite?: EventHandlerType<any, any> | undefined) => void;
export declare const useStorageRemoveEvent: <T extends StorageEventType>(storage: IBaseStorage<any, any>, onRemove?: EventHandlerType<any, any> | undefined) => void;
export declare const useStorageInit: (databaseName: string, dataBaseVersion: number, action: () => void, ...storages: IBaseStorage<any, any>[]) => void;
//# sourceMappingURL=index.d.ts.map