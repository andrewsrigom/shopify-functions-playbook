import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { isDeepStrictEqual } from "node:util";

const action = process.argv[2];

if (!["typegen", "build", "run"].includes(action))
  throw Error("Choose typegen, build, or run");

const selected = process.argv[3];

const catalog = JSON.parse(readFileSync("catalog.json", "utf8"));

if (selected && !catalog.some((entry) => entry.name === selected))
  throw Error(`Unknown scenario: ${selected}`);

for (const entry of catalog) {
  if (selected && entry.name !== selected) continue;

  const path = resolve("extensions", entry.name);

  if (action !== "run") {
    execFileSync(
      "pnpm",
      ["exec", "shopify", "app", "function", action, "--path", path],
      { stdio: "inherit" },
    );
    continue;
  }

  for (const file of readdirSync(`${path}/fixtures`).filter((name) =>
    name.endsWith(".input.json"),
  )) {
    const stdout = execFileSync(
      "pnpm",
      [
        "exec",
        "shopify",
        "app",
        "function",
        "run",
        "--path",
        path,
        "--input",
        `${path}/fixtures/${file}`,
        "--export",
        entry.target.replaceAll(".", "-"),
        "--json",
      ],
      { encoding: "utf8" },
    );
    const actual = JSON.parse(stdout);
    const expected = JSON.parse(
      readFileSync(
        `${path}/fixtures/${file.replace(".input.", ".expected.")}`,
        "utf8",
      ),
    );

    if (!actual.success || !isDeepStrictEqual(actual.output, expected))
      throw Error(
        `Compiled runtime mismatch: ${entry.name}/${file}\n${stdout}`,
      );

    console.log(`PASS compiled runtime ${entry.name}/${file}`);
  }
}
