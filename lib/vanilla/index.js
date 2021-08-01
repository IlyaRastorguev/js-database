var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { DataBaseExecutor } from "../core/executor";
export var subscribeForDatabaseReady = function (databaseName, action) {
    window.addEventListener(databaseName, action);
};
export var initDataBase = function (dataBaseName, dataBaseVersion, callback) {
    var storages = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        storages[_i - 3] = arguments[_i];
    }
    window.addEventListener(dataBaseName, callback);
    new (DataBaseExecutor.bind.apply(DataBaseExecutor, __spreadArray([void 0, dataBaseName, dataBaseVersion], storages)))();
};
//# sourceMappingURL=index.js.map