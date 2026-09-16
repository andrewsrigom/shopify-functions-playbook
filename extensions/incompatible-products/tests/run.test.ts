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
            merchandise: {
              __typename: "ProductVariant",
              product: {
                id: "gid://shopify/Product/1",
              },
            },
          },
          {
            id: "gid://shopify/CartLine/2",
            merchandise: {
              __typename: "ProductVariant",
              product: {
                id: "gid://shopify/Product/2",
              },
            },
          },
        ],
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
            merchandise: {
              __typename: "ProductVariant",
              product: {
                id: "gid://shopify/Product/1",
              },
            },
          },
          {
            id: "gid://shopify/CartLine/2",
            merchandise: {
              __typename: "ProductVariant",
              product: {
                id: "gid://shopify/Product/2",
              },
            },
          },
        ],
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
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
            firstProduct: "gid://shopify/Product/1",
            secondProduct: "gid://shopify/Product/2",
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
            merchandise: {
              __typename: "ProductVariant",
              product: {
                id: "gid://shopify/Product/1",
              },
            },
          },
          {
            id: "gid://shopify/CartLine/2",
            merchandise: {
              __typename: "ProductVariant",
              product: {
                id: "gid://shopify/Product/2",
              },
            },
          },
        ],
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
            firstProduct: "gid://shopify/Product/1",
            secondProduct: "gid://shopify/Product/2",
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
                message: "These products cannot be purchased together.",
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
            merchandise: {
              __typename: "ProductVariant",
              product: {
                id: "gid://shopify/Product/1",
              },
            },
          },
          {
            id: "gid://shopify/CartLine/2",
            merchandise: {
              __typename: "ProductVariant",
              product: {
                id: "gid://shopify/Product/2",
              },
            },
          },
        ],
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
            merchandise: {
              __typename: "ProductVariant",
              product: {
                id: "gid://shopify/Product/1",
              },
            },
          },
          {
            id: "gid://shopify/CartLine/2",
            merchandise: {
              __typename: "ProductVariant",
              product: {
                id: "gid://shopify/Product/2",
              },
            },
          },
        ],
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
    name: "one-product",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            merchandise: {
              __typename: "ProductVariant",
              product: {
                id: "gid://shopify/Product/1",
              },
            },
          },
        ],
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
            firstProduct: "gid://shopify/Product/1",
            secondProduct: "gid://shopify/Product/2",
          },
        },
      },
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "same-configured-product",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
            merchandise: {
              __typename: "ProductVariant",
              product: {
                id: "gid://shopify/Product/1",
              },
            },
          },
          {
            id: "gid://shopify/CartLine/2",
            merchandise: {
              __typename: "ProductVariant",
              product: {
                id: "gid://shopify/Product/2",
              },
            },
          },
        ],
      },
      validation: {
        config: {
          jsonValue: {
            enabled: true,
            firstProduct: "gid://shopify/Product/1",
            secondProduct: "gid://shopify/Product/1",
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
            merchandise: {
              __typename: "ProductVariant",
              product: {
                id: "gid://shopify/Product/1",
              },
            },
          },
          {
            id: "gid://shopify/CartLine/2",
            merchandise: {
              __typename: "ProductVariant",
              product: {
                id: "gid://shopify/Product/2",
              },
            },
          },
        ],
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
