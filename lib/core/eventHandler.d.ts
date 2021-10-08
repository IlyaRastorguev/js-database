/// <reference types="node" />
import { EventHandlerParams, IEventHandler, ISubscribe } from "../types";
import EventEmitter from "events";
export declare class EventHandler<K, V> extends EventEmitter implements IEventHandler<K, V> {
    private writeEventName;
    private deleteEventName;
    constructor();
    protected createEvents(eventType: string): void;
    onWrite(params?: EventHandlerParams<K, V>): void;
    onDelete(params?: EventHandlerParams<K, V>): void;
    subscribe({ onWrite, onRemove }: ISubscribe<K, V>): () => void;
    private unsubscribe;
}
//# sourceMappingURL=eventHandler.d.ts.map