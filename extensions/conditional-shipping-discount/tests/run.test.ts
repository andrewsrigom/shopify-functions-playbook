import { it, expect } from "vitest";
import type { CartDeliveryOptionsDiscountsGenerateRunInput } from "../generated/input";
import { cartDeliveryOptionsDiscountsGenerateRun } from "../src/cart_delivery_options_discounts_generate_run";

const cases: {
  name: string;
  input: CartDeliveryOptionsDiscountsGenerateRunInput;
  expected: unknown;
}[] = [
  {
    name: "array-config",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
          },
        ],
        cost: {
          subtotalAmount: {
            amount: "75.00",
            currencyCode: "USD",
          },
        },
        deliveryGroups: [
          {
            deliveryOptions: [
              {
                handle: "standard",
                title: "Standard",
              },
              {
                handle: "express",
                title: "Express",
              },
            ],
          },
        ],
      },
      discount: {
        config: {
          jsonValue: [],
        },
        discountClasses: ["SHIPPING"],
      },
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "below-threshold",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
          },
        ],
        cost: {
          subtotalAmount: {
            amount: "74.99",
            currencyCode: "USD",
          },
        },
        deliveryGroups: [
          {
            deliveryOptions: [
              {
                handle: "standard",
                title: "Standard",
              },
              {
                handle: "express",
                title: "Express",
              },
            ],
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            minimum: "75.00",
            currency: "USD",
            optionTitle: "Standard",
            percentage: 100,
          },
        },
        discountClasses: ["SHIPPING"],
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
          },
        ],
        cost: {
          subtotalAmount: {
            amount: "75.00",
            currencyCode: "USD",
          },
        },
        deliveryGroups: [
          {
            deliveryOptions: [
              {
                handle: "standard",
                title: "Standard",
              },
              {
                handle: "express",
                title: "Express",
              },
            ],
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: false,
          },
        },
        discountClasses: ["SHIPPING"],
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
        cost: {
          subtotalAmount: {
            amount: "75.00",
            currencyCode: "USD",
          },
        },
        deliveryGroups: [
          {
            deliveryOptions: [
              {
                handle: "standard",
                title: "Standard",
              },
              {
                handle: "express",
                title: "Express",
              },
            ],
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            minimum: "75.00",
            currency: "USD",
            optionTitle: "Standard",
            percentage: 100,
          },
        },
        discountClasses: ["SHIPPING"],
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
          },
        ],
        cost: {
          subtotalAmount: {
            amount: "75.00",
            currencyCode: "USD",
          },
        },
        deliveryGroups: [
          {
            deliveryOptions: [
              {
                handle: "standard",
                title: "Standard",
              },
              {
                handle: "express",
                title: "Express",
              },
            ],
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            minimum: "75.00",
            currency: "USD",
            optionTitle: "Standard",
            percentage: 100,
          },
        },
        discountClasses: ["SHIPPING"],
      },
    },
    expected: {
      operations: [
        {
          deliveryDiscountsAdd: {
            candidates: [
              {
                targets: [
                  {
                    deliveryOption: {
                      handle: "standard",
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
          },
        ],
        cost: {
          subtotalAmount: {
            amount: "75.00",
            currencyCode: "USD",
          },
        },
        deliveryGroups: [
          {
            deliveryOptions: [
              {
                handle: "standard",
                title: "Standard",
              },
              {
                handle: "express",
                title: "Express",
              },
            ],
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
          },
        },
        discountClasses: ["SHIPPING"],
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
          },
        ],
        cost: {
          subtotalAmount: {
            amount: "75.00",
            currencyCode: "USD",
          },
        },
        deliveryGroups: [
          {
            deliveryOptions: [
              {
                handle: "standard",
                title: "Standard",
              },
              {
                handle: "express",
                title: "Express",
              },
            ],
          },
        ],
      },
      discount: {
        config: null,
        discountClasses: ["SHIPPING"],
      },
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "missing-title",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
          },
        ],
        cost: {
          subtotalAmount: {
            amount: "75.00",
            currencyCode: "USD",
          },
        },
        deliveryGroups: [
          {
            deliveryOptions: [
              {
                handle: "standard",
                title: null,
              },
              {
                handle: "express",
                title: "Express",
              },
            ],
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            minimum: "75.00",
            currency: "USD",
            optionTitle: "Standard",
            percentage: 100,
          },
        },
        discountClasses: ["SHIPPING"],
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
        lines: [
          {
            id: "gid://shopify/CartLine/1",
          },
          {
            id: "gid://shopify/CartLine/2",
          },
        ],
        cost: {
          subtotalAmount: {
            amount: "75.00",
            currencyCode: "USD",
          },
        },
        deliveryGroups: [
          {
            deliveryOptions: [
              {
                handle: "standard",
                title: "Standard",
              },
              {
                handle: "express",
                title: "Express",
              },
            ],
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            minimum: "75.00",
            currency: "USD",
            optionTitle: "Standard",
            percentage: 100,
          },
        },
        discountClasses: ["SHIPPING"],
      },
    },
    expected: {
      operations: [
        {
          deliveryDiscountsAdd: {
            candidates: [
              {
                targets: [
                  {
                    deliveryOption: {
                      handle: "standard",
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
    name: "no-delivery-groups",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
          },
        ],
        cost: {
          subtotalAmount: {
            amount: "75.00",
            currencyCode: "USD",
          },
        },
        deliveryGroups: [],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            minimum: "75.00",
            currency: "USD",
            optionTitle: "Standard",
            percentage: 100,
          },
        },
        discountClasses: ["SHIPPING"],
      },
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "other-currency",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
          },
        ],
        cost: {
          subtotalAmount: {
            amount: "75.00",
            currencyCode: "EUR",
          },
        },
        deliveryGroups: [
          {
            deliveryOptions: [
              {
                handle: "standard",
                title: "Standard",
              },
              {
                handle: "express",
                title: "Express",
              },
            ],
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: true,
            minimum: "75.00",
            currency: "USD",
            optionTitle: "Standard",
            percentage: 100,
          },
        },
        discountClasses: ["SHIPPING"],
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
          },
        ],
        cost: {
          subtotalAmount: {
            amount: "75.00",
            currencyCode: "USD",
          },
        },
        deliveryGroups: [
          {
            deliveryOptions: [
              {
                handle: "standard",
                title: "Standard",
              },
              {
                handle: "express",
                title: "Express",
              },
            ],
          },
        ],
      },
      discount: {
        config: {
          jsonValue: {
            enabled: "true",
          },
        },
        discountClasses: ["SHIPPING"],
      },
    },
    expected: {
      operations: [],
    },
  },
];

it.each(cases)("$name", (test) =>
  expect(cartDeliveryOptionsDiscountsGenerateRun(test.input)).toEqual(
    test.expected,
  ),
);
