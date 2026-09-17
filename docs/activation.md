# App setup and owner lifecycle

Local examples do not require an app registration. `shopify.app.toml` intentionally has an empty client_id; it must be linked before authenticated configuration checks or store work. Nothing here registers, publishes, or activates an app automatically.

## Connect a development environment

Use an account with app development permissions and a suitable development store. After explicitly authorizing account/store setup, run `pnpm exec shopify app config link` from this repository and choose your app. Preserve the playbook’s function metafield definitions and required scopes when merging linked configuration. Then run `pnpm exec shopify app config validate --json` and review all errors. Regenerate schemas with `pnpm exec shopify app function schema --path extensions/<scenario>` after linking and review the diff before replacing the checked-in version.

To start a separate app, use `shopify app init --template none --package-manager pnpm`; to add an extension, use `shopify app generate extension --template <api-template> --flavor typescript --name <name>`. This repository adapts [official templates](template-provenance.md). Do not generate a duplicate extension into an existing scenario directory.

Only after reviewing the compiled code and explicitly approving publication should an operator use Shopify CLI’s app development/deployment workflow to install the extension on the selected development store. The repository’s scripts never deploy. A successful upload alone does not activate a Function: each API needs an owner resource referencing its Function handle.

## Definitions, values, then runtime reads

1. `shopify.app.toml` declares app-owned JSON definitions for Validation, Discount, PaymentCustomization, DeliveryCustomization, and CartTransform. These definitions must be installed with the app before writing values.
2. Each scenario provides a creation operation and example variables. Create disabled validation/payment/delivery owners. Discount examples have a one-hour window in 2099 until the operator deliberately chooses both start and end times for a short test session. A CartTransform owner can exist without enabled config and produces no transform operations.
3. Copy `configure.variables.json` to an ignored `configure.local.json`. Write values with `operations/configure.graphql` (`metafieldsSet`) using the actual owner ID and the scenario’s configuration JSON, which starts with `enabled:false`. Never use a Function ID as the metafield owner ID.
4. The scenario input query reads `metafield(namespace: "$app", key: "config") { jsonValue }` from its owner. Shopify supplies that data at invocation time.
5. When ready, set the configuration JSON `enabled` to true and write it again, then activate the owner or discount schedule intentionally. Owner activation variables also start false. Test representative checkouts, then deactivate before exploring conflicting examples. Cart Transform begins operating as soon as its config is enabled.

The static GraphQL operations were validated against Admin API 2026-04; sample IDs and configuration values must still be replaced. Do not use a generic merchant token belonging to a different app: `$app` is resolved by the authenticated app identity.

## Execute deliberately

Use your app’s authenticated Admin GraphQL client or Shopify’s authenticated development tooling to send the checked-in `operations/*.graphql` with the scenario’s `*.variables.json`. Each response must be checked for top-level errors and non-empty `userErrors` before proceeding. No script in this repository sends these mutations automatically.

## Coexistence and cleanup

Validation owners use `validationUpdate` with enable=false. Payment/delivery owners use their update mutation with enabled=false. Automatic discounts use `discountAutomaticDeactivate`. Cart transforms use `cartTransformDelete`; creation of another transform for this app requires removing the old owner. The exact validated operations are in `operations/`.

Discount examples default to no combination with other discount classes. This does not imply every Function can safely be active simultaneously. Test combinations explicitly, especially quantity validations alongside discounts and bundles. Changes made by other apps are outside these examples.

## References

- [Validation creation](https://shopify.dev/docs/api/admin-graphql/2026-04/mutations/validationCreate)
- [Automatic app discounts](https://shopify.dev/docs/api/admin-graphql/2026-04/mutations/discountAutomaticAppCreate)
- [Payment customization](https://shopify.dev/docs/api/admin-graphql/2026-04/mutations/paymentCustomizationCreate)
- [Delivery customization](https://shopify.dev/docs/api/admin-graphql/2026-04/mutations/deliveryCustomizationCreate)
- [Cart Transform](https://shopify.dev/docs/api/admin-graphql/2026-04/mutations/cartTransformCreate)
- [Metafield definitions](https://shopify.dev/docs/apps/build/metafields/definitions)
- [Official extension-only template](https://github.com/Shopify/shopify-app-template-extension-only)
- [Official Function templates](https://github.com/Shopify/function-examples)

## Store, credentials, and rollback

Before any authenticated operation, independently confirm the selected app client ID, development-store domain, and intended owner ID. Keep store-specific variables in ignored `*.local.json` files and named app configurations in ignored `shopify.app.*.toml` files. Ignore rules do not protect files already tracked by Git; inspect staged changes before committing. Use Shopify CLI authentication or your app's authenticated client, and do not place tokens in fixture/configuration JSON, command arguments, screenshots, logs, or committed files.

Keep an operator record of each owner ID and its previous configuration in an ignored local file. `metafieldsSet` replaces the value, so read and review the current owner before overwriting it. Use the owner-specific deactivation operation for rollback; setting the config `enabled:false` also makes these Functions return no operations. Review [security and cost controls](security-and-cost.md) and [platform restrictions](platform-restrictions.md) before installing into any store.
