import { BaseStorage } from "./storage";

export class Observer {
  private writeEventName: string;
  private removeEventName: string;
  private _onWrite?: () => void;
  private _onRemove?: () => void;

  constructor(
    storage: BaseStorage,
    onWrite?: (...args: any[]) => void,
    onRemove?: (...args: any[]) => void
  ) {
    this.writeEventName = `${storage.constructor.name}_write`;
    this.removeEventName = `${storage.constructor.name}_remove`;
    this._onWrite = onWrite;
    this._onRemove = onRemove;
  }

  public subscribe() {
    this._onWrite &&
      window.addEventListener(this.writeEventName, this._onWrite);
    this._onRemove &&
      window.addEventListener(this.removeEventName, this._onRemove);
  }

  public unsubscribe() {
    this._onWrite &&
      window.removeEventListener(this.writeEventName, this._onWrite);
    this._onRemove &&
      window.removeEventListener(this.removeEventName, this._onRemove);
  }
}
