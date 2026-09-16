import type { CartLinesDiscountsGenerateRunInput } from "../generated/input";
import type { CartLinesDiscountsGenerateRunResult } from "../generated/api";
import { config, percentage } from "../../../lib/config";
import { ProductDiscountSelectionStrategy } from "../generated/api";

export function cartLinesDiscountsGenerateRun(
  input: CartLinesDiscountsGenerateRunInput,
): CartLinesDiscountsGenerateRunResult {
  const c = config(input.discount.config?.jsonValue);

  if (
    !c ||
    !percentage(c.percentage) ||
    !input.discount.discountClasses.includes("PRODUCT") ||
    !input.cart.buyerIdentity?.customer?.hasAnyTag ||
    input.cart.lines.length === 0
  )
    return { operations: [] };

  return {
    operations: [
      {
        productDiscountsAdd: {
          candidates: [
            {
              targets: input.cart.lines.map((line) => ({
                cartLine: { id: line.id, quantity: line.quantity },
              })),
              value: { percentage: { value: String(c.percentage) } },
            },
          ],
          selectionStrategy: ProductDiscountSelectionStrategy.All,
        },
      },
    ],
  };
}
