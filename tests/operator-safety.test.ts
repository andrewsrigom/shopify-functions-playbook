import { readFileSync } from "node:fs";
import { it, expect } from "vitest";
import catalog from "../catalog.json";

function read(path: string) {
  return JSON.parse(readFileSync(path, "utf8"));
}

it.each(catalog)("$name ships with inactive operator examples", ({ name }) => {
  const directory = `extensions/${name}`;
  const example = read(`${directory}/config.example.json`);
  const configured = read(`${directory}/configure.variables.json`);
  const create = read(`${directory}/create.variables.json`);
  const activation = read(`${directory}/activation.variables.json`);

  expect(example.enabled).toBe(false);
  expect(configured.metafields).toHaveLength(1);
  expect(configured.metafields[0].namespace).toBe("$app");
  expect(configured.metafields[0].ownerId).toContain("REPLACE_OWNER_ID");
  expect(JSON.parse(configured.metafields[0].value)).toEqual(example);

  if (create.validation) {
    expect(create.validation.enable).toBe(false);
    expect(create.validation.blockOnFailure).toBe(false);
    expect(activation.enable).toBe(false);
  }

  if (create.input) {
    expect(create.input.enabled).toBe(false);
    expect(activation.enabled).toBe(false);
  }

  if (create.discount) {
    const start = Date.parse(create.discount.startsAt);
    const end = Date.parse(create.discount.endsAt);

    expect(start).toBe(Date.parse("2099-01-01T00:00:00Z"));
    expect(end - start).toBe(60 * 60 * 1000);
    expect(Object.values(create.discount.combinesWith)).toEqual([
      false,
      false,
      false,
    ]);
    expect(create.discount.appliesOnSubscription).toBe(false);
  }
});
