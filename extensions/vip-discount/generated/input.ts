/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/**
 * The [discount class](https://help.shopify.com/manual/discounts/combining-discounts/discount-combinations)
 * that's used to control how discounts can be combined.
 */
export type DiscountClass =
  /**
   * The discount is combined with an
   * [order discount](https://help.shopify.com/manual/discounts/combining-discounts/discount-combinations)
   * class.
   */
  | 'ORDER'
  /**
   * The discount is combined with a
   * [product discount](https://help.shopify.com/manual/discounts/combining-discounts/discount-combinations)
   * class.
   */
  | 'PRODUCT'
  /**
   * The discount is combined with a
   * [shipping discount](https://help.shopify.com/manual/discounts/combining-discounts/discount-combinations)
   * class.
   */
  | 'SHIPPING';

export type CartLinesDiscountsGenerateRunInputVariables = Exact<{ [key: string]: never; }>;


export type CartLinesDiscountsGenerateRunInput = { cart: { buyerIdentity: { customer: { hasAnyTag: boolean } | null } | null, lines: Array<{ id: string, quantity: number }> }, discount: { discountClasses: Array<DiscountClass>, config: { jsonValue: unknown } | null } };
