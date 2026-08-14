"use client"

import { useCantidadCarrito } from "@/features/carrito/hooks/useCarrito"
import { useCantidadFavoritos } from "@/features/favoritos/hooks/useFavoritos"

/**
 * Globito con la cantidad de favoritos o de items en la bolsa.
 *
 * Los stores devuelven 0 hasta que `persist` rehidrata desde localStorage, así
 * que en el HTML del server el globito no existe y aparece al montar: sin eso
 * el marcado del server y el del cliente no coinciden.
 */
function Globito({ cantidad }: { cantidad: number }) {
  if (cantidad === 0) return null

  return (
    <span
      aria-hidden
      className="bg-primary text-primary-foreground absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-full px-1 text-[0.625rem] leading-4 font-medium tabular-nums"
    >
      {cantidad > 9 ? "9+" : cantidad}
    </span>
  )
}

export function ContadorFavoritos() {
  const cantidad = useCantidadFavoritos()
  return (
    <>
      <Globito cantidad={cantidad} />
      <span className="sr-only">
        {cantidad === 0
          ? "sin favoritos"
          : `${cantidad} ${cantidad === 1 ? "producto" : "productos"} en favoritos`}
      </span>
    </>
  )
}

export function ContadorCarrito() {
  const cantidad = useCantidadCarrito()
  return (
    <>
      <Globito cantidad={cantidad} />
      <span className="sr-only">
        {cantidad === 0
          ? "bolsa vacía"
          : `${cantidad} ${cantidad === 1 ? "producto" : "productos"} en la bolsa`}
      </span>
    </>
  )
}
