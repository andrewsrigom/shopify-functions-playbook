# Order Subtotal Discount

## Problem and behavior

Apply one fixed amount to the eligible order subtotal when the sum of eligible cart-line subtotals meets the configured threshold. Exclude configured variants and non-variant merchandise both from qualification and from the discount target. This scenario uses the unified discount API and the **ORDER** discount class.

The boundary is inclusive. A 100.00 threshold qualifies at 100.00, not 99.999999. A 10.00 discount on eligible subtotal 100.00 emits `orderDiscountsAdd` with `FIRST` selection strategy. The amount is capped at eligible subtotal. Empty or entirely excluded carts are a no-op.

## Prerequisites and restrictions

API **2026-04**, target `cart.lines.discounts.generate.run`. Local tooling: Node.js 24 and pnpm 10.32.0. Store execution requires a linked app, app-development permissions, and a suitable development store. Public apps with Functions support eligible plans; custom apps with Function APIs require Shopify Plus on production stores. Review [platform restrictions](../../docs/platform-restrictions.md) and the versioned API before selecting distribution. No network access target is used.

## Read the code

Read `config.example.json`, `src/cart_lines_discounts_generate_run.graphql`, `generated/input.ts`, `src/cart_lines_discounts_generate_run.ts`, then `fixtures/` and `tests/run.test.ts`. The implementation is exported by `src/index.ts`. Input queries select data supplied to the Function; they are not arbitrary Admin API calls. Generated files come from Shopify CLI type generation.

## Configuration

Owner: **DiscountAutomaticNode**, read as `discount.config`. App-owned namespace `$app`, key `config`, type `json`; the app TOML declares the definition. `config.schema.json` documents values, and runtime code validates unknown JSON. Checked-in examples use `enabled:false`. Missing, disabled, or malformed configuration emits `{"operations":[]}`.

Configure `currency`, `minimumSubtotal`, positive `amount`, and `excludedVariantIds` (up to 50). Values are decimal strings in the cart's presentment currency. Arithmetic uses six-decimal BigInt units; excess precision and mismatched eligible-line currencies produce no operation. No exchange conversion or binary floating-point rounding is performed. Shopify allocates and rounds the final discount; review combinations with other discounts in checkout.

The owner must have `discountClasses:["ORDER"]`. Fixtures explicitly reject an owner configured only for PRODUCT. The create example is future-dated for a one-hour window with all combinations and subscriptions disabled.

## Run and test

From repository root:

```bash
pnpm install --frozen-lockfile
pnpm typegen order-subtotal-discount
pnpm typecheck
pnpm test -- extensions/order-subtotal-discount/tests
pnpm build order-subtotal-discount
pnpm test:runtime order-subtotal-discount
```

Each `fixtures/*.input.json` has a matching complete expected output. Tests cover valid operation shape, absent and invalid configuration, empty carts, exact boundaries, and scenario-specific cases described above. These queries do not select customer identity; guests follow the same rules. `pnpm fixtures:check` checks query-shaped fixture fields; runtime checks execute the compiled Wasm.

## Owner activation and deactivation

Required scope: `write_discounts`. Follow [app setup and owner lifecycle](../../docs/activation.md) using app-context credentials. Copy operator variables to ignored `*.local.json` files, substitute the returned owner ID, and review the store before mutations.

Create with `operations/create-discount.graphql` and an ignored local copy of `create.variables.json`. The checked-in date is an inactive future test window: deliberately set a short current test window only after reviewing the store and configuration. Write `$app/config` on the returned DiscountAutomaticNode using `operations/configure.graphql`; set configuration `enabled:true` for the test. Deactivate with `operations/disable-discount.graphql` and the returned owner ID.

## Production adaptations

Test the complete checkout interaction with existing shipping rules, discounts, and transforms before enabling broadly. Configuration failures intentionally produce no operation. Keep localized titles, presentment currencies, and catalog GIDs consistent with the selected store. See [checkout safety](../../docs/security-and-cost.md).

## Official references

- [Versioned Function API](https://shopify.dev/docs/api/functions/2026-04/discount)
- [Function availability and workflow](https://shopify.dev/docs/apps/build/functions)
