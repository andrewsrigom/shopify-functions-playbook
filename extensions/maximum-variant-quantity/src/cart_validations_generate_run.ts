import type { CartValidationsGenerateRunInput } from "../generated/input";
import type { CartValidationsGenerateRunResult } from "../generated/api";
import { config, integer } from "../../../lib/config";

export function cartValidationsGenerateRun(
  input: CartValidationsGenerateRunInput,
): CartValidationsGenerateRunResult {
  const c = config(input.validation.config?.jsonValue);

  if (!c || !integer(c.maximum)) return { operations: [] };

  const maximum = c.maximum;
  const quantities = new Map<string, number>();

  for (const line of input.cart.lines) {
    if (line.merchandise.__typename === "ProductVariant")
      quantities.set(
        line.merchandise.id,
        (quantities.get(line.merchandise.id) ?? 0) + line.quantity,
      );
  }

  if ([...quantities.values()].some((quantity) => quantity > maximum))
    return {
      operations: [
        {
          validationAdd: {
            errors: [
              {
                message: "Variant quantity exceeds the configured maximum.",
                target: "$.cart",
              },
            ],
          },
        },
      ],
    };

  return { operations: [] };
}
