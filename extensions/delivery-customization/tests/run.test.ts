import { it, expect } from "vitest";
import type { CartDeliveryOptionsTransformRunInput } from "../generated/input";
import { cartDeliveryOptionsTransformRun } from "../src/cart_delivery_options_transform_run";

const cases: {
  name: string;
  input: CartDeliveryOptionsTransformRunInput;
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
      deliveryCustomization: {
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
      deliveryCustomization: {
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
      deliveryCustomization: {
        config: {
          jsonValue: {
            enabled: true,
            optionTitle: "Standard",
            replacementTitle: "Standard tracked delivery",
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
      deliveryCustomization: {
        config: {
          jsonValue: {
            enabled: true,
            optionTitle: "Standard",
            replacementTitle: "Standard tracked delivery",
          },
        },
      },
    },
    expected: {
      operations: [
        {
          deliveryOptionRename: {
            deliveryOptionHandle: "standard",
            title: "Standard tracked delivery",
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
      deliveryCustomization: {
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
      deliveryCustomization: {
        config: null,
      },
    },
    expected: {
      operations: [],
    },
  },
  {
    name: "missing-options",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
          },
        ],
        deliveryGroups: [
          {
            deliveryOptions: [],
          },
        ],
      },
      deliveryCustomization: {
        config: {
          jsonValue: {
            enabled: true,
            optionTitle: "Standard",
            replacementTitle: "Standard tracked delivery",
          },
        },
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
      deliveryCustomization: {
        config: {
          jsonValue: {
            enabled: true,
            optionTitle: "Standard",
            replacementTitle: "Standard tracked delivery",
          },
        },
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
      deliveryCustomization: {
        config: {
          jsonValue: {
            enabled: true,
            optionTitle: "Standard",
            replacementTitle: "Standard tracked delivery",
          },
        },
      },
    },
    expected: {
      operations: [
        {
          deliveryOptionRename: {
            deliveryOptionHandle: "standard",
            title: "Standard tracked delivery",
          },
        },
      ],
    },
  },
  {
    name: "title-too-long",
    input: {
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1",
          },
        ],
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
      deliveryCustomization: {
        config: {
          jsonValue: {
            enabled: true,
            optionTitle: "Standard",
            replacementTitle:
              "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
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
          },
        ],
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
      deliveryCustomization: {
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
  expect(cartDeliveryOptionsTransformRun(test.input)).toEqual(test.expected),
);
