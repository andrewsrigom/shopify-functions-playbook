import type { CartValidationsGenerateRunInput } from "../generated/input";
import type { CartValidationsGenerateRunResult } from "../generated/api";

function decimal(value: string): bigint | undefined {
  if (!/^\d{1,15}(?:\.\d{1,6})?$/.test(value)) return undefined;

  const [whole, fraction = ""] = value.split(".");

  return BigInt(`${whole}${fraction.padEnd(6, "0")}`);
}

export function cartValidationsGenerateRun(
  input: CartValidationsGenerateRunInput,
): CartValidationsGenerateRunResult {
  const config: unknown = input.validation.config?.jsonValue;

  if (
    !config ||
    typeof config !== "object" ||
    !("enabled" in config) ||
    config.enabled !== true
  )
    return { operations: [] };

  if (
    !("minimum" in config) ||
    typeof config.minimum !== "string" ||
    !("currency" in config) ||
    typeof config.currency !== "string"
  )
    return { operations: [] };

  const minimum = decimal(config.minimum);
  const amount = decimal(input.cart.cost.subtotalAmount.amount);

  if (
    minimum === undefined ||
    amount === undefined ||
    input.cart.cost.subtotalAmount.currencyCode !== config.currency ||
    input.cart.lines.length === 0 ||
    amount >= minimum
  )
    return { operations: [] };

  return {
    operations: [
      {
        validationAdd: {
          errors: [
            {
              message: `Minimum order subtotal is ${config.minimum} ${config.currency}.`,
              target: "$.cart",
            },
          ],
        },
      },
    ],
  };
}
