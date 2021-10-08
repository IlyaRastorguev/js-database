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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { EventHandler } from "./eventHandler";
import { Query } from "./query";
/**
 * Base class of storage. Provides base storage operations
 * @constructor is private. Instance creating in "init" method
 * and available in "storage" static field
 */
var BaseStorage = /** @class */ (function (_super) {
    __extends(BaseStorage, _super);
    function BaseStorage() {
        var _this = _super.call(this) || this;
        _this._model = {};
        _this.createEvents(_this.model.name);
        _this.dataBaseExecutor = {};
        return _this;
    }
    /**
     * Set executor for database
     */
    BaseStorage.prototype.init = function (executor) {
        this.dataBaseExecutor = executor;
        this.initForeignKeys();
    };
    Object.defineProperty(BaseStorage.prototype, "model", {
        get: function () {
            return this._model;
        },
        set: function (model) {
            this._model = model;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Used when version of DB is incremented
     */
    BaseStorage.prototype.onDbUpgrade = function (dbProvider, request) {
        var isDataBaseExists = Object.values(dbProvider.objectStoreNames).indexOf(this.model.name) !==
            -1;
        if (!isDataBaseExists) {
            var objectStorage = dbProvider.createObjectStore(this.model.name, this.model.params);
            this.applyMigrations(objectStorage);
        }
        else {
            this.applyMigrations(request.transaction.objectStore(this.model.name));
        }
    };
    /**
     * Method used for changing structure of storage
     * for example creating index
     */
    BaseStorage.prototype.applyMigrations = function (objectStore) {
    };
    /**
     * Method returns promise with db request by key
     * @returns any
     */
    BaseStorage.prototype.getItem = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.dataBaseExecutor.get(_this.model.name, key, resolve, reject);
        });
    };
    /**
     * Method returns promise with db request for all items in storage
     * @returns any[]
     */
    BaseStorage.prototype.getAllItems = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.dataBaseExecutor.getAll(_this.model.name, resolve, reject);
        });
    };
    /**
     * Method returns promise with db request for all items in storage
     * @returns Map<any, any>
     */
    BaseStorage.prototype.getAllItemsWithKeys = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.dataBaseExecutor.getAllWithKeys(_this.model.name, resolve, reject);
        });
    };
    BaseStorage.prototype.getItemsByQuery = function (query, index) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.dataBaseExecutor.getWithQuery(_this.model.name, query, index, resolve, reject);
        });
    };
    /**
     * Method used for setting new item to the storage
     */
    BaseStorage.prototype.setItem = function (item, key) {
        var _this = this;
        if (key) {
            this.dataBaseExecutor.setByKey(this.model.name, item, key, function (key) {
                _this.onWrite(new Map([[key, item]]));
            }, function () {
            });
        }
        else
            this.dataBaseExecutor.set(this.model.name, item, function (key) {
                _this.onWrite(new Map([[key, item]]));
            }, function () {
            });
    };
    /**
     * Method used for setting list of item to the storage
     */
    BaseStorage.prototype.setItems = function (items) {
        var _this = this;
        this.dataBaseExecutor.setList(this.model.name, items, function () {
            _this.onWrite();
        }, function () {
        });
    };
    /**
     * Method used for partial update of storage item
     * @param key - key of item
     * @param chunk - object with keys, that will be updated
     */
    BaseStorage.prototype.partialUpdate = function (key, chunk) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.getItem(key).then(function (item) {
                if (item)
                    _this.setItem(__assign(__assign({}, item), chunk));
                resolve();
            });
        });
    };
    /**
     * Method used for partial update items that matches with query
     * @param chunk - object with keys, that will be updated
     * @param query - key range of items
     * @param index - index for query
     */
    BaseStorage.prototype.partialUpdateByQuery = function (chunk, query, index) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.getItemsByQuery(query, index).then(function (items) {
                Promise.all(items.map(function (item) { return _this.dataBaseExecutor.set(_this.model.name, __assign(__assign({}, item), chunk)); })).then(function (list) {
                    resolve ? resolve(list) : _this.onWrite();
                });
            });
        });
    };
    /**
     * Method used for partial update all items in storage
     * @param chunk - object with keys, that will be updated
     */
    BaseStorage.prototype.partialAllUpdate = function (chunk) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.getAllItems().then(function (items) {
                Promise.all(items.map(function (item) { return _this.dataBaseExecutor.set(_this.model.name, __assign(__assign({}, item), chunk)); })).then(function () {
                    resolve ? resolve() : _this.onWrite();
                });
            });
        });
    };
    /**
     * Method used for removing item from storage by key
     */
    BaseStorage.prototype.removeItemsByQuery = function (query, index) {
        var _this = this;
        this.dataBaseExecutor.removeWithQuery(this.model.name, query, index, function (keys) {
            _this.onDelete(keys);
        }, function () {
        });
    };
    /**
     * Method used for removing item from storage by key
     */
    BaseStorage.prototype.removeItem = function (key) {
        var _this = this;
        this.dataBaseExecutor.remove(this.model.name, key, function () {
            _this.onDelete(new Set([key]));
        }, function () {
        });
    };
    /**
     * Method used for removing all items in storage
     * @returns Map<any, any>
     */
    BaseStorage.prototype.removeAllItems = function () {
        var _this = this;
        this.dataBaseExecutor.clear(this.model.name, function () {
            _this.onDelete();
        }, function () {
        });
    };
    BaseStorage.prototype.createForeignKeyRemoveHandler = function (foreignKey) {
        var _this = this;
        var storage = foreignKey.storage, index = foreignKey.index, queryDecorator = foreignKey.queryDecorator;
        if (storage)
            storage.subscribe({
                onRemove: function (ev) {
                    if (ev) {
                        var keys = ev.keys();
                        if (keys) {
                            var queryData = queryDecorator ? Array.from(keys, queryDecorator) : Array.from(keys);
                            _this.removeItemsByQuery(Query.many.apply(Query, queryData), index);
                        }
                    }
                }
            });
    };
    BaseStorage.prototype.initForeignKeys = function () {
        var _this = this;
        if (this.model.foreignKeys)
            this.model.foreignKeys.forEach(function (foreignKey) {
                _this.createForeignKeyRemoveHandler(foreignKey);
            });
    };
    return BaseStorage;
}(EventHandler));
export { BaseStorage };
//# sourceMappingURL=storage.js.map