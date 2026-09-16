import type { CartDeliveryOptionsDiscountsGenerateRunInput } from "../generated/input";
import type { CartDeliveryOptionsDiscountsGenerateRunResult } from "../generated/api";
import { config, percentage, money } from "../../../lib/config";
import { DeliveryDiscountSelectionStrategy } from "../generated/api";

export function cartDeliveryOptionsDiscountsGenerateRun(
  input: CartDeliveryOptionsDiscountsGenerateRunInput,
): CartDeliveryOptionsDiscountsGenerateRunResult {
  const c = config(input.discount.config?.jsonValue);

  if (
    !c ||
    typeof c.currency !== "string" ||
    typeof c.optionTitle !== "string" ||
    !c.optionTitle ||
    !percentage(c.percentage) ||
    !input.discount.discountClasses.includes("SHIPPING") ||
    input.cart.lines.length === 0
  )
    return { operations: [] };

  const minimum = money(c.minimum),
    amount = money(input.cart.cost.subtotalAmount.amount);

  if (
    minimum === undefined ||
    amount === undefined ||
    amount < minimum ||
    input.cart.cost.subtotalAmount.currencyCode !== c.currency
  )
    return { operations: [] };

  const targets = input.cart.deliveryGroups.flatMap((group) =>
    group.deliveryOptions
      .filter((option) => option.title === c.optionTitle)
      .map((option) => ({ deliveryOption: { handle: option.handle } })),
  );

  return targets.length
    ? {
        operations: [
          {
            deliveryDiscountsAdd: {
              candidates: [
                {
                  targets,
                  value: { percentage: { value: String(c.percentage) } },
                },
              ],
              selectionStrategy: DeliveryDiscountSelectionStrategy.All,
            },
          },
        ],
      }
    : { operations: [] };
}
