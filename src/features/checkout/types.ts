export const ESTADOS_ORDEN = [
  "pendiente",
  "pagada",
  "enviada",
  "cancelada",
] as const

export type EstadoOrden = (typeof ESTADOS_ORDEN)[number]

export type Orden = {
  id: string
  numero_orden: number
  user_id: string | null
  estado: EstadoOrden
  total: number
  metodo_pago: string | null
  pago_id: string | null
  created_at: string
  updated_at: string
}

export type ItemOrden = {
  id: string
  orden_id: string
  producto_id: string
  cantidad: number
  /** Precio congelado al confirmar la orden. No cambia si el producto cambia. */
  precio_unitario: number
}

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string }
