/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type CartDeliveryOptionsTransformRunInputVariables = Exact<{ [key: string]: never; }>;


export type CartDeliveryOptionsTransformRunInput = { cart: { lines: Array<{ id: string }>, deliveryGroups: Array<{ deliveryOptions: Array<{ handle: string, title: string | null }> }> }, deliveryCustomization: { config: { jsonValue: unknown } | null } };
