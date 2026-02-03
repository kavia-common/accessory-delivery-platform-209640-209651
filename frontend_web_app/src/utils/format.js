// PUBLIC_INTERFACE
export function formatMoney(value) {
  /** Format number as USD money string. */
  const n = Number(value || 0);
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}
