import type { CartTransformRunInput } from "../generated/input";
import type { CartTransformRunResult } from "../generated/api";
import { config, record, integer, gid } from "../../../lib/config";

export function cartTransformRun(
  input: CartTransformRunInput,
): CartTransformRunResult {
  const c = config(input.cartTransform.config?.jsonValue);

  if (
    !c ||
    !gid(c.parentVariant, "ProductVariant") ||
    !Array.isArray(c.components) ||
    c.components.length < 2 ||
    c.components.length > 50
  ) {
    return { operations: [] };
  }

  const seen = new Set<string>();
  const cartLines: { cartLineId: string; quantity: number }[] = [];

  for (const component of c.components) {
    if (
      !record(component) ||
      !gid(component.variantId, "ProductVariant") ||
      !integer(component.quantity, 100) ||
      component.variantId === c.parentVariant ||
      seen.has(component.variantId)
    ) {
      return { operations: [] };
    }

    seen.add(component.variantId);
    let needed = component.quantity;

    for (const line of input.cart.lines) {
      if (needed === 0) break;
      if (
        line.merchandise.__typename !== "ProductVariant" ||
        line.merchandise.id !== component.variantId ||
        line.sellingPlanAllocation ||
        !integer(line.quantity)
      )
        continue;

      const quantity = Math.min(needed, line.quantity);

      cartLines.push({ cartLineId: line.id, quantity });
      needed -= quantity;
    }

    if (needed > 0) return { operations: [] };
  }

  // Consume exactly one recipe per evaluation; excess units remain separate.
  return {
    operations: [
      { linesMerge: { parentVariantId: c.parentVariant, cartLines } },
    ],
  };
}
