import type { CartLinesDiscountsGenerateRunInput } from "../generated/input";
import {
  OrderDiscountSelectionStrategy,
  type CartLinesDiscountsGenerateRunResult,
} from "../generated/api";
import { config, money, gid } from "../../../lib/config";

export function cartLinesDiscountsGenerateRun(
  input: CartLinesDiscountsGenerateRunInput,
): CartLinesDiscountsGenerateRunResult {
  const c = config(input.discount.config?.jsonValue);
  const minimum = money(c?.minimumSubtotal);
  const amount = money(c?.amount);

  if (
    !c ||
    minimum === undefined ||
    amount === undefined ||
    amount <= 0n ||
    typeof c.currency !== "string" ||
    !/^[A-Z]{3}$/.test(c.currency) ||
    !Array.isArray(c.excludedVariantIds) ||
    c.excludedVariantIds.length > 50 ||
    !c.excludedVariantIds.every((id: unknown) => gid(id, "ProductVariant")) ||
    !input.discount.discountClasses.includes("ORDER")
  ) {
    return { operations: [] };
  }

  const excluded = new Set(c.excludedVariantIds);
  const excludedCartLineIds: string[] = [];
  let subtotal = 0n;

  for (const line of input.cart.lines) {
    if (
      line.merchandise.__typename !== "ProductVariant" ||
      excluded.has(line.merchandise.id)
    ) {
      excludedCartLineIds.push(line.id);
      continue;
    }

    const value = money(line.cost.subtotalAmount.amount);

    if (
      value === undefined ||
      line.cost.subtotalAmount.currencyCode !== c.currency
    ) {
      return { operations: [] };
    }

    subtotal += value;
  }

  if (subtotal < minimum || subtotal === 0n) return { operations: [] };

  const capped = amount < subtotal ? amount : subtotal;
  const decimal = `${capped / 1000000n}.${String(capped % 1000000n).padStart(6, "0")}`;

  return {
    operations: [
      {
        orderDiscountsAdd: {
          selectionStrategy: OrderDiscountSelectionStrategy.First,
          candidates: [
            {
              targets: [{ orderSubtotal: { excludedCartLineIds } }],
              value: { fixedAmount: { amount: decimal } },
            },
          ],
        },
      },
    ],
  };
}
