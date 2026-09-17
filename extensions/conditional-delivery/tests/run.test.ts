import { it, expect } from "vitest";
import { cartDeliveryOptionsTransformRun } from "../src/cart_delivery_options_transform_run";
import type { CartDeliveryOptionsTransformRunInput } from "../generated/input";
import { CountryCode } from "../generated/api";

it("eligible", () => {
  const input: CartDeliveryOptionsTransformRunInput = {
    cart: {
      deliveryGroups: [
        {
          cartLines: [
            {
              merchandise: {
                __typename: "ProductVariant",
                id: "gid://shopify/ProductVariant/2",
              },
            },
          ],
          deliveryAddress: {
            countryCode: CountryCode.Us,
          },
          deliveryOptions: [
            {
              handle: "express",
              title: "Express",
            },
            {
              handle: "pickup",
              title: "Pickup",
            },
            {
              handle: "standard",
              title: "Standard",
            },
          ],
        },
      ],
    },
    deliveryCustomization: {
      config: {
        jsonValue: {
          enabled: true,
          hideTitle: "Express",
          restrictedVariantIds: ["gid://shopify/ProductVariant/2"],
          blockedCountries: ["BR"],
          preferredTitle: "Standard",
        },
      },
    },
  };

  expect(cartDeliveryOptionsTransformRun(input)).toEqual({
    operations: [
      { deliveryOptionHide: { deliveryOptionHandle: "express" } },
      { deliveryOptionMove: { deliveryOptionHandle: "standard", index: 0 } },
    ],
  });
});

it("unrestricted-product", () => {
  const input: CartDeliveryOptionsTransformRunInput = {
    cart: {
      deliveryGroups: [
        {
          cartLines: [
            {
              merchandise: {
                __typename: "ProductVariant",
                id: "gid://shopify/ProductVariant/4",
              },
            },
          ],
          deliveryAddress: {
            countryCode: CountryCode.Us,
          },
          deliveryOptions: [
            {
              handle: "express",
              title: "Express",
            },
            {
              handle: "pickup",
              title: "Pickup",
            },
            {
              handle: "standard",
              title: "Standard",
            },
          ],
        },
      ],
    },
    deliveryCustomization: {
      config: {
        jsonValue: {
          enabled: true,
          hideTitle: "Express",
          restrictedVariantIds: ["gid://shopify/ProductVariant/2"],
          blockedCountries: ["BR"],
          preferredTitle: "Standard",
        },
      },
    },
  };

  expect(cartDeliveryOptionsTransformRun(input)).toEqual({
    operations: [
      { deliveryOptionMove: { deliveryOptionHandle: "standard", index: 0 } },
    ],
  });
});

it("country-match", () => {
  const input: CartDeliveryOptionsTransformRunInput = {
    cart: {
      deliveryGroups: [
        {
          cartLines: [
            {
              merchandise: {
                __typename: "ProductVariant",
                id: "gid://shopify/ProductVariant/4",
              },
            },
          ],
          deliveryAddress: {
            countryCode: CountryCode.Br,
          },
          deliveryOptions: [
            {
              handle: "express",
              title: "Express",
            },
            {
              handle: "pickup",
              title: "Pickup",
            },
            {
              handle: "standard",
              title: "Standard",
            },
          ],
        },
      ],
    },
    deliveryCustomization: {
      config: {
        jsonValue: {
          enabled: true,
          hideTitle: "Express",
          restrictedVariantIds: ["gid://shopify/ProductVariant/2"],
          blockedCountries: ["BR"],
          preferredTitle: "Standard",
        },
      },
    },
  };

  expect(cartDeliveryOptionsTransformRun(input)).toEqual({
    operations: [
      { deliveryOptionHide: { deliveryOptionHandle: "express" } },
      { deliveryOptionMove: { deliveryOptionHandle: "standard", index: 0 } },
    ],
  });
});

it("missing-address", () => {
  const input: CartDeliveryOptionsTransformRunInput = {
    cart: {
      deliveryGroups: [
        {
          cartLines: [
            {
              merchandise: {
                __typename: "ProductVariant",
                id: "gid://shopify/ProductVariant/2",
              },
            },
          ],
          deliveryAddress: null,
          deliveryOptions: [
            {
              handle: "express",
              title: "Express",
            },
            {
              handle: "pickup",
              title: "Pickup",
            },
            {
              handle: "standard",
              title: "Standard",
            },
          ],
        },
      ],
    },
    deliveryCustomization: {
      config: {
        jsonValue: {
          enabled: true,
          hideTitle: "Express",
          restrictedVariantIds: ["gid://shopify/ProductVariant/2"],
          blockedCountries: ["BR"],
          preferredTitle: "Standard",
        },
      },
    },
  };

  expect(cartDeliveryOptionsTransformRun(input)).toEqual({
    operations: [
      { deliveryOptionHide: { deliveryOptionHandle: "express" } },
      { deliveryOptionMove: { deliveryOptionHandle: "standard", index: 0 } },
    ],
  });
});

