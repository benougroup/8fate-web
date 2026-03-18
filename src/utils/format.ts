/**
 * format.ts – shared formatting helpers.
 */


/**
 * formatPrice – format cents into currency string.
 * Example: formatPrice(999, "USD") => "$9.99"
 */
export function formatPrice(cents?: number, currency: string = "USD") {
  if (typeof cents !== "number") return "";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(cents / 100);
  } catch {
    return `$${(cents / 100).toFixed(2)}`;
  }
}


/**
 * formatDate – optional date formatting (short).
 */
export function formatDate(date: string | number | Date, opts?: Intl.DateTimeFormatOptions) {
  try {
    const d = new Date(date);
    return new Intl.DateTimeFormat(undefined, opts ?? { dateStyle: "medium" }).format(d);
  } catch {
    return String(date);
  }
}