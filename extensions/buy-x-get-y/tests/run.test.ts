import { it, expect } from "vitest";
import type { CartLinesDiscountsGenerateRunInput } from "../generated/input";
import { cartLinesDiscountsGenerateRun } from "../src/cart_lines_discounts_generate_run";

const cases: {
  name: string;
  input: CartLinesDiscountsGenerateRunInput;
  expected: unknown;
}[] = [
  {
    name: "array-config",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/1",
            },
          },
          {
            id: "gid://shopify/CartLine/2",
            quantity: 3,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/2",
            },
          },
        ],
      },
      discount: {
        config: {
          jsonValue: [],
        },
        discountClasses: ["PRODUCT"],
      },
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "below-qualifying",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 1,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/1",
            },
          },
          {
            id: "gid://shopify/CartLine/2",
            quantity: 3,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/2",
            },
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            buyVariant: "gid://shopify/ProductVariant/1",
            getVariant: "gid://shopify/ProductVariant/2",
            buyQuantity: 2,
            getQuantity: 1,
          },
        },
        discountClasses: ["PRODUCT"],
      },
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "disabled",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/1",
            },
          },
          {
            id: "gid://shopify/CartLine/2",
            quantity: 3,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/2",
            },
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: false,
          },
        },
        discountClasses: ["PRODUCT"],
      },
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "empty-cart",
    input: {
      cart: {
        lines: [],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            buyVariant: "gid://shopify/ProductVariant/1",
            getVariant: "gid://shopify/ProductVariant/2",
            buyQuantity: 2,
            getQuantity: 1,
          },
        },
        discountClasses: ["PRODUCT"],
      },
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "example",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/1",
            },
          },
          {
            id: "gid://shopify/CartLine/2",
            quantity: 3,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/2",
            },
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            buyVariant: "gid://shopify/ProductVariant/1",
            getVariant: "gid://shopify/ProductVariant/2",
            buyQuantity: 2,
            getQuantity: 1,
          },
        },
        discountClasses: ["PRODUCT"],
      },
    },
    expected: {
      operations: [
        {
          productDiscountsAdd: {
            candidates: [
              {
                targets: [
                  {
                    cartLine: {
                      id: "gid://shopify/CartLine/2",
                      quantity: 1,
                    },
                  },
                ],
                value: {
                  percentage: {
                    value: "100",
                  },
                },
              },
            ],
            selectionStrategy: "ALL",
          },
        },
      ],
    },
  },
  {
    name: "malformed",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/1",
            },
          },
          {
            id: "gid://shopify/CartLine/2",
            quantity: 3,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/2",
            },
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
          },
        },
        discountClasses: ["PRODUCT"],
      },
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "missing-config",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/1",
            },
          },
          {
            id: "gid://shopify/CartLine/2",
            quantity: 3,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/2",
            },
          },
        ],
      },
      discount: {
        config: null,
        discountClasses: ["PRODUCT"],
      },
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "no-gift-in-cart",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/1",
            },
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            buyVariant: "gid://shopify/ProductVariant/1",
            getVariant: "gid://shopify/ProductVariant/2",
            buyQuantity: 2,
            getQuantity: 1,
          },
        },
        discountClasses: ["PRODUCT"],
      },
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "same-variant-invalid",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/1",
            },
          },
          {
            id: "gid://shopify/CartLine/2",
            quantity: 3,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/2",
            },
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            buyVariant: "gid://shopify/ProductVariant/1",
            getVariant: "gid://shopify/ProductVariant/1",
            buyQuantity: 2,
            getQuantity: 1,
          },
        },
        discountClasses: ["PRODUCT"],
      },
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "split-reward-lines",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 4,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/1",
            },
          },
          {
            id: "gid://shopify/CartLine/2",
            quantity: 1,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/2",
            },
          },
          {
            id: "gid://shopify/CartLine/3",
            quantity: 2,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/2",
            },
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            buyVariant: "gid://shopify/ProductVariant/1",
            getVariant: "gid://shopify/ProductVariant/2",
            buyQuantity: 2,
            getQuantity: 1,
          },
        },
        discountClasses: ["PRODUCT"],
      },
    },
    expected: {
      operations: [
        {
          productDiscountsAdd: {
            candidates: [
              {
                targets: [
                  {
                    cartLine: {
                      id: "gid://shopify/CartLine/2",
                      quantity: 1,
                    },
                  },
                  {
                    cartLine: {
                      id: "gid://shopify/CartLine/3",
                      quantity: 1,
                    },
                  },
                ],
                value: {
                  percentage: {
                    value: "100",
                  },
                },
              },
            ],
            selectionStrategy: "ALL",
          },
        },
      ],
    },
  },
  {
    name: "two-rewards",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 4,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/1",
            },
          },
          {
            id: "gid://shopify/CartLine/2",
            quantity: 3,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/2",
            },
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            buyVariant: "gid://shopify/ProductVariant/1",
            getVariant: "gid://shopify/ProductVariant/2",
            buyQuantity: 2,
            getQuantity: 1,
          },
        },
        discountClasses: ["PRODUCT"],
      },
    },
    expected: {
      operations: [
        {
          productDiscountsAdd: {
            candidates: [
              {
                targets: [
                  {
                    cartLine: {
                      id: "gid://shopify/CartLine/2",
                      quantity: 2,
                    },
                  },
                ],
                value: {
                  percentage: {
                    value: "100",
                  },
                },
              },
            ],
            selectionStrategy: "ALL",
          },
        },
      ],
    },
  },
  {
    name: "wrong-enabled",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/1",
            },
          },
          {
            id: "gid://shopify/CartLine/2",
            quantity: 3,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/2",
            },
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: "true",
          },
        },
        discountClasses: ["PRODUCT"],
      },
    },
    expected: {
      operations: [],
    },
  },
];

it.each(cases)("$name", (test) =>
  expect(cartLinesDiscountsGenerateRun(test.input)).toEqual(test.expected),
);
