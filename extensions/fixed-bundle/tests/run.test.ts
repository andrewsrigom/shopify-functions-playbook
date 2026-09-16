import { it, expect } from "vitest";
import type { CartTransformRunInput } from "../generated/input";
import { cartTransformRun } from "../src/cart_transform_run";

const cases: {
  name: string;
  input: CartTransformRunInput;
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
            sellingPlanAllocation: null,
          },
        ],
      },
      cartTransform: {
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
    name: "different-parent",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            quantity: 2,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/9",
            },
            sellingPlanAllocation: null,
          },
        ],
      },
      cartTransform: {
        config: {
          jsonValue: {
            enabled: true,
            parentVariant: "gid://shopify/ProductVariant/1",
            components: [
              {
                variantId: "gid://shopify/ProductVariant/2",
                quantity: 2,
              },
              {
                variantId: "gid://shopify/ProductVariant/3",
                quantity: 1,
              },
            ],
          },
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
            quantity: 2,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/1",
            },
            sellingPlanAllocation: null,
          },
        ],
      },
      cartTransform: {
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
      },
      cartTransform: {
        config: {
          jsonValue: {
            enabled: true,
            parentVariant: "gid://shopify/ProductVariant/1",
            components: [
              {
                variantId: "gid://shopify/ProductVariant/2",
                quantity: 2,
              },
              {
                variantId: "gid://shopify/ProductVariant/3",
                quantity: 1,
              },
            ],
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
            quantity: 2,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/1",
            },
            sellingPlanAllocation: null,
          },
        ],
      },
      cartTransform: {
        config: {
          jsonValue: {
            enabled: true,
            parentVariant: "gid://shopify/ProductVariant/1",
            components: [
              {
                variantId: "gid://shopify/ProductVariant/2",
                quantity: 2,
              },
              {
                variantId: "gid://shopify/ProductVariant/3",
                quantity: 1,
              },
            ],
          },
        },
      },
    },
    expected: {
      operations: [
        {
          lineExpand: {
            cartLineId: "gid://shopify/CartLine/1",
            expandedCartItems: [
              {
                merchandiseId: "gid://shopify/ProductVariant/2",
                quantity: 2,
              },
              {
                merchandiseId: "gid://shopify/ProductVariant/3",
                quantity: 1,
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
            quantity: 2,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/1",
            },
            sellingPlanAllocation: null,
          },
        ],
      },
      cartTransform: {
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
            quantity: 2,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/1",
            },
            sellingPlanAllocation: null,
          },
        ],
      },
      cartTransform: {
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
            quantity: 2,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/1",
            },
            sellingPlanAllocation: null,
          },
          {
            id: "gid://shopify/CartLine/2",
            quantity: 2,
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/1",
            },
            sellingPlanAllocation: null,
          },
        ],
      },
      cartTransform: {
        config: {
          jsonValue: {
            enabled: true,
            parentVariant: "gid://shopify/ProductVariant/1",
            components: [
              {
                variantId: "gid://shopify/ProductVariant/2",
                quantity: 2,
              },
              {
                variantId: "gid://shopify/ProductVariant/3",
                quantity: 1,
              },
            ],
          },
        },
      },
    },
    expected: {
      operations: [
        {
          lineExpand: {
            cartLineId: "gid://shopify/CartLine/1",
            expandedCartItems: [
              {
                merchandiseId: "gid://shopify/ProductVariant/2",
                quantity: 2,
              },
              {
                merchandiseId: "gid://shopify/ProductVariant/3",
                quantity: 1,
              },
            ],
          },
        },
        {
          lineExpand: {
            cartLineId: "gid://shopify/CartLine/2",
            expandedCartItems: [
              {
                merchandiseId: "gid://shopify/ProductVariant/2",
                quantity: 2,
              },
              {
                merchandiseId: "gid://shopify/ProductVariant/3",
                quantity: 1,
              },
            ],
          },
        },
      ],
    },
  },
  {
    name: "recursive-component",
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
            sellingPlanAllocation: null,
          },
        ],
      },
      cartTransform: {
        config: {
          jsonValue: {
            enabled: true,
            parentVariant: "gid://shopify/ProductVariant/1",
            components: [
              {
                variantId: "gid://shopify/ProductVariant/1",
                quantity: 2,
              },
              {
                variantId: "gid://shopify/ProductVariant/3",
                quantity: 1,
              },
            ],
          },
        },
      },
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "subscription-skipped",
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
            sellingPlanAllocation: {
              sellingPlan: {
                id: "gid://shopify/SellingPlan/1",
              },
            },
          },
        ],
      },
      cartTransform: {
        config: {
          jsonValue: {
            enabled: true,
            parentVariant: "gid://shopify/ProductVariant/1",
            components: [
              {
                variantId: "gid://shopify/ProductVariant/2",
                quantity: 2,
              },
              {
                variantId: "gid://shopify/ProductVariant/3",
                quantity: 1,
              },
            ],
          },
        },
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
            sellingPlanAllocation: null,
          },
        ],
      },
      cartTransform: {
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
  {
    name: "zero-component-quantity",
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
            sellingPlanAllocation: null,
          },
        ],
      },
      cartTransform: {
        config: {
          jsonValue: {
            enabled: true,
            parentVariant: "gid://shopify/ProductVariant/1",
            components: [
              {
                variantId: "gid://shopify/ProductVariant/2",
                quantity: 0,
              },
              {
                variantId: "gid://shopify/ProductVariant/3",
                quantity: 1,
              },
            ],
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
  expect(cartTransformRun(test.input)).toEqual(test.expected),
);
