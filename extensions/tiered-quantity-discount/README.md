# Tiered Quantity Discount

## Problem and demonstration

Apply the highest qualified quantity tier per variant.

Aggregate matching variants across lines. Tiers are selected by minimum quantity, not percentage. Thresholds must be distinct. Each eligible line gets its full quantity discounted. PRODUCT discount class is required.

## Prerequisites and restrictions

API **2026-04**, target `cart.lines.discounts.generate.run`. Local: Node.js 24 and pnpm 10.32.0. Live: app development permissions, an app linked with Shopify CLI, and a suitable development store. Public apps containing Functions can serve supported plans; custom apps containing Function APIs require Shopify Plus on production stores. Development-store capabilities must be checked before activation.

25 discount functions per store; they execute independently and combination settings determine stacking.

## Read the code

Read `config.example.json`, `src/cart_lines_discounts_generate_run.graphql`, `generated/input.ts`, `src/cart_lines_discounts_generate_run.ts`, then `fixtures/` and `tests/run.test.ts`. The implementation is the main entry point; `src/index.ts` exports it to the compiler. `generated/api.ts` contains schema output types. Input queries select Shopify-provided runtime data; they are not arbitrary Admin API requests.

## Inputs and expected outputs

Every `fixtures/*.input.json` has a matching complete `*.expected.json`. Inputs mirror the exact query shape, including union `__typename` and nullable fields. Missing or malformed configuration returns `{"operations":[]}`; disabled configuration does the same. The examples deliberately fail open on configuration errors; change that policy explicitly for requirements needing fail-closed enforcement.

## Run and test

From repository root:

```bash
pnpm install --frozen-lockfile
pnpm typegen tiered-quantity-discount
pnpm typecheck
pnpm test -- extensions/tiered-quantity-discount/tests
pnpm build tiered-quantity-discount
pnpm test:runtime tiered-quantity-discount
```

These commands compile and execute the actual Wasm with Shopify CLI. See [checks and coverage](../../docs/verification.md) for the full development workflow.

## Configuration and activation

Owner: **DiscountAutomaticNode**, queried as `discount.config`. Metafield namespace `$app`, key `config`, type `json`. The app TOML declares the definition before values are written. `config.schema.json` documents the JSON structure; the implementation performs runtime checks without adding runtime packages. Unknown properties are ignored.

1. Follow [app setup](../../docs/activation.md) and deploy definitions only when explicitly authorized.
2. Create the owner with `operations/create-discount.graphql` and this scenario's `create.variables.json`. The example uses a one-hour window in 2099; deliberately set both `startsAt` and `endsAt` to the intended short test session when creating or updating the discount.
3. Copy `configure.variables.json` to an ignored `configure.local.json` and insert the returned owner ID. Use the returned `discountId` (DiscountAutomaticNode), not the Function ID. The configuration starts with `enabled:false`.
4. Execute `operations/configure.graphql` with the local variables to write the inactive `$app` / `config` JSON metafield. After reviewing the configuration, deliberately change its JSON `enabled` to true and write it again for the test session. The input query reads these values at runtime.
5. The `startsAt` and `endsAt` schedule controls activation. Update both with `discountAutomaticAppUpdate` when ready. To deactivate, execute `operations/disable-discount.graphql` with `activation.variables.json` containing the real discount ID.

Required owner scope: `write_discounts`; read access accompanies write access. Use app-context credentials so `$app` resolves to the same app that owns the Function. Never execute these mutations from default CI.

## Failure behavior and edge cases

Empty carts produce no operations. Tests cover missing/null fields selected by this query, absent/disabled/malformed configuration, exact scenario boundaries, and multiple lines. Guest-specific behavior is tested where customer data is queried; scenarios that do not query customers behave identically for guests.

## Production adaptations and limitations

Aggregate matching variants across lines. Tiers are selected by minimum quantity, not percentage. Thresholds must be distinct. Each eligible line gets its full quantity discounted. PRODUCT discount class is required.

Money thresholds are decimal strings in the specified presentment currency. Comparisons use fixed six-decimal BigInt units (up to 15 whole digits), with no floating-point conversion or rounding; greater precision is rejected. Other currencies are a no-op, never silently USD. Percentages are whole integers from 1 to 100; Shopify allocates and rounds discount amounts, so checkout allocation must be verified in the store. No network targets or external integrations are required.

## Official references

- [Versioned Function API](https://shopify.dev/docs/api/functions/2026-04/discount)
- [Function availability](https://shopify.dev/docs/apps/build/functions)
- [Configuration and owner lifecycle](../../docs/activation.md)

See [security and cost controls](../../docs/security-and-cost.md) before selecting a store, enabling rules, or testing checkout.
