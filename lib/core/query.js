var Query = /** @class */ (function () {
    function Query() {
    }
    Query.bound = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return IDBKeyRange.bound.apply(IDBKeyRange, args);
    };
    Query.only = function (value) {
        return IDBKeyRange.only(value);
    };
    Query.many = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        return values.map(function (v) { return IDBKeyRange.only(v); });
    };
    Query.lowerBound = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return IDBKeyRange.lowerBound.apply(IDBKeyRange, args);
    };
    Query.upperBound = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return IDBKeyRange.upperBound.apply(IDBKeyRange, args);
    };
    return Query;
}());
export { Query };
//# sourceMappingURL=query.js.map