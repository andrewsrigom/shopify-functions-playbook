import { readFileSync, writeFileSync } from "node:fs";
import { buildClientSchema, printSchema } from "graphql";

const catalog = JSON.parse(readFileSync("catalog.json", "utf8"));

for (const entry of catalog) {
  const raw = JSON.parse(readFileSync(`vendor/${entry.api}.json`, "utf8"));

  if (entry.api === "delivery_customization") {
    // The official snapshot retains empty legacy operations removed by the modern target.
    raw.data.__schema.types = raw.data.__schema.types.filter(
      (type) =>
        ![
          "DeprecatedOperation",
          "FunctionResult",
          "FunctionRunResult",
        ].includes(type.name),
    );

    const mutation = raw.data.__schema.types.find(
      (type) => type.name === "MutationRoot",
    );

    mutation.fields = mutation.fields.filter(
      (field) => !["run", "handleResult"].includes(field.name),
    );
  }

  writeFileSync(
    `extensions/${entry.name}/schema.graphql`,
    `${printSchema(buildClientSchema(raw.data)).replace(/[ \t]+$/gm, "")}\n`,
  );
}
