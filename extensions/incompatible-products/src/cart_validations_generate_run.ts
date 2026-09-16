import type { CartValidationsGenerateRunInput } from "../generated/input";
import type { CartValidationsGenerateRunResult } from "../generated/api";
import { config, gid } from "../../../lib/config";

export function cartValidationsGenerateRun(
  input: CartValidationsGenerateRunInput,
): CartValidationsGenerateRunResult {
  const c = config(input.validation.config?.jsonValue);

  if (
    !c ||
    !gid(c.firstProduct, "Product") ||
    !gid(c.secondProduct, "Product") ||
    c.firstProduct === c.secondProduct
  )
    return { operations: [] };

  const products = new Set(
    input.cart.lines.flatMap((line) =>
      line.merchandise.__typename === "ProductVariant"
        ? [line.merchandise.product.id]
        : [],
    ),
  );

  return products.has(c.firstProduct) && products.has(c.secondProduct)
    ? {
        operations: [
          {
            validationAdd: {
              errors: [
                {
                  message: "These products cannot be purchased together.",
                  target: "$.cart",
                },
              ],
            },
          },
        ],
      }
    : { operations: [] };
}
