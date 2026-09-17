# Shopify Functions Playbook

Fourteen independently selectable TypeScript Functions with versioned input queries, generated types, validated configuration, realistic fixtures, unit tests, and compiled WebAssembly runtime checks. One minimal extension-only app keeps installation simple; each Function has its own owner and activation lifecycle.

## Quick start

```bash
pnpm install --frozen-lockfile
pnpm typegen minimum-subtotal
pnpm test -- extensions/minimum-subtotal/tests
pnpm build minimum-subtotal
pnpm test:runtime minimum-subtotal
```

Node.js 24 and pnpm 10.32.0 are required. CLI 4.8.0 and the Function JavaScript runtime library 2.0.1 are pinned. API version is **2026-04**, checked on 2026-09-16. `pnpm check` verifies the whole repository. The first build downloads Shopify’s local compiler/runtime tools. Unit tests need no store, network, or credentials after install.

## Scenario catalog and decision guide

| Scenario                                                                  | Choose it to…                                                                        | Configuration owner   |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------- |
| [minimum-subtotal](extensions/minimum-subtotal)                           | Block checkout below a configured subtotal.                                          | Validation            |
| [maximum-variant-quantity](extensions/maximum-variant-quantity)           | Limit each product variant across all cart lines.                                    | Validation            |
| [incompatible-products](extensions/incompatible-products)                 | Prevent two configured products from being bought together.                          | Validation            |
| [first-order-limit](extensions/first-order-limit)                         | Limit subtotal for buyers without a completed order history.                         | Validation            |
| [tiered-quantity-discount](extensions/tiered-quantity-discount)           | Apply the highest qualified quantity tier per variant.                               | DiscountAutomaticNode |
| [vip-discount](extensions/vip-discount)                                   | Discount existing cart lines for a customer already tagged as VIP in Shopify.        | DiscountAutomaticNode |
| [buy-x-get-y](extensions/buy-x-get-y)                                     | Reward existing Y units for each complete group of X units.                          | DiscountAutomaticNode |
| [conditional-shipping-discount](extensions/conditional-shipping-discount) | Discount a named delivery option when the cart reaches a currency-specific subtotal. | DiscountAutomaticNode |
| [payment-customization](extensions/payment-customization)                 | Hide a named payment method above a configured order total.                          | PaymentCustomization  |
| [delivery-customization](extensions/delivery-customization)               | Rename an existing delivery option to clarify its service.                           | DeliveryCustomization |
| [fixed-bundle](extensions/fixed-bundle)                                   | Expand a configured parent variant into a fixed set of component variants.           | CartTransform         |
| [conditional-delivery](extensions/conditional-delivery)                   | Hide and prioritize delivery options per shipment, preserving an available option.   | DeliveryCustomization |
| [order-subtotal-discount](extensions/order-subtotal-discount)             | Discount an eligible order subtotal while excluding configured variants.             | DiscountAutomaticNode |
| [mix-and-match-bundle](extensions/mix-and-match-bundle)                   | Assemble a fixed recipe from existing component cart lines with linesMerge.          | CartTransform         |

## Development checks

Run `pnpm check` for formatting, lint, generated types, strict TypeScript, unit tests, query-shaped fixtures, Wasm builds, and complete compiled-runtime output comparisons. Select one extension with commands such as `pnpm test:runtime minimum-subtotal`. See [checks and coverage](docs/verification.md).

## Further reading

- [Security, checkout safety, and cost controls](docs/security-and-cost.md)
- [App setup, scopes, activation, and deactivation](docs/activation.md)
- [Plan, coexistence, and network restrictions](docs/platform-restrictions.md)
- [Schema provenance](vendor/README.md)
- [Engineering rules](AGENTS.md)

## License

[MIT](LICENSE.md) — Copyright 2026 Andrews Rigom. Original Shopify copyright notices are preserved; see [template provenance](docs/template-provenance.md).
