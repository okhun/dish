export function formatPrice(value: number, fraction: number = 2): string {
  if (value === 0) return "0";
  if (value === null || value === undefined) return "0.0";
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  })
    .format(value)
    .replace(/,/g, " ");
}
