"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"

import { BotonAgregar } from "@/features/carrito/components/BotonAgregar"
import { Button } from "@/shared/components/ui/button"
import { type Producto } from "../types"

/**
 * Cantidad + botón de compra de la ficha.
 *
 * La cantidad se topea contra el stock: sin ese límite se puede mandar al
 * carrito más unidades de las que hay, y el error recién aparecería al pagar.
 * El server igual revalida stock al confirmar la orden — esto es solo UX.
 */
export function CompraProducto({ producto }: { producto: Producto }) {
  const [cantidad, setCantidad] = useState(1)
  const sinStock = producto.stock <= 0
  const tope = Math.max(1, producto.stock)

  if (sinStock) {
    return (
      <div className="mt-8">
        <Button size="lg" disabled className="w-full rounded-none">
          Sin stock
        </Button>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <p className="eyebrow text-muted-foreground mb-3">Cantidad</p>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-sm border">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Quitar una unidad"
            disabled={cantidad <= 1}
            onClick={() => setCantidad((c) => Math.max(1, c - 1))}
            className="size-11 rounded-none"
          >
            <Minus className="size-4" />
          </Button>

          <span
            aria-live="polite"
            className="w-12 text-center text-sm font-medium tabular-nums"
          >
            {cantidad}
          </span>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Agregar una unidad"
            disabled={cantidad >= tope}
            onClick={() => setCantidad((c) => Math.min(tope, c + 1))}
            className="size-11 rounded-none"
          >
            <Plus className="size-4" />
          </Button>
        </div>

        <BotonAgregar
          producto={producto}
          cantidad={cantidad}
          tamano="lg"
          variante="oscuro"
          className="h-11 min-w-48 flex-1 rounded-none"
        />
      </div>

      <p className="text-muted-foreground mt-3 text-xs">
        {producto.stock <= 5
          ? `Quedan ${producto.stock} unidades`
          : "Stock disponible"}
      </p>
    </div>
  )
}
