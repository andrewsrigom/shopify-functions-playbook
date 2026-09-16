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
        buyerIdentity: {
          customer: {
            hasAnyTag: true,
          },
        },
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
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
    name: "disabled",
    input: {
      cart: {
        buyerIdentity: {
          customer: {
            hasAnyTag: true,
          },
        },
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
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
        buyerIdentity: {
          customer: {
            hasAnyTag: true,
          },
        },
        lines: [],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            percentage: 15,
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
        buyerIdentity: {
          customer: {
            hasAnyTag: true,
          },
        },
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            percentage: 15,
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
                    value: "15",
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
    name: "full-percentage",
    input: {
      cart: {
        buyerIdentity: {
          customer: {
            hasAnyTag: true,
          },
        },
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            percentage: 100,
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
    name: "guest",
    input: {
      cart: {
        buyerIdentity: null,
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            percentage: 15,
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
        buyerIdentity: {
          customer: {
            hasAnyTag: true,
          },
        },
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
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
        buyerIdentity: {
          customer: {
            hasAnyTag: true,
          },
        },
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
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
    name: "multiple-lines",
    input: {
      cart: {
        buyerIdentity: {
          customer: {
            hasAnyTag: true,
          },
        },
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
          },
          {
            id: "gid://shopify/CartLine/2",
            quantity: 2,
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            percentage: 15,
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
                  {
                    cartLine: {
                      id: "gid://shopify/CartLine/2",
                      quantity: 2,
                    },
                  },
                ],
                value: {
                  percentage: {
                    value: "15",
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
    name: "not-vip",
    input: {
      cart: {
        buyerIdentity: {
          customer: {
            hasAnyTag: false,
          },
        },
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            percentage: 15,
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
    name: "unidentified",
    input: {
      cart: {
        buyerIdentity: {
          customer: null,
        },
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            percentage: 15,
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
    name: "wrong-enabled",
    input: {
      cart: {
        buyerIdentity: {
          customer: {
            hasAnyTag: true,
          },
        },
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
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
  {
    name: "zero-percent",
    input: {
      cart: {
        buyerIdentity: {
          customer: {
            hasAnyTag: true,
          },
        },
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            percentage: 0,
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
