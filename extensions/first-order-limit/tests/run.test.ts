import { it, expect } from "vitest";
import type { CartValidationsGenerateRunInput } from "../generated/input";
import { cartValidationsGenerateRun } from "../src/cart_validations_generate_run";

const cases: {
  name: string;
  input: CartValidationsGenerateRunInput;
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
        buyerIdentity: {
          customer: {
            numberOfOrders: 0,
          },
        },
        cost: {
          subtotalAmount: {
            amount: "100.01",
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
    name: "disabled",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
          },
        ],
        buyerIdentity: {
          customer: {
            numberOfOrders: 0,
          },
        },
        cost: {
          subtotalAmount: {
            amount: "100.01",
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
        buyerIdentity: {
          customer: {
            numberOfOrders: 0,
          },
        },
        cost: {
          subtotalAmount: {
            amount: "100.01",
            currencyCode: "USD",
          },
        },
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
            maximum: "100.00",
            currency: "USD",
            guests: "limit",
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
        buyerIdentity: {
          customer: {
            numberOfOrders: 0,
          },
        },
        cost: {
          subtotalAmount: {
            amount: "100.00",
            currencyCode: "USD",
          },
        },
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
            maximum: "100.00",
            currency: "USD",
            guests: "limit",
          },
        },
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
        buyerIdentity: {
          customer: {
            numberOfOrders: 0,
          },
        },
        cost: {
          subtotalAmount: {
            amount: "100.01",
            currencyCode: "USD",
          },
        },
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
            maximum: "100.00",
            currency: "USD",
            guests: "limit",
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
                message: "First-order subtotal exceeds the configured limit.",
                target: "$.cart",
              },
            ],
          },
        },
      ],
    },
  },
  {
    name: "guest-allowed",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
          },
        ],
        buyerIdentity: null,
        cost: {
          subtotalAmount: {
            amount: "100.01",
            currencyCode: "USD",
          },
        },
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
            maximum: "100.00",
            currency: "USD",
            guests: "allow",
          },
        },
      },
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "guest-limited",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
          },
        ],
        buyerIdentity: null,
        cost: {
          subtotalAmount: {
            amount: "100.01",
            currencyCode: "USD",
          },
        },
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
            maximum: "100.00",
            currency: "USD",
            guests: "limit",
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
                message: "First-order subtotal exceeds the configured limit.",
                target: "$.cart",
              },
            ],
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
        buyerIdentity: {
          customer: {
            numberOfOrders: 0,
          },
        },
        cost: {
          subtotalAmount: {
            amount: "100.01",
            currencyCode: "USD",
          },
        },
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
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
        buyerIdentity: {
          customer: {
            numberOfOrders: 0,
          },
        },
        cost: {
          subtotalAmount: {
            amount: "100.01",
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
        buyerIdentity: {
          customer: {
            numberOfOrders: 0,
          },
        },
        cost: {
          subtotalAmount: {
            amount: "100.01",
            currencyCode: "USD",
          },
        },
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
            maximum: "100.00",
            currency: "USD",
            guests: "limit",
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
                message: "First-order subtotal exceeds the configured limit.",
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
        buyerIdentity: {
          customer: {
            numberOfOrders: 0,
          },
        },
        cost: {
          subtotalAmount: {
            amount: "100.01",
            currencyCode: "EUR",
          },
        },
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
            maximum: "100.00",
            currency: "USD",
            guests: "limit",
          },
        },
      },
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "returning-customer",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
          },
        ],
        buyerIdentity: {
          customer: {
            numberOfOrders: 1,
          },
        },
        cost: {
          subtotalAmount: {
            amount: "100.01",
            currencyCode: "USD",
          },
        },
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
            maximum: "100.00",
            currency: "USD",
            guests: "limit",
          },
        },
      },
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "unidentified-customer",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
          },
        ],
        buyerIdentity: {
          customer: null,
        },
        cost: {
          subtotalAmount: {
            amount: "100.01",
            currencyCode: "USD",
          },
        },
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
            maximum: "100.00",
            currency: "USD",
            guests: "limit",
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
                message: "First-order subtotal exceeds the configured limit.",
                target: "$.cart",
              },
            ],
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
          },
        ],
        buyerIdentity: {
          customer: {
            numberOfOrders: 0,
          },
        },
        cost: {
          subtotalAmount: {
            amount: "100.01",
            currencyCode: "USD",
          },
        },
      },
      validation: {
        config: {
          jsonValue: {
            enabled: "true",
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
