"use client"

import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/shared/components/ui/button"
import { type Producto } from "@/features/catalogo/types"
import { useCarrito } from "../hooks/useCarrito"

type BotonAgregarProps = {
  producto: Producto
  cantidad?: number
  /** Ancho completo y tipografía más grande, para la ficha. */
  tamano?: "sm" | "lg"
  /**
   * `oscuro` usa el negro de la paleta en vez del azul de marca.
   *
   * El azul ya está en el header, las marquesinas, los `% OFF`, el precio por
   * transferencia y el footer: sumarlo también en el CTA de cada card deja la
   * página saturada. El negro es igual de contrastado y más sobrio.
   */
  variante?: "primario" | "oscuro"
  className?: string
}

/**
 * Agrega el producto al carrito.
 *
 * Guarda el precio solo como referencia visual: al hacer checkout se manda
 * `{ producto_id, cantidad }` y el server recalcula el total leyendo la base.
 */
export function BotonAgregar({
  producto,
  cantidad = 1,
  tamano = "sm",
  variante = "primario",
  className,
}: BotonAgregarProps) {
  const agregar = useCarrito((s) => s.agregar)
  const sinStock = producto.stock <= 0

  const alAgregar = () => {
    agregar(
      {
        producto_id: producto.id,
        slug: producto.slug,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen_url: producto.imagen_url,
      },
      cantidad
    )
    toast.success("Agregado a la bolsa", { description: producto.nombre })
  }

  return (
    <Button
      type="button"
      size={tamano === "lg" ? "lg" : "default"}
      disabled={sinStock}
      onClick={alAgregar}
      className={cn(
        variante === "oscuro" &&
          "bg-foreground text-background hover:bg-foreground/85",
        className
      )}
    >
      {sinStock ? "Sin stock" : "Comprar"}
    </Button>
  )
}
