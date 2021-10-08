import { IBaseStorage, QueryDecorator } from "../types";
export interface IForeignKey {
    storage: IBaseStorage<any, any>;
    index: string | string[];
    queryDecorator?: QueryDecorator;
}
export interface IModel {
    name: string;
    params: IDBObjectStoreParameters;
    foreignKeys?: IForeignKey[];
}
export declare class Model {
    private readonly _model;
    constructor(model: IModel);
    get model(): IModel;
}
//# sourceMappingURL=model.d.ts.map