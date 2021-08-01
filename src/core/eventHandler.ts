import {EventHandlerParams, EventHandlerType} from "../types";
import EventEmitter from "events";

export class EventHandler<K, V> extends EventEmitter {
    private eventTarget: EventTarget;
    private writeEventName: string = "";
    private deleteEventName: string = "";

    constructor(target: EventTarget = window) {
        super()
        this.eventTarget = target
    }

    protected createEvents(eventType: string) {
       this.writeEventName = `${eventType}_write`
        this.deleteEventName = `${eventType}_delete`
    }

    public onWrite(params?: EventHandlerParams<K, V>) {
        this.emit(this.writeEventName, params)
    }

    public onDelete(params?: EventHandlerParams<K, V>) {
        this.emit(this.deleteEventName, params)
    }

    public subscribe(writeHandler?: EventHandlerType<K, V>, deleteHandler?: EventHandlerType<K, V>): () => void {
        if (writeHandler) {
            this.on(this.writeEventName, writeHandler)
            this.setMaxListeners(this.getMaxListeners() + 1)
        }

        if (deleteHandler) {
            this.on(this.deleteEventName, deleteHandler)
            this.setMaxListeners(this.getMaxListeners() + 1)
        }

        return () => this.unsubscribe(writeHandler, deleteHandler)
    }

     private unsubscribe(writeHandler?: EventHandlerType<K, V>, deleteHandler?: EventHandlerType<K, V>) {
        if (writeHandler) {
            this.off(this.writeEventName, writeHandler)
            this.setMaxListeners(this.getMaxListeners() - 1)
        }

        if (deleteHandler) {
            this.off(this.deleteEventName, deleteHandler)
            this.setMaxListeners(this.getMaxListeners() - 1)
        }
    }
}
