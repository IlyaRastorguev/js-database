var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import EventEmitter from "events";
var EventHandler = /** @class */ (function (_super) {
    __extends(EventHandler, _super);
    function EventHandler(target) {
        if (target === void 0) { target = window; }
        var _this = _super.call(this) || this;
        _this.writeEventName = "";
        _this.deleteEventName = "";
        _this.eventTarget = target;
        return _this;
    }
    EventHandler.prototype.createEvents = function (eventType) {
        this.writeEventName = eventType + "_write";
        this.deleteEventName = eventType + "_delete";
    };
    EventHandler.prototype.onWrite = function (params) {
        this.emit(this.writeEventName, params);
    };
    EventHandler.prototype.onDelete = function (params) {
        this.emit(this.deleteEventName, params);
    };
    EventHandler.prototype.subscribe = function (writeHandler, deleteHandler) {
        var _this = this;
        if (writeHandler) {
            this.on(this.writeEventName, writeHandler);
            this.setMaxListeners(this.getMaxListeners() + 1);
        }
        if (deleteHandler) {
            this.on(this.deleteEventName, deleteHandler);
            this.setMaxListeners(this.getMaxListeners() + 1);
        }
        return function () { return _this.unsubscribe(writeHandler, deleteHandler); };
    };
    EventHandler.prototype.unsubscribe = function (writeHandler, deleteHandler) {
        if (writeHandler) {
            this.off(this.writeEventName, writeHandler);
            this.setMaxListeners(this.getMaxListeners() - 1);
        }
        if (deleteHandler) {
            this.off(this.deleteEventName, deleteHandler);
            this.setMaxListeners(this.getMaxListeners() - 1);
        }
    };
    return EventHandler;
}(EventEmitter));
export { EventHandler };
//# sourceMappingURL=eventHandler.js.map