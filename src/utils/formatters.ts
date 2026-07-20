/**
 * Utility function to format prices in Nigerian Naira (₦)
 */
export function formatPrice(amount: number): string {
  if (isNaN(amount)) return "₦0";
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format currency with 2 decimal places fixed
 */
export function formatPriceExact(amount: number): string {
  if (isNaN(amount)) return "₦0.00";
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
