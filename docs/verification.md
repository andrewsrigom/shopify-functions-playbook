# Checks and coverage

Use Node.js 24, pnpm 10.32.0, and the repository's pinned Shopify CLI 4.8.0. All extensions target API 2026-04 and use Function library 2.0.1. Install dependencies with `pnpm install --frozen-lockfile`.

| Command               | Purpose                                                                                 |
| --------------------- | --------------------------------------------------------------------------------------- |
| `pnpm format:check`   | Check source and documentation formatting                                               |
| `pnpm lint`           | Enforce lint rules                                                                      |
| `pnpm typegen`        | Generate schema and query types for all eleven extensions using Shopify CLI             |
| `pnpm typecheck`      | Check strict TypeScript                                                                 |
| `pnpm test`           | Run 127 unit tests covering complete Function outputs                                   |
| `pnpm fixtures:check` | Validate fixture fields, nullability, enums, lists, and unions against each input query |
| `pnpm build`          | Compile all eleven actual Wasm Functions                                                |
| `pnpm test:runtime`   | Execute all 127 fixtures in the compiled runtime and compare complete JSON outputs      |
| `pnpm check`          | Run the complete sequence above                                                         |

Append a scenario name to type generation, build, and runtime commands to select one extension, for example `pnpm build fixed-bundle` and `pnpm test:runtime fixed-bundle`. The first build downloads Shopify's compiler/runtime tools.

Fixtures cover absent, disabled, malformed, and invalid configuration; nullable query fields; exact thresholds; empty and multiple-line carts; and scenario-specific behavior. Buyer-aware examples include guest and unidentified-customer cases. Each input has a complete expected output checked by both the unit suite and compiled-runtime runner.

CI uses a frozen dependency installation, runs the complete check sequence, and rejects changes to committed generated types. It does not require store credentials or activate owners. For development-store configuration and checkout workflows, follow [activation](activation.md) and the selected scenario README. Use [platform restrictions](platform-restrictions.md) when choosing store capabilities and app distribution.

## Reproducible schemas and templates

Versioned introspection snapshots are retained in `vendor/`; [schema provenance](../vendor/README.md) documents their source and the modern delivery-target projection. `scripts/materialize-schemas.mjs` regenerates extension SDL. Schema and query types use separate generated files to avoid duplicate declarations.

The minimal app and extension structure adapt official Shopify templates. See [template provenance](template-provenance.md) for upstream revisions and license attribution.
