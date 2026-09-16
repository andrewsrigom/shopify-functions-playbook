# Payment Customization

## Problem and demonstration

Hide a named payment method above a configured order total.

Uses totalAmount, not subtotalAmount. Exact maximum remains allowed. Missing methods produce no operation. Method names are store-specific. The example does not set payment terms or target specific accelerated placements.

## Prerequisites and restrictions

API **2026-04**, target `cart.payment-methods.transform.run`. Local: Node.js 24 and pnpm 10.32.0. Live: app development permissions, an app linked with Shopify CLI, and a suitable development store. Public apps containing Functions can serve supported plans; custom apps containing Function APIs require Shopify Plus on production stores. Development-store capabilities must be checked before activation.

25 payment customization functions per store. Payment-method capabilities depend on plan, market, checkout surface, and method; verify the returned method and effect in the target store.

## Read the code

Read `config.example.json`, `src/cart_payment_methods_transform_run.graphql`, `generated/input.ts`, `src/cart_payment_methods_transform_run.ts`, then `fixtures/` and `tests/run.test.ts`. The implementation is the main entry point; `src/index.ts` exports it to the compiler. `generated/api.ts` contains schema output types. Input queries select Shopify-provided runtime data; they are not arbitrary Admin API requests.

## Inputs and expected outputs

Every `fixtures/*.input.json` has a matching complete `*.expected.json`. Inputs mirror the exact query shape, including union `__typename` and nullable fields. Missing or malformed configuration returns `{"operations":[]}`; disabled configuration does the same. The examples deliberately fail open on configuration errors; change that policy explicitly for requirements needing fail-closed enforcement.

## Run and test

From repository root:

```bash
pnpm install --frozen-lockfile
pnpm typegen payment-customization
pnpm typecheck
pnpm test -- extensions/payment-customization/tests
pnpm build payment-customization
pnpm test:runtime payment-customization
```

These commands compile and execute the actual Wasm with Shopify CLI. See [checks and coverage](../../docs/verification.md) for the full development workflow.

## Configuration and activation

Owner: **PaymentCustomization**, queried as `paymentCustomization.config`. Metafield namespace `$app`, key `config`, type `json`. The app TOML declares the definition before values are written. `config.schema.json` documents the JSON structure; the implementation performs runtime checks without adding runtime packages. Unknown properties are ignored.

1. Follow [app setup](../../docs/activation.md) and deploy definitions only when explicitly authorized.
2. Create the owner with `operations/create-payment.graphql` and this scenario's `create.variables.json`. The example creates a disabled owner so configuration can be reviewed before activation.
3. Copy the returned owner ID into `configure.variables.json`. Use the returned owner ID, not the Function ID.
4. Execute `operations/configure.graphql` with those variables to write the `$app` / `config` JSON metafield. The input query reads these values at runtime.
5. Execute `operations/enable-payment.graphql` with `activation.variables.json`. Replace its sample owner ID and set `enabled` to true to activate or false to deactivate.

Required owner scope: `write_payment_customizations`; read access accompanies write access. Use app-context credentials so `$app` resolves to the same app that owns the Function. Never execute these mutations from default CI.

## Failure behavior and edge cases

Empty carts produce no operations. Tests cover missing/null fields selected by this query, absent/disabled/malformed configuration, exact scenario boundaries, and multiple lines. Guest-specific behavior is tested where customer data is queried; scenarios that do not query customers behave identically for guests.

## Production adaptations and limitations

Uses totalAmount, not subtotalAmount. Exact maximum remains allowed. Missing methods produce no operation. Method names are store-specific. The example does not set payment terms or target specific accelerated placements.

Money thresholds are decimal strings in the specified presentment currency. Comparisons use fixed six-decimal BigInt units (up to 15 whole digits), with no floating-point conversion or rounding; greater precision is rejected. Other currencies are a no-op, never silently USD. Percentages are whole integers from 1 to 100; Shopify allocates and rounds discount amounts, so checkout allocation must be verified in the store. No network targets or external integrations are required.

## Official references

- [Versioned Function API](https://shopify.dev/docs/api/functions/2026-04/payment-customization)
- [Function availability](https://shopify.dev/docs/apps/build/functions)
- [Configuration and owner lifecycle](../../docs/activation.md)
