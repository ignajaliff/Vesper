import { z } from "zod"

/**
 * El cliente envía SOLO producto_id y cantidad.
 * Nunca precios ni totales: eso se lee y calcula en el server.
 */
export const itemCheckoutSchema = z.object({
  producto_id: z.uuid("Producto inválido"),
  cantidad: z.number().int("Debe ser un entero").positive("Debe ser mayor a 0"),
})

export const crearOrdenSchema = z.object({
  items: z.array(itemCheckoutSchema).min(1, "El carrito está vacío"),
  email: z.email("Email inválido"),
  nombre: z.string().min(1, "Requerido"),
  telefono: z.string().min(6, "Teléfono inválido"),
  direccion: z.string().min(1, "Requerido"),
  ciudad: z.string().min(1, "Requerido"),
  codigo_postal: z.string().min(1, "Requerido"),
})

export type CrearOrdenInput = z.infer<typeof crearOrdenSchema>
