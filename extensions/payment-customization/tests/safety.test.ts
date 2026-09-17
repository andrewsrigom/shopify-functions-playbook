import { it, expect } from "vitest";
import type { CartPaymentMethodsTransformRunInput } from "../generated/input";
import { cartPaymentMethodsTransformRun } from "../src/cart_payment_methods_transform_run";

const cases: {
  name: string;
  input: CartPaymentMethodsTransformRunInput;
  expected: unknown;
}[] = [
  {
    name: "only-matching-method",
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
      ],
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "all-methods-match",
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
          name: "Cash on Delivery",
        },
      ],
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "no-methods",
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
      paymentMethods: [],
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "explicit-hide-all",
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
            allowHidingAllMethods: true,
          },
        },
      },
      paymentMethods: [
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/1",
          name: "Cash on Delivery",
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
    name: "invalid-hide-all-policy",
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
            allowHidingAllMethods: "true",
          },
        },
      },
      paymentMethods: [
        {
          id: "gid://shopify/PaymentCustomizationPaymentMethod/1",
          name: "Cash on Delivery",
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
