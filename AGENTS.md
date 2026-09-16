# Engineering rules

- Preserve independent, selectable extensions. Each owns its input query, generated types, implementation, fixtures, and tests.
- Verify schema, target, activation, and plan restrictions in official Shopify documentation.
- Use Shopify CLI for scaffolding, type generation, compilation, and local runtime tests. Record authentication blockers honestly.
- Keep strict TypeScript. Parse metafield JSON as unknown and validate it.
- Run pnpm check. Never publish, deploy, activate, or mutate a store without explicit authorization.
- Do not introduce cloud infrastructure, storefronts, or a separate web application.
- Keep code and documentation in English. Never use Git branches prefixed codex/.

## Code readability

- Leave one blank line after the complete import block and between top-level declarations, functions, classes, and types. Keep related imports together.
- Separate logical steps inside functions with one blank line, especially validation, setup, execution, and return. Keep tightly related statements together; do not insert blank lines after every statement.
- Avoid compressed one-line control flow and multiple statements on one line. Follow the language's conventions and preserve existing project formatting.
- Review visual spacing before finishing; a formatter alone does not guarantee these blank lines. Do not manually reformat generated or vendored files.
