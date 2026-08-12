/**
 * Reglas comerciales de precio de la tienda.
 *
 * Son solo para MOSTRAR. El total que se cobra siempre se recalcula
 * en el server al hacer checkout, leyendo los precios de la base.
 */
export const DESCUENTO_TRANSFERENCIA = 0.2
export const CUOTAS_SIN_INTERES = 3

/** Porcentaje de descuento contra el precio de lista, redondeado. */
export function calcularPorcentajeOff(
  precio: number,
  precioLista: number | null
): number | null {
  if (!precioLista || precioLista <= precio) return null

  return Math.round(((precioLista - precio) / precioLista) * 100)
}

/** Precio abonando por transferencia o depósito bancario. */
export function calcularPrecioTransferencia(precio: number): number {
  return precio * (1 - DESCUENTO_TRANSFERENCIA)
}

/** Valor de cada cuota sin interés. */
export function calcularValorCuota(
  precio: number,
  cuotas: number = CUOTAS_SIN_INTERES
): number {
  return precio / cuotas
}
