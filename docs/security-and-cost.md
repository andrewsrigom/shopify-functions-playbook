# Security and cost controls

Use a development store with synthetic products, customers, and test payments. Start with one Function owner enabled at a time. These run-only Functions execute inside Shopify; this repository provisions no cloud server, database, queue, or paid hosting and contains no app billing mutations.

## Inactive examples and deliberate activation

Every `config.example.json` and `configure.variables.json` starts with `enabled:false`. Validation, payment, and delivery owner examples and activation variables start disabled. Discounts have a one-hour window in 2099 with combinations and subscriptions disabled. A Cart Transform owner is registered immediately, but expansion requires explicitly enabled configuration.

Copy operator variables to ignored `*.local.json` files, replace placeholder owner IDs, review the business settings, and deliberately enable the config and owner/schedule for the test session. Change both discount timestamps together and keep an end time. Never copy runtime fixture configurations directly into a store: positive test fixtures intentionally enable their rules.

## Permissions and data

The full app requests only the five owner-write scopes needed by its fourteen examples. Write scopes also provide corresponding read access. If distributing a reduced app, remove unused extensions, definitions, and scopes together; simply running one local test does not reduce the installed app's permissions.

| Selected capability    | Owner scope                     |
| ---------------------- | ------------------------------- |
| Cart validations       | `write_validations`             |
| Discounts              | `write_discounts`               |
| Payment customization  | `write_payment_customizations`  |
| Delivery customization | `write_delivery_customizations` |
| Cart Transform         | `write_cart_transforms`         |

Configuration lives in app-owned `$app` metafields. The lifecycle is: declare definitions in app TOML, write JSON with `metafieldsSet`, then read `jsonValue` through the Function input query. Use credentials belonging to the same app identity. Store no tokens or private customer data in these metafields or fixtures. The input queries request business fields such as IDs, quantities, prices, a tag boolean, and order count; they do not request customer names, email addresses, or payment card data.

Check app ID, store domain, scopes, and owner IDs before mutations. Use MFA and app-development permissions for the selected development store. Local JSON and named app TOML files are ignored, but already-tracked files remain tracked. Inspect staged files and any exported Function logs before sharing them.

## Checkout and revenue impact

- Discount percentages up to 100 are supported intentionally; a valid configuration can still erase margin. Review percentages, eligible variants, reward quantities, shipping discounts, combinations, and the finite schedule. There is no cumulative monetary loss cap implemented by these examples.
- The payment example preserves an alternative in its own input by default. `allowHidingAllMethods:true` deliberately allows hiding all matching methods even if none remain. The default availability policy may leave the configured method visible above its threshold; do not treat this example as fraud or credit enforcement. Other apps can independently hide alternatives.
- Validation errors intentionally block checkout. Missing, disabled, or invalid configuration returns no operations. `blockOnFailure:false` governs runtime failures separately. These demonstration policies are not fraud, legal, or credit controls.
- Bundle configuration affects fulfillment contents. Check actual variants, inventory, parent pricing, component quantities, subscriptions, and interaction with other transforms. Delivery customization renames options and does not change their prices.
- Monetary comparisons use decimal strings in the matching currency. A different currency produces no operation. Test each supported market explicitly, including guests and returning customers where relevant.

## Cost and plan boundaries

The local build/test scripts do not create stores, install apps, activate rules, charge customers, or create billable cloud infrastructure. The compiler and tests use local CPU/disk resources and may download development tools. Shopify invokes configured Functions during checkout; they are not public HTTP endpoints hosted by this project.

Production store subscriptions, paid third-party apps, payment fees, shipping, and discounts remain separate business costs. Public GitHub source does not make this a Shopify App Store app. Shopify's current availability rules require Plus for production stores using custom apps containing Functions; App Store distribution has a different eligibility path. Check the selected distribution and Function API before considering a paid plan.

Dev stores are for testing and cannot process real transactions. Use the Bogus Gateway or supported payment-provider test mode. Do not approve paid app subscriptions, transfer a store, change a production plan, or run real payment transactions as part of a local test workflow.

## Session finish and recovery

Record owner IDs and the previous configuration before changes. For validation/payment/delivery, use the corresponding update operation with the enable flag false. For discounts, use `discountAutomaticDeactivate`; also retain a finite end time. For Cart Transform, set config `enabled:false` to stop this example or intentionally delete the owner. Confirm top-level GraphQL errors and `userErrors` are empty, then verify checkout behavior. Owners belonging to other apps need separate review.

CI runs local checks without store credentials. The lockfile pins the toolchain. A scoped Lodash override replaces the compiler dependency's vulnerable 4.17.23 with 4.18.1; reassess it when upgrading the upstream Function tooling. Run `pnpm audit` when refreshing dependencies and assess build-tool findings as well as runtime packages.

## References

- [Shopify Functions availability and execution](https://shopify.dev/docs/apps/build/functions)
- [Development-store limitations and test payments](https://shopify.dev/docs/apps/build/stores/development-stores)
- [Payment customization](https://shopify.dev/docs/apps/build/checkout/payments/create-payments-function)
- [Discounts and scopes](https://shopify.dev/docs/apps/build/discounts)
- [Lodash code-injection advisory](https://github.com/advisories/GHSA-r5fr-rjxr-66jc)
- [Lodash prototype-pollution advisory](https://github.com/advisories/GHSA-f23m-r3pf-42rh)

## Additional scenario safeguards

Conditional delivery preserves the group unchanged when hiding would remove all choices; it is not a mandatory shipping restriction mechanism. Order subtotal discounts use an explicit currency, cap the discount at the eligible subtotal, and exclude configured variants from qualification and the output target. The merge-bundle example consumes one recipe at a time and skips selling plans. Select either parent expansion or component merge for this app's active cart transform.
