import { IStaticStorage } from "../types";
export declare class DataBaseExecutor {
    private readonly dbInstanceName;
    private storages;
    private indexeddb;
    constructor(instanseName: string, version: number, ...storages: IStaticStorage[]);
    getObjectStorage(storageName: string, onSuccess: (value: unknown) => void, onError: (reason?: any) => void): void;
    get(from: string, key: any, onSuccess: (value: any) => void, onError: (reason?: any) => void): void;
    getAll(from: string, onSuccess: (value: any) => void, onError: (reason?: any) => void): void;
    getAllWithKeys(from: string, onSuccess: (value: any) => void, onError: (reason?: any) => void): void;
    getWithQuery(from: string, query: IDBKeyRange | IDBKeyRange[], index: any | any[], onSuccess: (value: any) => void, onError: (reason?: any) => void): void;
    set(from: string, value: any, onSuccess?: (value: unknown) => void, onError?: (reason?: any) => void): void;
    setByKey(from: string, value: any, key: any, onSuccess: (value: unknown) => void, onError: (reason?: any) => void): void;
    setList(from: string, value: any[], onSuccess: (value: any[]) => void, onError: (reason?: any) => void): void;
    remove(from: string, key: any, onSuccess: () => void, onError: (reason?: any) => void): void;
    removeWithQuery(from: string, query: IDBKeyRange | IDBKeyRange[], index: any | any[], onSuccess: (keys: Set<any>) => void, onError: (reason?: any) => void): void;
    clear(from: string, onSuccess: (value: unknown) => void, onError: (reason?: any) => void): void;
    protected fireEvent(eventName: string, detail: any): void;
}
//# sourceMappingURL=executor.d.ts.map