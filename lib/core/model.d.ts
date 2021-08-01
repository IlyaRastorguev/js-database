export interface IModel {
    name: string;
    params: IDBObjectStoreParameters;
}
export declare class Model {
    private _model;
    constructor(model: IModel);
    get model(): IModel;
}
//# sourceMappingURL=model.d.ts.map