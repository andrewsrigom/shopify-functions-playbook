import { readFileSync, readdirSync } from "node:fs";
import {
  buildSchema,
  parse,
  validate,
  getOperationAST,
  isEnumType,
  isScalarType,
  isListType,
  isNonNullType,
  isObjectType,
  isUnionType,
} from "graphql";

// GraphQL codegen validates queries. This additional check validates fixture field shapes.
function checkValue(type, value, selection, schema, path) {
  if (isNonNullType(type)) {
    if (value === null || value === undefined)
      throw Error(`Missing non-null ${path}`);

    return checkValue(type.ofType, value, selection, schema, path);
  }

  if (value === null) return;

  if (value === undefined)
    throw Error(`Missing selected field ${path}; use null for nullable fields`);

  if (isListType(type)) {
    if (!Array.isArray(value)) throw Error(`Expected array ${path}`);

    for (const child of value)
      checkValue(type.ofType, child, selection, schema, path);

    return;
  }

  if (isEnumType(type)) {
    if (!type.getValues().some((x) => x.name === value))
      throw Error(`Invalid enum ${path}`);

    return;
  }

  if (isScalarType(type)) {
    if (type.name === "Int" && !Number.isInteger(value))
      throw Error(`Invalid integer ${path}`);

    if (
      ["String", "ID", "Decimal", "Handle"].includes(type.name) &&
      typeof value !== "string"
    )
      throw Error(`Invalid string ${path}`);

    if (type.name === "Boolean" && typeof value !== "boolean")
      throw Error(`Invalid boolean ${path}`);

    return;
  }

  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error(`Expected object ${path}`);

  if (isUnionType(type)) {
    const concrete = schema.getType(value.__typename);

    if (
      !concrete ||
      !isObjectType(concrete) ||
      !type.getTypes().includes(concrete)
    )
      throw Error(`Invalid union ${path}`);

    return checkValue(concrete, value, selection, schema, path);
  }

  if (isObjectType(type))
    for (const field of selection.selections) {
      if (field.kind === "InlineFragment") {
        if (field.typeCondition?.name.value === type.name)
          checkValue(type, value, field.selectionSet, schema, path);

        continue;
      }

      if (field.kind !== "Field")
        throw Error("Fixture checker expects inline selections");

      if (field.name.value === "__typename") {
        if (value.__typename !== type.name)
          throw Error(`Invalid typename ${path}`);

        continue;
      }

      const definition = type.getFields()[field.name.value];

      if (!definition) throw Error(`Unknown field ${path}`);

      checkValue(
        definition.type,
        value[field.alias?.value ?? field.name.value],
        field.selectionSet,
        schema,
        `${path}.${field.name.value}`,
      );
    }
}

const catalog = JSON.parse(readFileSync("catalog.json", "utf8"));

for (const entry of catalog) {
  const base = `extensions/${entry.name}`;
  const schema = buildSchema(readFileSync(`${base}/schema.graphql`, "utf8"));
  const document = parse(
    readFileSync(`${base}/src/${entry.file}.graphql`, "utf8"),
  );
  const errors = validate(schema, document);

  if (errors.length) throw errors[0];

  const operation = getOperationAST(document);

  for (const fixture of readdirSync(`${base}/fixtures`).filter((x) =>
    x.endsWith(".input.json"),
  ))
    checkValue(
      schema.getQueryType(),
      JSON.parse(readFileSync(`${base}/fixtures/${fixture}`, "utf8")),
      operation.selectionSet,
      schema,
      fixture,
    );

  console.log(`PASS fixture shapes ${entry.name}`);
}
