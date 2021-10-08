var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var DataBaseExecutor = /** @class */ (function () {
    function DataBaseExecutor(instanceName, version) {
        var _this = this;
        var storages = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            storages[_i - 2] = arguments[_i];
        }
        this.indexeddb = self.indexedDB;
        this.dbInstanceName = instanceName;
        this.storages = new Set(__spreadArray([], storages));
        var request = this.indexeddb.open(this.dbInstanceName, version);
        this.storages.forEach(function (storage) {
            storage.init(_this);
        });
        request.onsuccess = function () {
            _this.fireEvent(_this.dbInstanceName, { status: true });
        };
        request.onerror = function (ev) {
            _this.fireEvent(_this.dbInstanceName, { status: false });
            console.error("Невозможно создать БД", ev);
        };
        request.onupgradeneeded = function (_a) {
            var result = _a.target.result;
            var unusedStorages = new Set(__spreadArray([], result.objectStoreNames));
            _this.storages.forEach(function (storage) {
                storage.onDbUpgrade(result, request);
                unusedStorages.delete(storage.model.name);
            });
            unusedStorages.forEach(function (storageName) {
                result.deleteObjectStore(storageName);
            });
        };
    }
    DataBaseExecutor.prototype.getObjectStorage = function (storageName, onSuccess, onError) {
        var request = this.indexeddb.open(this.dbInstanceName);
        request.onerror = function (ev) {
            onError(ev.toString());
        };
        request.onsuccess = function (_a) {
            var result = _a.target.result;
            var db = result;
            var transaction = db.transaction([storageName], "readwrite");
            var objectStore = transaction.objectStore(storageName);
            onSuccess(objectStore);
        };
    };
    DataBaseExecutor.prototype.get = function (from, key, onSuccess, onError) {
        var request = this.indexeddb.open(this.dbInstanceName);
        request.onerror = function (ev) {
            onError(ev.toString());
        };
        request.onsuccess = function (_a) {
            var result = _a.target.result;
            var db = result;
            var transaction = db.transaction([from], "readwrite");
            var objectStore = transaction.objectStore(from);
            if (key) {
                var request_1 = objectStore.get(key);
                request_1.onerror = function (event) {
                    onError(event.toString());
                };
                request_1.onsuccess = function (_a) {
                    var result = _a.target.result;
                    onSuccess(result);
                };
            }
        };
    };
    DataBaseExecutor.prototype.getAll = function (from, onSuccess, onError) {
        var request = this.indexeddb.open(this.dbInstanceName);
        request.onerror = function (ev) {
            onError(ev.toString());
        };
        request.onsuccess = function (_a) {
            var result = _a.target.result;
            var db = result;
            var transaction = db.transaction([from], "readwrite");
            var objectStore = transaction.objectStore(from);
            var request = objectStore.getAll();
            request.onerror = function (event) {
                onError(event.toString());
            };
            request.onsuccess = function (_a) {
                var result = _a.target.result;
                onSuccess(result);
            };
        };
    };
    DataBaseExecutor.prototype.getAllWithKeys = function (from, onSuccess, onError) {
        var request = this.indexeddb.open(this.dbInstanceName);
        request.onerror = function (ev) {
            onError(ev.toString());
        };
        request.onsuccess = function (_a) {
            var result = _a.target.result;
            var items = new Map();
            var db = result;
            var transaction = db.transaction([from], "readwrite");
            var objectStore = transaction.objectStore(from);
            var request = objectStore.openCursor();
            request.onerror = function (event) {
                onError(event.toString());
            };
            request.onsuccess = function (_a) {
                var result = _a.target.result;
                if (result) {
                    var key = result.primaryKey;
                    var value = result.value;
                    items.set(key, value);
                    result.continue();
                }
                else {
                    onSuccess(items);
                }
            };
        };
    };
    DataBaseExecutor.prototype.getWithQuery = function (from, query, index, onSuccess, onError) {
        var request = this.indexeddb.open(this.dbInstanceName);
        request.onerror = function (ev) {
            onError(ev.toString());
        };
        request.onsuccess = function (_a) {
            var result = _a.target.result;
            var list = [];
            var db = result;
            var transaction = db.transaction([from], "readwrite");
            var objectStore = transaction.objectStore(from);
            if (index) {
                if (Array.isArray(index)) {
                    objectStore = objectStore.index(index.join(", "));
                }
                else
                    objectStore = objectStore.index(index);
            }
            if (Array.isArray(query)) {
                query.forEach(function (q) {
                    objectStore.openCursor(q).onsuccess = function (_a) {
                        var cursor = _a.target.result;
                        if (cursor) {
                            list.push(cursor.value);
                            cursor.continue();
                        }
                        else {
                            onSuccess(list);
                        }
                    };
                });
            }
            else
                objectStore.openCursor(query).onsuccess = function (_a) {
                    var cursor = _a.target.result;
                    if (cursor) {
                        list.push(cursor.value);
                        cursor.continue();
                    }
                    else {
                        onSuccess(list);
                    }
                };
        };
    };
    DataBaseExecutor.prototype.set = function (from, value, onSuccess, onError) {
        if (onSuccess === void 0) { onSuccess = function () { }; }
        if (onError === void 0) { onError = function () { }; }
        var request = this.indexeddb.open(this.dbInstanceName);
        request.onerror = function (ev) {
            onError(ev.toString());
        };
        request.onsuccess = function (_a) {
            var result = _a.target.result;
            var db = result;
            var transaction = db.transaction([from], "readwrite");
            var objectStore = transaction.objectStore(from);
            if (objectStore) {
                var request_2 = objectStore.put(value);
                request_2.onerror = function (event) {
                    onError(event.toString());
                };
                request_2.onsuccess = function (_a) {
                    var result = _a.target.result;
                    onSuccess(result);
                };
            }
        };
    };
    DataBaseExecutor.prototype.setByKey = function (from, value, key, onSuccess, onError) {
        var request = this.indexeddb.open(this.dbInstanceName);
        request.onerror = function (ev) {
            onError(ev.toString());
        };
        request.onsuccess = function (_a) {
            var result = _a.target.result;
            var db = result;
            var transaction = db.transaction([from], "readwrite");
            var objectStore = transaction.objectStore(from);
            if (objectStore) {
                var request_3 = objectStore.put(value, key);
                request_3.onerror = function (event) {
                    onError(event.toString());
                };
                request_3.onsuccess = function (_a) {
                    var result = _a.target.result;
                    onSuccess(result);
                };
            }
        };
    };
    DataBaseExecutor.prototype.setList = function (from, value, onSuccess, onError) {
        var request = this.indexeddb.open(this.dbInstanceName);
        request.onerror = function (ev) {
            onError(ev.toString());
        };
        request.onsuccess = function (_a) {
            var result = _a.target.result;
            var db = result;
            var transaction = db.transaction([from], "readwrite");
            var objectStore = transaction.objectStore(from);
            Promise.all(value.map(function (item) {
                return new Promise(function (resolve, reject) {
                    var request = objectStore.put(item);
                    request.onerror = function (event) {
                        reject(event);
                    };
                    request.onsuccess = function () {
                        resolve();
                    };
                });
            }))
                .then(function () {
                onSuccess();
            })
                .catch(function (e) {
                onError(e.toString());
            });
        };
    };
    DataBaseExecutor.prototype.remove = function (from, key, onSuccess, onError) {
        var request = this.indexeddb.open(this.dbInstanceName);
        request.onerror = function (ev) {
            onError(ev.toString());
        };
        request.onsuccess = function (_a) {
            var result = _a.target.result;
            var db = result;
            var transaction = db.transaction([from], "readwrite");
            var objectStore = transaction.objectStore(from);
            if (objectStore) {
                var request_4 = objectStore.delete(key);
                request_4.onerror = function (event) {
                    onError(event.toString());
                };
                request_4.onsuccess = function () {
                    onSuccess();
                };
            }
        };
    };
    DataBaseExecutor.prototype.removeWithQuery = function (from, query, index, onSuccess, onError) {
        var request = this.indexeddb.open(this.dbInstanceName);
        request.onerror = function (ev) {
            onError(ev.toString());
        };
        request.onsuccess = function (_a) {
            var result = _a.target.result;
            var keys = new Set();
            var db = result;
            var transaction = db.transaction([from], "readwrite");
            var objectStore = transaction.objectStore(from);
            if (index) {
                if (Array.isArray(index)) {
                    objectStore = objectStore.index(index.join(", "));
                }
                else
                    objectStore = objectStore.index(index);
            }
            if (Array.isArray(query)) {
                query.forEach(function (q) {
                    objectStore.openCursor(q).onsuccess = function (_a) {
                        var cursor = _a.target.result;
                        if (cursor) {
                            keys.add(cursor.primaryKey);
                            cursor.delete();
                            cursor.continue();
                        }
                        else {
                            onSuccess(keys);
                        }
                    };
                });
            }
            else
                objectStore.openCursor(query).onsuccess = function (_a) {
                    var cursor = _a.target.result;
                    if (cursor) {
                        keys.add(cursor.primaryKey);
                        cursor.delete();
                        cursor.continue();
                    }
                    else {
                        onSuccess(keys);
                    }
                };
        };
    };
    DataBaseExecutor.prototype.clear = function (from, onSuccess, onError) {
        var request = this.indexeddb.open(this.dbInstanceName);
        request.onerror = function (ev) {
            onError(ev.toString());
        };
        request.onsuccess = function (_a) {
            var result = _a.target.result;
            var db = result;
            var transaction = db.transaction([from], "readwrite");
            var objectStore = transaction.objectStore(from);
            if (objectStore) {
                var request_5 = objectStore.clear();
                request_5.onerror = function (event) {
                    onError(event.toString());
                };
                request_5.onsuccess = function (_a) {
                    var result = _a.target.result;
                    onSuccess(result);
                };
            }
        };
    };
    DataBaseExecutor.prototype.fireEvent = function (eventName, detail) {
        self.dispatchEvent(new CustomEvent(eventName, { detail: detail }));
    };
    return DataBaseExecutor;
}());
export { DataBaseExecutor };
//# sourceMappingURL=executor.js.map