import { it, expect } from "vitest";
import type { CartValidationsGenerateRunInput } from "../generated/input";
import { cartValidationsGenerateRun } from "../src/cart_validations_generate_run";

const cases: {
  name: string;
  input: CartValidationsGenerateRunInput;
  expected: unknown;
}[] = [
  {
    name: "above-boundary",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
          },
        ],
        cost: {
          subtotalAmount: {
            amount: "50.01",
            currencyCode: "USD",
          },
        },
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
            minimum: "50.00",
            currency: "USD",
          },
        },
      },
    },
    expected: {
      operations: [],
    },
  },
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
            amount: "49.99",
            currencyCode: "USD",
          },
        },
      },
      validation: {
        config: {
          jsonValue: [],
        },
      },
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "below",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
          },
        ],
        cost: {
          subtotalAmount: {
            amount: "49.99",
            currencyCode: "USD",
          },
        },
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
            minimum: "50.00",
            currency: "USD",
          },
        },
      },
    },
    expected: {
      operations: [
        {
          validationAdd: {
            errors: [
              {
                message: "Minimum order subtotal is 50.00 USD.",
                target: "$.cart",
              },
            ],
          },
        },
      ],
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
            amount: "49.99",
            currencyCode: "USD",
          },
        },
      },
      validation: {
        config: {
          jsonValue: {
            enabled: false,
          },
        },
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
            amount: "49.99",
            currencyCode: "USD",
          },
        },
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
            minimum: "50.00",
            currency: "USD",
          },
        },
      },
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "exact-boundary",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
          },
        ],
        cost: {
          subtotalAmount: {
            amount: "50.00",
            currencyCode: "USD",
          },
        },
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
            minimum: "50.00",
            currency: "USD",
          },
        },
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
          },
        ],
        cost: {
          subtotalAmount: {
            amount: "49.99",
            currencyCode: "USD",
          },
        },
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
            minimum: "NaN",
            currency: "USD",
          },
        },
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
            amount: "49.99",
            currencyCode: "USD",
          },
        },
      },
      validation: {
        config: null,
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
            amount: "49.99",
            currencyCode: "USD",
          },
        },
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
            minimum: "50.00",
            currency: "USD",
          },
        },
      },
    },
    expected: {
      operations: [
        {
          validationAdd: {
            errors: [
              {
                message: "Minimum order subtotal is 50.00 USD.",
                target: "$.cart",
              },
            ],
          },
        },
      ],
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
            amount: "49.99",
            currencyCode: "EUR",
          },
        },
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
            minimum: "50.00",
            currency: "USD",
          },
        },
      },
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "six-decimal-boundary",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
          },
        ],
        cost: {
          subtotalAmount: {
            amount: "49.999999",
            currencyCode: "USD",
          },
        },
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
            minimum: "50.00",
            currency: "USD",
          },
        },
      },
    },
    expected: {
      operations: [
        {
          validationAdd: {
            errors: [
              {
                message: "Minimum order subtotal is 50.00 USD.",
                target: "$.cart",
              },
            ],
          },
        },
      ],
    },
  },
  {
    name: "too-many-decimals",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
          },
        ],
        cost: {
          subtotalAmount: {
            amount: "49.9999999",
            currencyCode: "USD",
          },
        },
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
            minimum: "50.00",
            currency: "USD",
          },
        },
      },
    },
    expected: {
      operations: [],
    },
  },
];

it.each(cases)("$name", (test) =>
  expect(cartValidationsGenerateRun(test.input)).toEqual(test.expected),
);
