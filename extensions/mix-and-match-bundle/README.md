# Mix and Match Bundle

## Problem and behavior

Assemble exactly one configured recipe from component variants already in the cart using `linesMerge`. Unlike parent expansion, the input cart contains the component lines. Quantities are taken in cart order, including a component split over multiple lines. Extra units remain separate.

Every recipe component must be available before any operation is emitted. Selling-plan lines are skipped. Duplicate components, a recursive parent, invalid quantities, and missing components produce no operation. No pricing adjustment is emitted; Shopify handles bundle price allocation. This is a fixed recipe assembled from existing lines, not an arbitrary merchant-configurable choice-group engine.

## Prerequisites and restrictions

API **2026-04**, target `cart.transform.run`. Local tooling: Node.js 24 and pnpm 10.32.0. Store execution requires a linked app, app-development permissions, and a suitable development store. Public apps with Functions support eligible plans; custom apps with Function APIs require Shopify Plus on production stores. Review [platform restrictions](../../docs/platform-restrictions.md) and the versioned API before selecting distribution. No network access target is used.

## Read the code

Read `config.example.json`, `src/cart_transform_run.graphql`, `generated/input.ts`, `src/cart_transform_run.ts`, then `fixtures/` and `tests/run.test.ts`. The implementation is exported by `src/index.ts`. Input queries select data supplied to the Function; they are not arbitrary Admin API calls. Generated files come from Shopify CLI type generation.

## Configuration

Owner: **CartTransform**, read as `cartTransform.config`. App-owned namespace `$app`, key `config`, type `json`; the app TOML declares the definition. `config.schema.json` documents values, and runtime code validates unknown JSON. Checked-in examples use `enabled:false`. Missing, disabled, or malformed configuration emits `{"operations":[]}`.

Configure an existing `parentVariant` GID and 2–50 unique `components`, each with a variant GID and integer quantity 1–100. The parent must differ from its components. Set up the actual parent, component catalog, inventory, and bundle eligibility in the development store. The parent is supplied as `parentVariantId`; source component IDs and consumed quantities are supplied as `cartLines`.

## Run and test

From repository root:

```bash
pnpm install --frozen-lockfile
pnpm typegen mix-and-match-bundle
pnpm typecheck
pnpm test -- extensions/mix-and-match-bundle/tests
pnpm build mix-and-match-bundle
pnpm test:runtime mix-and-match-bundle
```

Each `fixtures/*.input.json` has a matching complete expected output. Tests cover valid operation shape, absent and invalid configuration, empty carts, exact boundaries, and scenario-specific cases described above. These queries do not select customer identity; guests follow the same rules. `pnpm fixtures:check` checks query-shaped fixture fields; runtime checks execute the compiled Wasm.

## Owner activation and deactivation

Required scope: `write_cart_transforms`. Follow [app setup and owner lifecycle](../../docs/activation.md) using app-context credentials. Copy operator variables to ignored `*.local.json` files, substitute the returned owner ID, and review the store before mutations.

Only one cart transform Function per app can be active on a store. Delete this app's previous `fixed-bundle` transform before registering this alternative. Use `operations/create-transform.graphql` with `create.variables.json`; registration takes effect immediately, but the missing/disabled configuration emits no operations. Configure the returned CartTransform via `operations/configure.graphql`, then explicitly enable its JSON. Remove it with `operations/delete-transform.graphql` and `activation.variables.json`. Other apps can also transform the cart; inspect cross-app interactions.

## Production adaptations

Test the complete checkout interaction with existing shipping rules, discounts, and transforms before enabling broadly. Configuration failures intentionally produce no operation. Keep localized titles, presentment currencies, and catalog GIDs consistent with the selected store. See [checkout safety](../../docs/security-and-cost.md).

## Official references

- [Versioned Function API](https://shopify.dev/docs/api/functions/2026-04/cart-transform)
- [Function availability and workflow](https://shopify.dev/docs/apps/build/functions)
