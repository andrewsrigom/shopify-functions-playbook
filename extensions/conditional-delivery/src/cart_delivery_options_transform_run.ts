import type { CartDeliveryOptionsTransformRunInput } from "../generated/input";
import type { CartDeliveryOptionsTransformRunResult } from "../generated/api";
import { config, gid } from "../../../lib/config";

export function cartDeliveryOptionsTransformRun(
  input: CartDeliveryOptionsTransformRunInput,
): CartDeliveryOptionsTransformRunResult {
  const c = config(input.deliveryCustomization.config?.jsonValue);

  if (
    !c ||
    typeof c.hideTitle !== "string" ||
    !c.hideTitle ||
    c.hideTitle.length > 100 ||
    typeof c.preferredTitle !== "string" ||
    !c.preferredTitle ||
    c.preferredTitle.length > 100 ||
    !Array.isArray(c.restrictedVariantIds) ||
    c.restrictedVariantIds.length > 50 ||
    !c.restrictedVariantIds.every((id: unknown) => gid(id, "ProductVariant")) ||
    !Array.isArray(c.blockedCountries) ||
    c.blockedCountries.length > 50 ||
    !c.blockedCountries.every(
      (country: unknown) =>
        typeof country === "string" && /^[A-Z]{2}$/.test(country),
    )
  ) {
    return { operations: [] };
  }

  const restricted = new Set(c.restrictedVariantIds);
  const countries = new Set(c.blockedCountries);
  const operations: CartDeliveryOptionsTransformRunResult["operations"] = [];

  for (const group of input.cart.deliveryGroups) {
    if (group.cartLines.length === 0) continue;

    const blocked =
      countries.has(group.deliveryAddress?.countryCode) ||
      group.cartLines.some(
        (line) =>
          line.merchandise.__typename === "ProductVariant" &&
          restricted.has(line.merchandise.id),
      );
    const hidden = blocked
      ? group.deliveryOptions.filter((option) => option.title === c.hideTitle)
      : [];
    // Leave the group unchanged when the rule would remove every available option.
    if (hidden.length > 0 && hidden.length === group.deliveryOptions.length)
      continue;

    for (const option of hidden) {
      operations.push({
        deliveryOptionHide: { deliveryOptionHandle: option.handle },
      });
    }

    const remaining = group.deliveryOptions.filter(
      (option) => !hidden.includes(option),
    );
    const preferred = remaining.findIndex(
      (option) => option.title === c.preferredTitle,
    );

    if (preferred > 0) {
      const option = remaining[preferred];

      if (option)
        operations.push({
          deliveryOptionMove: { deliveryOptionHandle: option.handle, index: 0 },
        });
    }
  }

  return { operations };
}
