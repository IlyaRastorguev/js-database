import { IStaticStorage } from "../types";
export declare const subscribeForDatabaseReady: (databaseName: string, action: () => void) => void;
export declare const initDataBase: (dataBaseName: string, dataBaseVersion: number, callback: () => void, ...storages: IStaticStorage[]) => void;
//# sourceMappingURL=index.d.ts.map