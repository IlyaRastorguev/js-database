import {QueryBoundType, QueryLowerBoundType, QueryOnlyType, QueryUpperBoundType} from "../types";

export class Query {
    private constructor() {}

    static bound(...args: QueryBoundType) {
        return IDBKeyRange.bound(...args)
    }

    static only(value: QueryOnlyType) {
        return IDBKeyRange.only(value)
    }

    static lowerBound(...args: QueryLowerBoundType) {
        return IDBKeyRange.lowerBound(...args)
    }

    static upperBound(...args: QueryUpperBoundType) {
        return IDBKeyRange.upperBound(...args)
    }
}