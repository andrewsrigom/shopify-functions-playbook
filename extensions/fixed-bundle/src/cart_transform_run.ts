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
  )
    return { operations: [] };

  const components: { merchandiseId: string; quantity: number }[] = [];

  for (const component of c.components) {
    if (
      !record(component) ||
      !gid(component.variantId, "ProductVariant") ||
      !integer(component.quantity, 100) ||
      component.variantId === c.parentVariant
    )
      return { operations: [] };

    components.push({
      merchandiseId: component.variantId,
      quantity: component.quantity,
    });
  }

  if (
    new Set(components.map((x) => x.merchandiseId)).size !== components.length
  )
    return { operations: [] };

  return {
    operations: input.cart.lines
      .filter(
        (line) =>
          line.merchandise.__typename === "ProductVariant" &&
          line.merchandise.id === c.parentVariant &&
          !line.sellingPlanAllocation,
      )
      .map((line) => ({
        lineExpand: { cartLineId: line.id, expandedCartItems: components },
      })),
  };
}
