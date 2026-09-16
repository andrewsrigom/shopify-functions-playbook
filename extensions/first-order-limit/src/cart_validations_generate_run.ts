import type { CartValidationsGenerateRunInput } from "../generated/input";
import type { CartValidationsGenerateRunResult } from "../generated/api";
import { config, money } from "../../../lib/config";

export function cartValidationsGenerateRun(
  input: CartValidationsGenerateRunInput,
): CartValidationsGenerateRunResult {
  const c = config(input.validation.config?.jsonValue);

  if (
    !c ||
    typeof c.currency !== "string" ||
    (c.guests !== "limit" && c.guests !== "allow")
  )
    return { operations: [] };

  const maximum = money(c.maximum),
    amount = money(input.cart.cost.subtotalAmount.amount);

  if (
    maximum === undefined ||
    amount === undefined ||
    input.cart.cost.subtotalAmount.currencyCode !== c.currency ||
    input.cart.lines.length === 0
  )
    return { operations: [] };

  const customer = input.cart.buyerIdentity?.customer;

  if (customer ? customer.numberOfOrders > 0 : c.guests === "allow")
    return { operations: [] };

  return amount > maximum
    ? {
        operations: [
          {
            validationAdd: {
              errors: [
                {
                  message: "First-order subtotal exceeds the configured limit.",
                  target: "$.cart",
                },
              ],
            },
          },
        ],
      }
    : { operations: [] };
}
