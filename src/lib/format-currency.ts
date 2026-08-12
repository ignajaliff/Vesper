const FORMATO_MONEDA = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/**
 * Formato de moneda centralizado. Único lugar donde se define cómo se ve un precio.
 */
export function formatCurrency(valor: number): string {
  return FORMATO_MONEDA.format(valor)
}
