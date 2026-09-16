import { it, expect } from "vitest";
import type { CartPaymentMethodsTransformRunInput } from "../generated/input";
import { cartPaymentMethodsTransformRun } from "../src/cart_payment_methods_transform_run";

const cases: {
  name: string;
  input: CartPaymentMethodsTransformRunInput;
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
          totalAmount: {
            amount: "200.01",
            currencyCode: "USD",
          },
        },
      },
      paymentCustomization: {
        config: {
          jsonValue: [],
        },
      },
      paymentMethods: [
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/1",
          name: "Cash on Delivery",
        },
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/2",
          name: "Card",
        },
      ],
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
          totalAmount: {
            amount: "200.01",
            currencyCode: "USD",
          },
        },
      },
      paymentCustomization: {
        config: {
          jsonValue: {
            enabled: false,
          },
        },
      },
      paymentMethods: [
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/1",
          name: "Cash on Delivery",
        },
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/2",
          name: "Card",
        },
      ],
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
          totalAmount: {
            amount: "200.01",
            currencyCode: "USD",
          },
        },
      },
      paymentCustomization: {
        config: {
          jsonValue: {
            enabled: true,
            maximum: "200.00",
            currency: "USD",
            methodName: "Cash on Delivery",
          },
        },
      },
      paymentMethods: [
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/1",
          name: "Cash on Delivery",
        },
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/2",
          name: "Card",
        },
      ],
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
          totalAmount: {
            amount: "200.00",
            currencyCode: "USD",
          },
        },
      },
      paymentCustomization: {
        config: {
          jsonValue: {
            enabled: true,
            maximum: "200.00",
            currency: "USD",
            methodName: "Cash on Delivery",
          },
        },
      },
      paymentMethods: [
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/1",
          name: "Cash on Delivery",
        },
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/2",
          name: "Card",
        },
      ],
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
          totalAmount: {
            amount: "200.01",
            currencyCode: "USD",
          },
        },
      },
      paymentCustomization: {
        config: {
          jsonValue: {
            enabled: true,
            maximum: "200.00",
            currency: "USD",
            methodName: "Cash on Delivery",
          },
        },
      },
      paymentMethods: [
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/1",
          name: "Cash on Delivery",
        },
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/2",
          name: "Card",
        },
      ],
    },
    expected: {
      operations: [
        {
          paymentMethodHide: {
            paymentMethodId:
              "gid://shopify/PaymentCustomizationPaymentMethod/1",
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
          totalAmount: {
            amount: "200.01",
            currencyCode: "USD",
          },
        },
      },
      paymentCustomization: {
        config: {
          jsonValue: {
            enabled: true,
          },
        },
      },
      paymentMethods: [
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/1",
          name: "Cash on Delivery",
        },
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/2",
          name: "Card",
        },
      ],
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
          totalAmount: {
            amount: "200.01",
            currencyCode: "USD",
          },
        },
      },
      paymentCustomization: {
        config: null,
      },
      paymentMethods: [
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/1",
          name: "Cash on Delivery",
        },
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/2",
          name: "Card",
        },
      ],
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
          totalAmount: {
            amount: "200.01",
            currencyCode: "USD",
          },
        },
      },
      paymentCustomization: {
        config: {
          jsonValue: {
            enabled: true,
            maximum: "200.00",
            currency: "USD",
            methodName: "Cash on Delivery",
          },
        },
      },
      paymentMethods: [
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/1",
          name: "Cash on Delivery",
        },
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/2",
          name: "Card",
        },
      ],
    },
    expected: {
      operations: [
        {
          paymentMethodHide: {
            paymentMethodId:
              "gid://shopify/PaymentCustomizationPaymentMethod/1",
          },
        },
      ],
    },
  },
  {
    name: "no-matching-method",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
          },
        ],
        cost: {
          totalAmount: {
            amount: "200.01",
            currencyCode: "USD",
          },
        },
      },
      paymentCustomization: {
        config: {
          jsonValue: {
            enabled: true,
            maximum: "200.00",
            currency: "USD",
            methodName: "Cash on Delivery",
          },
        },
      },
      paymentMethods: [
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/2",
          name: "Card",
        },
      ],
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
          totalAmount: {
            amount: "200.01",
            currencyCode: "EUR",
          },
        },
      },
      paymentCustomization: {
        config: {
          jsonValue: {
            enabled: true,
            maximum: "200.00",
            currency: "USD",
            methodName: "Cash on Delivery",
          },
        },
      },
      paymentMethods: [
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/1",
          name: "Cash on Delivery",
        },
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/2",
          name: "Card",
        },
      ],
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
          totalAmount: {
            amount: "200.01",
            currencyCode: "USD",
          },
        },
      },
      paymentCustomization: {
        config: {
          jsonValue: {
            enabled: "true",
          },
        },
      },
      paymentMethods: [
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/1",
          name: "Cash on Delivery",
        },
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/2",
          name: "Card",
        },
      ],
    },
    expected: {
      operations: [],
    },
  },
];

it.each(cases)("$name", (test) =>
  expect(cartPaymentMethodsTransformRun(test.input)).toEqual(test.expected),
);
