/// <reference types="node" />
import { EventHandlerParams, EventHandlerType } from "../types";
import EventEmitter from "events";
export declare class EventHandler<K, V> extends EventEmitter {
    private eventTarget;
    private writeEventName;
    private deleteEventName;
    constructor(target?: EventTarget);
    protected createEvents(eventType: string): void;
    onWrite(params?: EventHandlerParams<K, V>): void;
    onDelete(params?: EventHandlerParams<K, V>): void;
    subscribe(writeHandler?: EventHandlerType<K, V>, deleteHandler?: EventHandlerType<K, V>): () => void;
    private unsubscribe;
}
//# sourceMappingURL=eventHandler.d.ts.map