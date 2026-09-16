export function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function config(value: unknown): Record<string, unknown> | undefined {
  return record(value) && value.enabled === true ? value : undefined;
}

export function integer(value: unknown, max = 10000): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value > 0 &&
    value <= max
  );
}

export function percentage(value: unknown): value is number {
  return integer(value, 100);
}

export function gid(value: unknown, type: string): value is string {
  return (
    typeof value === "string" &&
    new RegExp(`^gid://shopify/${type}/[0-9]+$`).test(value)
  );
}

export function money(value: unknown): bigint | undefined {
  if (typeof value !== "string" || !/^\d{1,15}(?:\.\d{1,6})?$/.test(value))
    return undefined;

  const [whole, fraction = ""] = value.split(".");

  return BigInt(`${whole}${fraction.padEnd(6, "0")}`);
}
