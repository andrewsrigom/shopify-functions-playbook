/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type CartValidationsGenerateRunInputVariables = Exact<{ [key: string]: never; }>;


export type CartValidationsGenerateRunInput = { cart: { lines: Array<{ id: string, quantity: number, merchandise:
        | { __typename: 'CustomProduct' }
        | { __typename: 'ProductVariant', id: string }
       }> }, validation: { config: { jsonValue: unknown } | null } };
