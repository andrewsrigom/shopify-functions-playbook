import type { CartDeliveryOptionsTransformRunInput } from "../generated/input";
import type { CartDeliveryOptionsTransformRunResult } from "../generated/api";
import { config } from "../../../lib/config";

export function cartDeliveryOptionsTransformRun(
  input: CartDeliveryOptionsTransformRunInput,
): CartDeliveryOptionsTransformRunResult {
  const c = config(input.deliveryCustomization.config?.jsonValue);

  if (
    !c ||
    typeof c.optionTitle !== "string" ||
    !c.optionTitle ||
    typeof c.replacementTitle !== "string" ||
    !c.replacementTitle ||
    c.replacementTitle.length > 100 ||
    input.cart.lines.length === 0
  )
    return { operations: [] };

  const title = c.replacementTitle;

  return {
    operations: input.cart.deliveryGroups.flatMap((group) =>
      group.deliveryOptions
        .filter((option) => option.title === c.optionTitle)
        .map((option) => ({
          deliveryOptionRename: { deliveryOptionHandle: option.handle, title },
        })),
    ),
  };
}
