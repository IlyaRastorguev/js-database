import {IBaseStorage, QueryDecorator} from "../types";

export interface IForeignKey {
  storage: IBaseStorage<any, any>;
  index: string | string[];
  queryDecorator?: QueryDecorator
}

export interface IModel {
  name: string;
  params: IDBObjectStoreParameters;
  foreignKeys?: IForeignKey[]
}

export class Model {
  private readonly _model: IModel;

  constructor(model: IModel) {
    this._model = model;
  }

  public get model() {
    return this._model;
  }
}
