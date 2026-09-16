# App setup and owner lifecycle

Local examples do not require an app registration. `shopify.app.toml` intentionally has an empty client_id; it must be linked before authenticated configuration checks or store work. Nothing here registers, publishes, or activates an app automatically.

## Connect a development environment

Use an account with app development permissions and a suitable development store. After explicitly authorizing account/store setup, run `pnpm exec shopify app config link` from this repository and choose your app. Preserve the playbook’s function metafield definitions and required scopes when merging linked configuration. Then run `pnpm exec shopify app config validate --json` and review all errors. Regenerate schemas with `pnpm exec shopify app function schema --path extensions/<scenario>` after linking and review the diff before replacing the checked-in version.

To start a separate app, use `shopify app init --template none --package-manager pnpm`; to add an extension, use `shopify app generate extension --template <api-template> --flavor typescript --name <name>`. This repository adapts [official templates](template-provenance.md). Do not generate a duplicate extension into an existing scenario directory.

Only after reviewing the compiled code and explicitly approving publication should an operator use Shopify CLI’s app development/deployment workflow to install the extension on the selected development store. The repository’s scripts never deploy. A successful upload alone does not activate a Function: each API needs an owner resource referencing its Function handle.

## Definitions, values, then runtime reads

1. `shopify.app.toml` declares app-owned JSON definitions for Validation, Discount, PaymentCustomization, DeliveryCustomization, and CartTransform. These definitions must be installed with the app before writing values.
2. Each scenario provides a creation operation and example variables. Create disabled validation/payment/delivery owners. Discount examples start in 2099 until the operator intentionally chooses an active schedule. A CartTransform owner can exist without enabled config and produces no expansion.
3. Write values with `operations/configure.graphql` (`metafieldsSet`) using the actual owner ID and the scenario’s configuration JSON. Never use a Function ID as the metafield owner ID.
4. The scenario input query reads `metafield(namespace: "$app", key: "config") { jsonValue }` from its owner. Shopify supplies that data at invocation time.
5. Activate intentionally and test representative checkouts, then deactivate before exploring conflicting examples.

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
