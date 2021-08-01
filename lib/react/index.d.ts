import { IStaticStorage, StorageEventType } from "../types";
export declare const useStorageEvent: <T extends StorageEventType>(storage: any, onWrite?: ((result: T) => void) | undefined, onRemove?: ((result: T) => void) | undefined) => void;
export declare const useStorageInit: (databaseName: string, dataBaseVersion: number, action: () => void, ...storages: IStaticStorage[]) => void;
//# sourceMappingURL=index.d.ts.map