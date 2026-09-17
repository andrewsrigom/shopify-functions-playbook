import { it, expect } from "vitest";
import { cartLinesDiscountsGenerateRun } from "../src/cart_lines_discounts_generate_run";
import type { CartLinesDiscountsGenerateRunInput } from "../generated/input";
import { CurrencyCode, DiscountClass } from "../generated/api";

it("eligible", () => {
  const input: CartLinesDiscountsGenerateRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
          cost: {
            subtotalAmount: {
              amount: "100.00",
              currencyCode: CurrencyCode.Usd,
            },
          },
        },
      ],
    },
    discount: {
      discountClasses: [DiscountClass.Order],
      config: {
        jsonValue: {
          enabled: true,
          currency: "USD",
          minimumSubtotal: "100.00",
          amount: "10.00",
          excludedVariantIds: ["gid://shopify/ProductVariant/9"],
        },
      },
    },
  };

  expect(cartLinesDiscountsGenerateRun(input)).toEqual({
    operations: [
      {
        orderDiscountsAdd: {
          selectionStrategy: "FIRST",
          candidates: [
            {
              targets: [{ orderSubtotal: { excludedCartLineIds: [] } }],
              value: { fixedAmount: { amount: "10.000000" } },
            },
          ],
        },
      },
    ],
  });
});

it("below-threshold", () => {
  const input: CartLinesDiscountsGenerateRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
          cost: {
            subtotalAmount: {
              amount: "99.999999",
              currencyCode: CurrencyCode.Usd,
            },
          },
        },
      ],
    },
    discount: {
      discountClasses: [DiscountClass.Order],
      config: {
        jsonValue: {
          enabled: true,
          currency: "USD",
          minimumSubtotal: "100.00",
          amount: "10.00",
          excludedVariantIds: ["gid://shopify/ProductVariant/9"],
        },
      },
    },
  };

  expect(cartLinesDiscountsGenerateRun(input)).toEqual({ operations: [] });
});

it("different-currency", () => {
  const input: CartLinesDiscountsGenerateRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
          cost: {
            subtotalAmount: {
              amount: "100.00",
              currencyCode: CurrencyCode.Eur,
            },
          },
        },
      ],
    },
    discount: {
      discountClasses: [DiscountClass.Order],
      config: {
        jsonValue: {
          enabled: true,
          currency: "USD",
          minimumSubtotal: "100.00",
          amount: "10.00",
          excludedVariantIds: ["gid://shopify/ProductVariant/9"],
        },
      },
    },
  };

  expect(cartLinesDiscountsGenerateRun(input)).toEqual({ operations: [] });
});

it("cap-at-subtotal", () => {
  const input: CartLinesDiscountsGenerateRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
          cost: {
            subtotalAmount: {
              amount: "100.00",
              currencyCode: CurrencyCode.Usd,
            },
          },
        },
      ],
    },
    discount: {
      discountClasses: [DiscountClass.Order],
      config: {
        jsonValue: {
          enabled: true,
          currency: "USD",
          minimumSubtotal: "100.00",
          amount: "200.00",
          excludedVariantIds: ["gid://shopify/ProductVariant/9"],
        },
      },
    },
  };

  expect(cartLinesDiscountsGenerateRun(input)).toEqual({
    operations: [
      {
        orderDiscountsAdd: {
          selectionStrategy: "FIRST",
          candidates: [
            {
              targets: [{ orderSubtotal: { excludedCartLineIds: [] } }],
              value: { fixedAmount: { amount: "100.000000" } },
            },
          ],
        },
      },
    ],
  });
});

it("zero-discount", () => {
  const input: CartLinesDiscountsGenerateRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
          cost: {
            subtotalAmount: {
              amount: "100.00",
              currencyCode: CurrencyCode.Usd,
            },
          },
        },
      ],
    },
    discount: {
      discountClasses: [DiscountClass.Order],
      config: {
        jsonValue: {
          enabled: true,
          currency: "USD",
          minimumSubtotal: "100.00",
          amount: "0",
          excludedVariantIds: ["gid://shopify/ProductVariant/9"],
        },
      },
    },
  };

  expect(cartLinesDiscountsGenerateRun(input)).toEqual({ operations: [] });
});

it("all-excluded", () => {
  const input: CartLinesDiscountsGenerateRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/9",
          },
          cost: {
            subtotalAmount: {
              amount: "100.00",
              currencyCode: CurrencyCode.Usd,
            },
          },
        },
      ],
    },
    discount: {
      discountClasses: [DiscountClass.Order],
      config: {
        jsonValue: {
          enabled: true,
          currency: "USD",
          minimumSubtotal: "100.00",
          amount: "10.00",
          excludedVariantIds: ["gid://shopify/ProductVariant/9"],
        },
      },
    },
  };

  expect(cartLinesDiscountsGenerateRun(input)).toEqual({ operations: [] });
});

it("excluded-line", () => {
  const input: CartLinesDiscountsGenerateRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
          cost: {
            subtotalAmount: {
              amount: "100.00",
              currencyCode: CurrencyCode.Usd,
            },
          },
        },
        {
          id: "gid://shopify/CartLine/2",
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/9",
          },
          cost: {
            subtotalAmount: {
              amount: "200.00",
              currencyCode: CurrencyCode.Usd,
            },
          },
        },
      ],
    },
    discount: {
      discountClasses: [DiscountClass.Order],
      config: {
        jsonValue: {
          enabled: true,
          currency: "USD",
          minimumSubtotal: "100.00",
          amount: "10.00",
          excludedVariantIds: ["gid://shopify/ProductVariant/9"],
        },
      },
    },
  };

  expect(cartLinesDiscountsGenerateRun(input)).toEqual({
    operations: [
      {
        orderDiscountsAdd: {
          selectionStrategy: "FIRST",
          candidates: [
            {
              targets: [
                {
                  orderSubtotal: {
                    excludedCartLineIds: ["gid://shopify/CartLine/2"],
                  },
                },
              ],
              value: { fixedAmount: { amount: "10.000000" } },
            },
          ],
        },
      },
    ],
  });
});

