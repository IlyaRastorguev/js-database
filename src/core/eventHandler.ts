import {
  EventHandlerParams,
  EventHandlerType,
  IEventHandler,
  ISubscribe,
} from "../types";
import EventEmitter from "events";

export class EventHandler<K, V> extends EventEmitter
  implements IEventHandler<K, V> {
  private writeEventName: string = "";
  private deleteEventName: string = "";

  constructor() {
    super();
  }

  protected createEvents(eventType: string) {
    this.writeEventName = `${eventType}_write`;
    this.deleteEventName = `${eventType}_delete`;
  }

  public onWrite(params?: EventHandlerParams<K, V>) {
    this.emit(this.writeEventName, params);
  }

  public onDelete(params?: EventHandlerParams<K, V>) {
    this.emit(this.deleteEventName, params);
  }

  public subscribe({ onWrite, onRemove }: ISubscribe<K, V>): () => void {
    if (onWrite) {
      this.on(this.writeEventName, onWrite);
      this.setMaxListeners(this.getMaxListeners() + 1);
    }

    if (onRemove) {
      this.on(this.deleteEventName, onRemove);
      this.setMaxListeners(this.getMaxListeners() + 1);
    }

    return () => this.unsubscribe(onWrite, onRemove);
  }

  private unsubscribe(
    writeHandler?: EventHandlerType<K, V>,
    deleteHandler?: EventHandlerType<K, V>
  ) {
    if (writeHandler) {
      this.off(this.writeEventName, writeHandler);
      this.setMaxListeners(this.getMaxListeners() - 1);
    }

    if (deleteHandler) {
      this.off(this.deleteEventName, deleteHandler);
      this.setMaxListeners(this.getMaxListeners() - 1);
    }
  }
}
