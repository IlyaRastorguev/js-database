import { QueryBoundType, QueryLowerBoundType, QueryOnlyType, QueryUpperBoundType } from "../types";
export declare class Query {
    private constructor();
    static bound(...args: QueryBoundType): IDBKeyRange;
    static only(value: QueryOnlyType): IDBKeyRange;
    static many(...values: QueryOnlyType[]): IDBKeyRange[];
    static lowerBound(...args: QueryLowerBoundType): IDBKeyRange;
    static upperBound(...args: QueryUpperBoundType): IDBKeyRange;
}
//# sourceMappingURL=query.d.ts.map