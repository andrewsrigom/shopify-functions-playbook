import type { CartPaymentMethodsTransformRunInput } from "../generated/input";
import type { CartPaymentMethodsTransformRunResult } from "../generated/api";
import { config, money } from "../../../lib/config";

export function cartPaymentMethodsTransformRun(
  input: CartPaymentMethodsTransformRunInput,
): CartPaymentMethodsTransformRunResult {
  const c = config(input.paymentCustomization.config?.jsonValue);

  if (
    !c ||
    typeof c.currency !== "string" ||
    typeof c.methodName !== "string" ||
    !c.methodName ||
    input.cart.lines.length === 0
  )
    return { operations: [] };

  const threshold = money(c.maximum),
    amount = money(input.cart.cost.totalAmount.amount);

  if (
    threshold === undefined ||
    amount === undefined ||
    amount <= threshold ||
    input.cart.cost.totalAmount.currencyCode !== c.currency
  )
    return { operations: [] };

  return {
    operations: input.paymentMethods
      .filter((method) => method.name === c.methodName)
      .map((method) => ({ paymentMethodHide: { paymentMethodId: method.id } })),
  };
}