it("wrong-class", () => {
  const input: CartLinesDiscountsGenerateRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
          cost: {
            subtotalAmount: {
              amount: "100.00",
              currencyCode: CurrencyCode.Usd,
            },
          },
        },
      ],
    },
    discount: {
      discountClasses: [DiscountClass.Product],
      config: {
        jsonValue: {
          enabled: true,
          currency: "USD",
          minimumSubtotal: "100.00",
          amount: "10.00",
          excludedVariantIds: ["gid://shopify/ProductVariant/9"],
        },
      },
    },
  };

  expect(cartLinesDiscountsGenerateRun(input)).toEqual({ operations: [] });
});

it("empty-cart", () => {
  const input: CartLinesDiscountsGenerateRunInput = {
    cart: {
      lines: [],
    },
    discount: {
      discountClasses: [DiscountClass.Order],
      config: {
        jsonValue: {
          enabled: true,
          currency: "USD",
          minimumSubtotal: "100.00",
          amount: "10.00",
          excludedVariantIds: ["gid://shopify/ProductVariant/9"],
        },
      },
    },
  };

  expect(cartLinesDiscountsGenerateRun(input)).toEqual({ operations: [] });
});

it("invalid-precision", () => {
  const input: CartLinesDiscountsGenerateRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
          cost: {
            subtotalAmount: {
              amount: "100.00",
              currencyCode: CurrencyCode.Usd,
            },
          },
        },
      ],
    },
    discount: {
      discountClasses: [DiscountClass.Order],
      config: {
        jsonValue: {
          enabled: true,
          currency: "USD",
          minimumSubtotal: "100.00",
          amount: "0.0000001",
          excludedVariantIds: ["gid://shopify/ProductVariant/9"],
        },
      },
    },
  };

  expect(cartLinesDiscountsGenerateRun(input)).toEqual({ operations: [] });
});

it("split-subtotal", () => {
  const input: CartLinesDiscountsGenerateRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
          cost: {
            subtotalAmount: {
              amount: "50.00",
              currencyCode: CurrencyCode.Usd,
            },
          },
        },
        {
          id: "gid://shopify/CartLine/2",
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/3",
          },
          cost: {
            subtotalAmount: {
              amount: "50.00",
              currencyCode: CurrencyCode.Usd,
            },
          },
        },
      ],
    },
    discount: {
      discountClasses: [DiscountClass.Order],
      config: {
        jsonValue: {
          enabled: true,
          currency: "USD",
          minimumSubtotal: "100.00",
          amount: "10.00",
          excludedVariantIds: ["gid://shopify/ProductVariant/9"],
        },
      },
    },
  };

  expect(cartLinesDiscountsGenerateRun(input)).toEqual({
    operations: [
      {
        orderDiscountsAdd: {
          selectionStrategy: "FIRST",
          candidates: [
            {
              targets: [{ orderSubtotal: { excludedCartLineIds: [] } }],
              value: { fixedAmount: { amount: "10.000000" } },
            },
          ],
        },
      },
    ],
  });
});

it("missing-configuration", () => {
  const input: CartLinesDiscountsGenerateRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
          cost: {
            subtotalAmount: {
              amount: "100.00",
              currencyCode: CurrencyCode.Usd,
            },
          },
        },
      ],
    },
    discount: {
      discountClasses: [DiscountClass.Order],
      config: null,
    },
  };

  expect(cartLinesDiscountsGenerateRun(input)).toEqual({ operations: [] });
});

it("disabled-configuration", () => {
  const input: CartLinesDiscountsGenerateRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
          cost: {
            subtotalAmount: {
              amount: "100.00",
              currencyCode: CurrencyCode.Usd,
            },
          },
        },
      ],
    },
    discount: {
      discountClasses: [DiscountClass.Order],
      config: {
        jsonValue: {
          enabled: false,
        },
      },
    },
  };

  expect(cartLinesDiscountsGenerateRun(input)).toEqual({ operations: [] });
});

it("malformed-configuration", () => {
  const input: CartLinesDiscountsGenerateRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
          cost: {
            subtotalAmount: {
              amount: "100.00",
              currencyCode: CurrencyCode.Usd,
            },
          },
        },
      ],
    },
    discount: {
      discountClasses: [DiscountClass.Order],
      config: {
        jsonValue: {
          enabled: true,
        },
      },
    },
  };

  expect(cartLinesDiscountsGenerateRun(input)).toEqual({ operations: [] });
});

it("invalid-json-configuration", () => {
  const input: CartLinesDiscountsGenerateRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
          cost: {
            subtotalAmount: {
              amount: "100.00",
              currencyCode: CurrencyCode.Usd,
            },
          },
        },
      ],
    },
    discount: {
      discountClasses: [DiscountClass.Order],
      config: {
        jsonValue: [],
      },
    },
  };

  expect(cartLinesDiscountsGenerateRun(input)).toEqual({ operations: [] });
});

it("scalar-configuration", () => {
  const input: CartLinesDiscountsGenerateRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
          cost: {
            subtotalAmount: {
              amount: "100.00",
              currencyCode: CurrencyCode.Usd,
            },
          },
        },
      ],
    },
    discount: {
      discountClasses: [DiscountClass.Order],
      config: {
        jsonValue: 42,
      },
    },
  };

  expect(cartLinesDiscountsGenerateRun(input)).toEqual({ operations: [] });
});
