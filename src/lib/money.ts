import content from "@/data/content";

/**
 * Shopify stores prices as integer minor units and renders them through a
 * template string such as "Rs.{{amount}}". This mirrors the `amount` filter:
 * two decimal places, comma thousands separators.
 */
export function formatMoney(cents: number, format = content.meta.moneyFormat): string {
  const amount = (Math.round(cents) / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return format.replace(/\{\{\s*amount\s*\}\}/g, amount);
}
