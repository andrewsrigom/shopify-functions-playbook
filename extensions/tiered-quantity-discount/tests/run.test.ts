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
            quantity: 1,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/1",
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
    name: "below-tier",
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
            tiers: [
              {
                minimum: 3,
                percentage: 10,
              },
              {
                minimum: 6,
                percentage: 20,
              },
            ],
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
            quantity: 1,
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
    name: "duplicate-threshold",
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
            quantity: 1,
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
            tiers: [
              {
                minimum: 3,
                percentage: 10,
              },
              {
                minimum: 3,
                percentage: 20,
              },
            ],
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
            tiers: [
              {
                minimum: 3,
                percentage: 10,
              },
              {
                minimum: 6,
                percentage: 20,
              },
            ],
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
            quantity: 1,
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
            tiers: [
              {
                minimum: 3,
                percentage: 10,
              },
              {
                minimum: 6,
                percentage: 20,
              },
            ],
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
                      id: "gid://shopify/CartLine/1",
                      quantity: 2,
                    },
                  },
                ],
                value: {
                  percentage: {
                    value: "10",
                  },
                },
              },
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
                    value: "10",
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
    name: "higher-tier-boundary",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 5,
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
              id: "gid://shopify/ProductVariant/1",
            },
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            tiers: [
              {
                minimum: 3,
                percentage: 10,
              },
              {
                minimum: 6,
                percentage: 20,
              },
            ],
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
                      id: "gid://shopify/CartLine/1",
                      quantity: 5,
                    },
                  },
                ],
                value: {
                  percentage: {
                    value: "20",
                  },
                },
              },
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
                    value: "20",
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
    name: "invalid-percentage",
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
            quantity: 1,
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
            tiers: [
              {
                minimum: 3,
                percentage: 101,
              },
              {
                minimum: 6,
                percentage: 20,
              },
            ],
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
            quantity: 1,
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
            quantity: 1,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/1",
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
    name: "wrong-class",
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
            quantity: 1,
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
            tiers: [
              {
                minimum: 3,
                percentage: 10,
              },
              {
                minimum: 6,
                percentage: 20,
              },
            ],
          },
        },
        discountClasses: ["ORDER"],
      },
    },
    expected: {
      operations: [],
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
            quantity: 1,
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
