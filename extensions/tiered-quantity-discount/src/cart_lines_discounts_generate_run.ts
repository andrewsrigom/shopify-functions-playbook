import type { CartLinesDiscountsGenerateRunInput } from "../generated/input";
import type { CartLinesDiscountsGenerateRunResult } from "../generated/api";
import { config, record, integer, percentage } from "../../../lib/config";
import { ProductDiscountSelectionStrategy } from "../generated/api";

export function cartLinesDiscountsGenerateRun(
  input: CartLinesDiscountsGenerateRunInput,
): CartLinesDiscountsGenerateRunResult {
  const c = config(input.discount.config?.jsonValue);

  if (
    !c ||
    !Array.isArray(c.tiers) ||
    c.tiers.length === 0 ||
    c.tiers.length > 20 ||
    !input.discount.discountClasses.includes("PRODUCT")
  )
    return { operations: [] };

  const tiers: { minimum: number; percentage: number }[] = [];

  for (const tier of c.tiers) {
    if (!record(tier) || !integer(tier.minimum) || !percentage(tier.percentage))
      return { operations: [] };

    tiers.push({ minimum: tier.minimum, percentage: tier.percentage });
  }

  if (new Set(tiers.map((t) => t.minimum)).size !== tiers.length)
    return { operations: [] };

  tiers.sort((a, b) => b.minimum - a.minimum);

  const quantities = new Map<string, number>();

  for (const line of input.cart.lines) {
    if (line.merchandise.__typename === "ProductVariant")
      quantities.set(
        line.merchandise.id,
        (quantities.get(line.merchandise.id) ?? 0) + line.quantity,
      );
  }

  const candidates = [];

  for (const line of input.cart.lines) {
    if (line.merchandise.__typename !== "ProductVariant") continue;

    const count = quantities.get(line.merchandise.id) ?? 0;
    const tier = tiers.find((t) => count >= t.minimum);

    if (tier)
      candidates.push({
        targets: [{ cartLine: { id: line.id, quantity: line.quantity } }],
        value: { percentage: { value: String(tier.percentage) } },
      });
  }

  return candidates.length
    ? {
        operations: [
          {
            productDiscountsAdd: {
              candidates,
              selectionStrategy: ProductDiscountSelectionStrategy.All,
            },
          },
        ],
      }
    : { operations: [] };
}
