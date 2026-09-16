import type { CartLinesDiscountsGenerateRunInput } from "../generated/input";
import type { CartLinesDiscountsGenerateRunResult } from "../generated/api";
import { config, integer, gid } from "../../../lib/config";
import { ProductDiscountSelectionStrategy } from "../generated/api";

export function cartLinesDiscountsGenerateRun(
  input: CartLinesDiscountsGenerateRunInput,
): CartLinesDiscountsGenerateRunResult {
  const c = config(input.discount.config?.jsonValue);

  if (
    !c ||
    !gid(c.buyVariant, "ProductVariant") ||
    !gid(c.getVariant, "ProductVariant") ||
    c.buyVariant === c.getVariant ||
    !integer(c.buyQuantity) ||
    !integer(c.getQuantity) ||
    !input.discount.discountClasses.includes("PRODUCT")
  )
    return { operations: [] };

  const qualifying = input.cart.lines.reduce(
    (sum, line) =>
      sum +
      (line.merchandise.__typename === "ProductVariant" &&
      line.merchandise.id === c.buyVariant
        ? line.quantity
        : 0),
    0,
  );
  let remaining = Math.floor(qualifying / c.buyQuantity) * c.getQuantity;
  const targets = [];

  for (const line of input.cart.lines) {
    if (remaining === 0) break;

    if (
      line.merchandise.__typename === "ProductVariant" &&
      line.merchandise.id === c.getVariant
    ) {
      const quantity = Math.min(line.quantity, remaining);

      targets.push({ cartLine: { id: line.id, quantity } });
      remaining -= quantity;
    }
  }

  return targets.length
    ? {
        operations: [
          {
            productDiscountsAdd: {
              candidates: [
                { targets, value: { percentage: { value: "100" } } },
              ],
              selectionStrategy: ProductDiscountSelectionStrategy.All,
            },
          },
        ],
      }
    : { operations: [] };
}
