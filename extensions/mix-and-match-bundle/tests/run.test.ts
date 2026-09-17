import { it, expect } from "vitest";
import { cartTransformRun } from "../src/cart_transform_run";
import type { CartTransformRunInput } from "../generated/input";

it("eligible", () => {
  const input: CartTransformRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          quantity: 2,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
        },
        {
          id: "gid://shopify/CartLine/2",
          quantity: 1,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/3",
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
  };

  expect(cartTransformRun(input)).toEqual({
    operations: [
      {
        linesMerge: {
          parentVariantId: "gid://shopify/ProductVariant/1",
          cartLines: [
            { cartLineId: "gid://shopify/CartLine/1", quantity: 2 },
            { cartLineId: "gid://shopify/CartLine/2", quantity: 1 },
          ],
        },
      },
    ],
  });
});

it("missing-component", () => {
  const input: CartTransformRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          quantity: 2,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
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
  };

  expect(cartTransformRun(input)).toEqual({ operations: [] });
});

it("insufficient-quantity", () => {
  const input: CartTransformRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          quantity: 1,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
        },
        {
          id: "gid://shopify/CartLine/2",
          quantity: 1,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/3",
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
  };

  expect(cartTransformRun(input)).toEqual({ operations: [] });
});

it("leftover-quantity", () => {
  const input: CartTransformRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          quantity: 5,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
        },
        {
          id: "gid://shopify/CartLine/2",
          quantity: 1,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/3",
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
  };

  expect(cartTransformRun(input)).toEqual({
    operations: [
      {
        linesMerge: {
          parentVariantId: "gid://shopify/ProductVariant/1",
          cartLines: [
            { cartLineId: "gid://shopify/CartLine/1", quantity: 2 },
            { cartLineId: "gid://shopify/CartLine/2", quantity: 1 },
          ],
        },
      },
    ],
  });
});

it("split-component", () => {
  const input: CartTransformRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          quantity: 1,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
        },
        {
          id: "gid://shopify/CartLine/2",
          quantity: 1,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/3",
          },
        },
        {
          id: "gid://shopify/CartLine/3",
          quantity: 1,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
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
  };

  expect(cartTransformRun(input)).toEqual({
    operations: [
      {
        linesMerge: {
          parentVariantId: "gid://shopify/ProductVariant/1",
          cartLines: [
            { cartLineId: "gid://shopify/CartLine/1", quantity: 1 },
            { cartLineId: "gid://shopify/CartLine/3", quantity: 1 },
            { cartLineId: "gid://shopify/CartLine/2", quantity: 1 },
          ],
        },
      },
    ],
  });
});

it("selling-plan", () => {
  const input: CartTransformRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          quantity: 2,
          sellingPlanAllocation: {
            sellingPlan: {
              id: "gid://shopify/SellingPlan/1",
            },
          },
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
        },
        {
          id: "gid://shopify/CartLine/2",
          quantity: 1,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/3",
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
  };

  expect(cartTransformRun(input)).toEqual({ operations: [] });
});

it("duplicate-component", () => {
  const input: CartTransformRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          quantity: 2,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
        },
        {
          id: "gid://shopify/CartLine/2",
          quantity: 1,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/3",
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
              variantId: "gid://shopify/ProductVariant/2",
              quantity: 2,
            },
          ],
        },
      },
    },
  };

  expect(cartTransformRun(input)).toEqual({ operations: [] });
});

it("recursive-parent", () => {
  const input: CartTransformRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          quantity: 2,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
        },
        {
          id: "gid://shopify/CartLine/2",
          quantity: 1,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/3",
          },
        },
      ],
    },
    cartTransform: {
      config: {
        jsonValue: {
          enabled: true,
          parentVariant: "gid://shopify/ProductVariant/2",
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
  };

  expect(cartTransformRun(input)).toEqual({ operations: [] });
});

it("empty-cart", () => {
  const input: CartTransformRunInput = {
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
  };

  expect(cartTransformRun(input)).toEqual({ operations: [] });
});

it("invalid-quantity", () => {
  const input: CartTransformRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          quantity: 2,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
        },
        {
          id: "gid://shopify/CartLine/2",
          quantity: 1,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/3",
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
  };

  expect(cartTransformRun(input)).toEqual({ operations: [] });
});

it("missing-configuration", () => {
  const input: CartTransformRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          quantity: 2,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
        },
        {
          id: "gid://shopify/CartLine/2",
          quantity: 1,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/3",
          },
        },
      ],
    },
    cartTransform: {
      config: null,
    },
  };

  expect(cartTransformRun(input)).toEqual({ operations: [] });
});

it("disabled-configuration", () => {
  const input: CartTransformRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          quantity: 2,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
        },
        {
          id: "gid://shopify/CartLine/2",
          quantity: 1,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/3",
          },
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
  };

  expect(cartTransformRun(input)).toEqual({ operations: [] });
});

it("malformed-configuration", () => {
  const input: CartTransformRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          quantity: 2,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
        },
        {
          id: "gid://shopify/CartLine/2",
          quantity: 1,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/3",
          },
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
  };

  expect(cartTransformRun(input)).toEqual({ operations: [] });
});

it("invalid-json-configuration", () => {
  const input: CartTransformRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          quantity: 2,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
        },
        {
          id: "gid://shopify/CartLine/2",
          quantity: 1,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/3",
          },
        },
      ],
    },
    cartTransform: {
      config: {
        jsonValue: [],
      },
    },
  };

  expect(cartTransformRun(input)).toEqual({ operations: [] });
});

it("scalar-configuration", () => {
  const input: CartTransformRunInput = {
    cart: {
      lines: [
        {
          id: "gid://shopify/CartLine/1",
          quantity: 2,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/2",
          },
        },
        {
          id: "gid://shopify/CartLine/2",
          quantity: 1,
          sellingPlanAllocation: null,
          merchandise: {
            __typename: "ProductVariant",
            id: "gid://shopify/ProductVariant/3",
          },
        },
      ],
    },
    cartTransform: {
      config: {
        jsonValue: 42,
      },
    },
  };

  expect(cartTransformRun(input)).toEqual({ operations: [] });
});
