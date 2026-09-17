# Fixed Bundle

## Problem and demonstration

Expand a configured parent variant into a fixed set of component variants.

Components contain variant IDs and quantities per bundle. No custom pricing is emitted; Shopify handles bundle pricing allocation. Recursive parents, duplicate components, invalid quantities, and selling plans on the parent are rejected/skipped. Existing catalog variants and inventory must be configured in a development store.

## Prerequisites and restrictions

API **2026-04**, target `cart.transform.run`. Local: Node.js 24 and pnpm 10.32.0. Live: app development permissions, an app linked with Shopify CLI, and a suitable development store. Public apps containing Functions can serve supported plans; custom apps containing Function APIs require Shopify Plus on production stores. Development-store capabilities must be checked before activation.

Maximum one cart transform Function per app on a store, according to the versioned reference checked. Other apps may also transform lines. Deactivate the previous transform from this app before creating another; inspect cross-app conflicts. lineUpdate has separate Plus/development-store restrictions and is not used here.

## Read the code

Read `config.example.json`, `src/cart_transform_run.graphql`, `generated/input.ts`, `src/cart_transform_run.ts`, then `fixtures/` and `tests/run.test.ts`. The implementation is the main entry point; `src/index.ts` exports it to the compiler. `generated/api.ts` contains schema output types. Input queries select Shopify-provided runtime data; they are not arbitrary Admin API requests.

## Inputs and expected outputs

Every `fixtures/*.input.json` has a matching complete `*.expected.json`. Inputs mirror the exact query shape, including union `__typename` and nullable fields. Missing or malformed configuration returns `{"operations":[]}`; disabled configuration does the same. The examples deliberately fail open on configuration errors; change that policy explicitly for requirements needing fail-closed enforcement.

## Run and test

From repository root:

```bash
pnpm install --frozen-lockfile
pnpm typegen fixed-bundle
pnpm typecheck
pnpm test -- extensions/fixed-bundle/tests
pnpm build fixed-bundle
pnpm test:runtime fixed-bundle
```

These commands compile and execute the actual Wasm with Shopify CLI. See [checks and coverage](../../docs/verification.md) for the full development workflow.

## Configuration and activation

Owner: **CartTransform**, queried as `cartTransform.config`. Metafield namespace `$app`, key `config`, type `json`. The app TOML declares the definition before values are written. `config.schema.json` documents the JSON structure; the implementation performs runtime checks without adding runtime packages. Unknown properties are ignored.

1. Follow [app setup](../../docs/activation.md) and deploy definitions only when explicitly authorized.
2. Create the owner with `operations/create-transform.graphql` and this scenario's `create.variables.json`. The owner is registered immediately; this Function returns no operations until enabled configuration is written.
3. Copy `configure.variables.json` to an ignored `configure.local.json` and insert the returned owner ID. Use the returned CartTransform owner ID, not the Function ID. The configuration starts with `enabled:false`.
4. Execute `operations/configure.graphql` with the local variables to write the inactive `$app` / `config` JSON metafield. After reviewing the configuration, deliberately change its JSON `enabled` to true and write it again for the test session. The input query reads these values at runtime.
5. Set `enabled` to true in the configuration to expand eligible bundle lines, or false to stop expansion. To remove the owner, execute `operations/delete-transform.graphql` with `activation.variables.json`. A deleted owner ID cannot be reused.

Required owner scope: `write_cart_transforms`; read access accompanies write access. Use app-context credentials so `$app` resolves to the same app that owns the Function. Never execute these mutations from default CI.

## Failure behavior and edge cases

Empty carts produce no operations. Tests cover missing/null fields selected by this query, absent/disabled/malformed configuration, exact scenario boundaries, and multiple lines. Guest-specific behavior is tested where customer data is queried; scenarios that do not query customers behave identically for guests.

## Production adaptations and limitations

Components contain variant IDs and quantities per bundle. No custom pricing is emitted; Shopify handles bundle pricing allocation. Recursive parents, duplicate components, invalid quantities, and selling plans on the parent are rejected/skipped. Existing catalog variants and inventory must be configured in a development store.

Money thresholds are decimal strings in the specified presentment currency. Comparisons use fixed six-decimal BigInt units (up to 15 whole digits), with no floating-point conversion or rounding; greater precision is rejected. Other currencies are a no-op, never silently USD. Percentages are whole integers from 1 to 100; Shopify allocates and rounds discount amounts, so checkout allocation must be verified in the store. No network targets or external integrations are required.

## Official references

- [Versioned Function API](https://shopify.dev/docs/api/functions/2026-04/cart-transform)
- [Function availability](https://shopify.dev/docs/apps/build/functions)
- [Configuration and owner lifecycle](../../docs/activation.md)

See [security and cost controls](../../docs/security-and-cost.md) before selecting a store, enabling rules, or testing checkout.