it("only-option", () => {
  const input: CartDeliveryOptionsTransformRunInput = {
    cart: {
      deliveryGroups: [
        {
          cartLines: [
            {
              merchandise: {
                __typename: "ProductVariant",
                id: "gid://shopify/ProductVariant/2",
              },
            },
          ],
          deliveryAddress: {
            countryCode: CountryCode.Us,
          },
          deliveryOptions: [
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
          hideTitle: "Express",
          restrictedVariantIds: ["gid://shopify/ProductVariant/2"],
          blockedCountries: ["BR"],
          preferredTitle: "Standard",
        },
      },
    },
  };

  expect(cartDeliveryOptionsTransformRun(input)).toEqual({ operations: [] });
});

it("empty-cart", () => {
  const input: CartDeliveryOptionsTransformRunInput = {
    cart: {
      deliveryGroups: [],
    },
    deliveryCustomization: {
      config: {
        jsonValue: {
          enabled: true,
          hideTitle: "Express",
          restrictedVariantIds: ["gid://shopify/ProductVariant/2"],
          blockedCountries: ["BR"],
          preferredTitle: "Standard",
        },
      },
    },
  };

  expect(cartDeliveryOptionsTransformRun(input)).toEqual({ operations: [] });
});

it("empty-group", () => {
  const input: CartDeliveryOptionsTransformRunInput = {
    cart: {
      deliveryGroups: [
        {
          cartLines: [],
          deliveryAddress: {
            countryCode: CountryCode.Us,
          },
          deliveryOptions: [
            {
              handle: "express",
              title: "Express",
            },
            {
              handle: "pickup",
              title: "Pickup",
            },
            {
              handle: "standard",
              title: "Standard",
            },
          ],
        },
      ],
    },
    deliveryCustomization: {
      config: {
        jsonValue: {
          enabled: true,
          hideTitle: "Express",
          restrictedVariantIds: ["gid://shopify/ProductVariant/2"],
          blockedCountries: ["BR"],
          preferredTitle: "Standard",
        },
      },
    },
  };

  expect(cartDeliveryOptionsTransformRun(input)).toEqual({ operations: [] });
});

it("invalid-country", () => {
  const input: CartDeliveryOptionsTransformRunInput = {
    cart: {
      deliveryGroups: [
        {
          cartLines: [
            {
              merchandise: {
                __typename: "ProductVariant",
                id: "gid://shopify/ProductVariant/2",
              },
            },
          ],
          deliveryAddress: {
            countryCode: CountryCode.Us,
          },
          deliveryOptions: [
            {
              handle: "express",
              title: "Express",
            },
            {
              handle: "pickup",
              title: "Pickup",
            },
            {
              handle: "standard",
              title: "Standard",
            },
          ],
        },
      ],
    },
    deliveryCustomization: {
      config: {
        jsonValue: {
          enabled: true,
          hideTitle: "Express",
          restrictedVariantIds: ["gid://shopify/ProductVariant/2"],
          blockedCountries: [12],
          preferredTitle: "Standard",
        },
      },
    },
  };

  expect(cartDeliveryOptionsTransformRun(input)).toEqual({ operations: [] });
});

it("multiple-groups", () => {
  const input: CartDeliveryOptionsTransformRunInput = {
    cart: {
      deliveryGroups: [
        {
          cartLines: [
            {
              merchandise: {
                __typename: "ProductVariant",
                id: "gid://shopify/ProductVariant/2",
              },
            },
          ],
          deliveryAddress: {
            countryCode: CountryCode.Us,
          },
          deliveryOptions: [
            {
              handle: "express",
              title: "Express",
            },
            {
              handle: "pickup",
              title: "Pickup",
            },
            {
              handle: "standard",
              title: "Standard",
            },
          ],
        },
        {
          cartLines: [
            {
              merchandise: {
                __typename: "ProductVariant",
                id: "gid://shopify/ProductVariant/4",
              },
            },
          ],
          deliveryAddress: null,
          deliveryOptions: [
            {
              handle: "other",
              title: "Standard",
            },
          ],
        },
      ],
    },
    deliveryCustomization: {
      config: {
        jsonValue: {
          enabled: true,
          hideTitle: "Express",
          restrictedVariantIds: ["gid://shopify/ProductVariant/2"],
          blockedCountries: ["BR"],
          preferredTitle: "Standard",
        },
      },
    },
  };

  expect(cartDeliveryOptionsTransformRun(input)).toEqual({
    operations: [
      { deliveryOptionHide: { deliveryOptionHandle: "express" } },
      { deliveryOptionMove: { deliveryOptionHandle: "standard", index: 0 } },
    ],
  });
});

it("missing-configuration", () => {
  const input: CartDeliveryOptionsTransformRunInput = {
    cart: {
      deliveryGroups: [
        {
          cartLines: [
            {
              merchandise: {
                __typename: "ProductVariant",
                id: "gid://shopify/ProductVariant/2",
              },
            },
          ],
          deliveryAddress: {
            countryCode: CountryCode.Us,
          },
          deliveryOptions: [
            {
              handle: "express",
              title: "Express",
            },
            {
              handle: "pickup",
              title: "Pickup",
            },
            {
              handle: "standard",
              title: "Standard",
            },
          ],
        },
      ],
    },
    deliveryCustomization: {
      config: null,
    },
  };

  expect(cartDeliveryOptionsTransformRun(input)).toEqual({ operations: [] });
});

it("disabled-configuration", () => {
  const input: CartDeliveryOptionsTransformRunInput = {
    cart: {
      deliveryGroups: [
        {
          cartLines: [
            {
              merchandise: {
                __typename: "ProductVariant",
                id: "gid://shopify/ProductVariant/2",
              },
            },
          ],
          deliveryAddress: {
            countryCode: CountryCode.Us,
          },
          deliveryOptions: [
            {
              handle: "express",
              title: "Express",
            },
            {
              handle: "pickup",
              title: "Pickup",
            },
            {
              handle: "standard",
              title: "Standard",
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
  };

  expect(cartDeliveryOptionsTransformRun(input)).toEqual({ operations: [] });
});

it("malformed-configuration", () => {
  const input: CartDeliveryOptionsTransformRunInput = {
    cart: {
      deliveryGroups: [
        {
          cartLines: [
            {
              merchandise: {
                __typename: "ProductVariant",
                id: "gid://shopify/ProductVariant/2",
              },
            },
          ],
          deliveryAddress: {
            countryCode: CountryCode.Us,
          },
          deliveryOptions: [
            {
              handle: "express",
              title: "Express",
            },
            {
              handle: "pickup",
              title: "Pickup",
            },
            {
              handle: "standard",
              title: "Standard",
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
  };

  expect(cartDeliveryOptionsTransformRun(input)).toEqual({ operations: [] });
});

it("invalid-json-configuration", () => {
  const input: CartDeliveryOptionsTransformRunInput = {
    cart: {
      deliveryGroups: [
        {
          cartLines: [
            {
              merchandise: {
                __typename: "ProductVariant",
                id: "gid://shopify/ProductVariant/2",
              },
            },
          ],
          deliveryAddress: {
            countryCode: CountryCode.Us,
          },
          deliveryOptions: [
            {
              handle: "express",
              title: "Express",
            },
            {
              handle: "pickup",
              title: "Pickup",
            },
            {
              handle: "standard",
              title: "Standard",
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
  };

  expect(cartDeliveryOptionsTransformRun(input)).toEqual({ operations: [] });
});

it("scalar-configuration", () => {
  const input: CartDeliveryOptionsTransformRunInput = {
    cart: {
      deliveryGroups: [
        {
          cartLines: [
            {
              merchandise: {
                __typename: "ProductVariant",
                id: "gid://shopify/ProductVariant/2",
              },
            },
          ],
          deliveryAddress: {
            countryCode: CountryCode.Us,
          },
          deliveryOptions: [
            {
              handle: "express",
              title: "Express",
            },
            {
              handle: "pickup",
              title: "Pickup",
            },
            {
              handle: "standard",
              title: "Standard",
            },
          ],
        },
      ],
    },
    deliveryCustomization: {
      config: {
        jsonValue: 42,
      },
    },
  };

  expect(cartDeliveryOptionsTransformRun(input)).toEqual({ operations: [] });
});
