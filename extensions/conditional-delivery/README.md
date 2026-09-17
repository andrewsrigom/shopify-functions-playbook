# Conditional Delivery

## Problem and behavior

Hide a named delivery option when that delivery group contains a restricted variant **or** its destination country is configured as blocked. Move the first remaining preferred title to index zero. Matching is exact and case-sensitive; configure localized titles deliberately.

Restrictions are evaluated per delivery group, so an unrelated shipment is not affected. Missing addresses do not match country restrictions; product restrictions still apply. If hiding would remove every option, the entire group stays unchanged. This is a convenience rule, not enforcement of a legal shipping prohibition: enforce mandatory restrictions in shipping configuration or validation. Empty groups are unchanged. No option or shipping rate is created.

## Prerequisites and restrictions

API **2026-04**, target `cart.delivery-options.transform.run`. Local tooling: Node.js 24 and pnpm 10.32.0. Store execution requires a linked app, app-development permissions, and a suitable development store. Public apps with Functions support eligible plans; custom apps with Function APIs require Shopify Plus on production stores. Review [platform restrictions](../../docs/platform-restrictions.md) and the versioned API before selecting distribution. No network access target is used.

## Read the code

Read `config.example.json`, `src/cart_delivery_options_transform_run.graphql`, `generated/input.ts`, `src/cart_delivery_options_transform_run.ts`, then `fixtures/` and `tests/run.test.ts`. The implementation is exported by `src/index.ts`. Input queries select data supplied to the Function; they are not arbitrary Admin API calls. Generated files come from Shopify CLI type generation.

## Configuration

Owner: **DeliveryCustomization**, read as `deliveryCustomization.config`. App-owned namespace `$app`, key `config`, type `json`; the app TOML declares the definition. `config.schema.json` documents values, and runtime code validates unknown JSON. Checked-in examples use `enabled:false`. Missing, disabled, or malformed configuration emits `{"operations":[]}`.

Set `hideTitle`, `preferredTitle`, `restrictedVariantIds` (up to 50 variant GIDs), and `blockedCountries` (up to 50 uppercase two-letter country codes). Empty lists disable that condition. Address fields are limited to country code; check the app's required data access and development-store delivery group behavior.

## Run and test

From repository root:

```bash
pnpm install --frozen-lockfile
pnpm typegen conditional-delivery
pnpm typecheck
pnpm test -- extensions/conditional-delivery/tests
pnpm build conditional-delivery
pnpm test:runtime conditional-delivery
```

Each `fixtures/*.input.json` has a matching complete expected output. Tests cover valid operation shape, absent and invalid configuration, empty carts, exact boundaries, and scenario-specific cases described above. These queries do not select customer identity; guests follow the same rules. `pnpm fixtures:check` checks query-shaped fixture fields; runtime checks execute the compiled Wasm.

## Owner activation and deactivation

Required scope: `write_delivery_customizations`. Follow [app setup and owner lifecycle](../../docs/activation.md) using app-context credentials. Copy operator variables to ignored `*.local.json` files, substitute the returned owner ID, and review the store before mutations.

Create with `operations/create-delivery.graphql` and `create.variables.json`, which starts disabled. Write configuration with `operations/configure.graphql` and an ignored local copy of `configure.variables.json`. Only after reviewing it, set its JSON `enabled` to true and explicitly enable the owner with `operations/enable-delivery.graphql` and a local copy of `activation.variables.json` using `enabled:true`. To stop, disable the owner and/or configuration.

## Production adaptations

Test the complete checkout interaction with existing shipping rules, discounts, and transforms before enabling broadly. Configuration failures intentionally produce no operation. Keep localized titles, presentment currencies, and catalog GIDs consistent with the selected store. See [checkout safety](../../docs/security-and-cost.md).

## Official references

- [Versioned Function API](https://shopify.dev/docs/api/functions/2026-04/delivery-customization)
- [Function availability and workflow](https://shopify.dev/docs/apps/build/functions)
