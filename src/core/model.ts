export interface IModel {
  name: string;
  params: IDBObjectStoreParameters;
}

export class Model {
  private _model: IModel;

  constructor(model: IModel) {
    this._model = model;
  }

  public get model() {
    return this._model;
  }
}
