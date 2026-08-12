import { z } from "zod"

export const productoSchema = z
  .object({
    slug: z
      .string()
      .min(1, "Requerido")
      .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
    nombre: z.string().min(1, "Requerido").max(160, "Máximo 160 caracteres"),
    descripcion: z.string().max(2000, "Máximo 2000 caracteres").nullable(),
    precio: z.number().nonnegative("El precio no puede ser negativo"),
    precio_lista: z
      .number()
      .nonnegative("El precio de lista no puede ser negativo")
      .nullable(),
    stock: z.number().int("Debe ser un entero").min(0, "El stock no puede ser negativo"),
    activo: z.boolean(),
    imagen_url: z.url("URL inválida").nullable(),
    envio_gratis: z.boolean(),
  })
  .refine(
    (p) => p.precio_lista === null || p.precio_lista >= p.precio,
    {
      message: "El precio de lista no puede ser menor al precio de venta",
      path: ["precio_lista"],
    }
  )

export type ProductoInput = z.infer<typeof productoSchema>
