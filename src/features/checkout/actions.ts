"use server"

import { crearOrdenSchema } from "./schema"
import { type ActionResult } from "./types"

/**
 * Crea la orden. Flujo obligatorio (ver ecommerce-rules.txt):
 *
 *  1. Recibir del cliente solo { producto_id, cantidad } — nunca precios.
 *  2. Leer precios y stock actuales de la base.
 *  3. Validar stock disponible por ítem.
 *  4. Calcular el total EN EL SERVER.
 *  5. Insertar la orden en estado `pendiente` + items_orden con precio_unitario congelado.
 *  6. Crear la preferencia de Mercado Pago con ese total.
 *  7. Devolver el init_point para redirigir.
 *
 * El stock NO se descuenta acá: se descuenta cuando el webhook confirma el pago.
 */
export async function crearOrden(
  input: unknown
): Promise<ActionResult<{ init_point: string }>> {
  const parsed = crearOrdenSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: "Datos inválidos. Revisá el formulario." }
  }

  // TODO(supabase + mercadopago): implementar los pasos 2 a 7.
  return { ok: false, error: "El checkout todavía no está disponible." }
}
