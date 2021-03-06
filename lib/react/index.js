var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { useRef, useEffect } from "react";
import { DataBaseExecutor } from "../core/executor";
export var useStorageEvent = function (eventHandler, onWrite, onRemove) {
    var subscribed = useRef(function () { });
    useEffect(function () {
        subscribed.current = eventHandler.subscribe({ onWrite: onWrite, onRemove: onRemove });
        return function () {
            subscribed.current();
        };
    }, [onWrite, onRemove]);
};
export var useStorageWriteEvent = function (storage, onWrite) {
    var subscribed = useRef(function () { });
    useEffect(function () {
        subscribed.current = storage.subscribe({ onWrite: onWrite });
        return function () {
            subscribed.current();
        };
    }, [onWrite]);
};
export var useStorageRemoveEvent = function (storage, onRemove) {
    var subscribed = useRef(function () { });
    useEffect(function () {
        subscribed.current = storage.subscribe({ onRemove: onRemove });
        return function () {
            subscribed.current();
        };
    }, [onRemove]);
};
export var useStorageInit = function (databaseName, dataBaseVersion, action) {
    var storages = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        storages[_i - 3] = arguments[_i];
    }
    useEffect(function () {
        self.addEventListener(databaseName, action);
        new (DataBaseExecutor.bind.apply(DataBaseExecutor, __spreadArray([void 0, databaseName, dataBaseVersion], storages)))();
        return function () {
            self.removeEventListener(databaseName, action);
        };
    }, []);
};
//# sourceMappingURL=index.js.map