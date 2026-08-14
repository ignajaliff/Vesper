"use client"

import { Heart } from "lucide-react"

import { cn } from "@/lib/utils"
import { useEsFavorito, useFavoritos } from "../hooks/useFavoritos"

type BotonFavoritoProps = {
  productoId: string
  /** Nombre del producto, para el rótulo accesible. */
  nombre: string
  className?: string
}

/**
 * Corazón de favoritos.
 *
 * Client Component chico y aislado a propósito: así `ProductoCard` y la ficha
 * siguen siendo Server Components y solo este botón viaja al navegador.
 */
export function BotonFavorito({
  productoId,
  nombre,
  className,
}: BotonFavoritoProps) {
  const esFavorito = useEsFavorito(productoId)
  const alternar = useFavoritos((s) => s.alternar)

  return (
    <button
      type="button"
      onClick={() => alternar(productoId)}
      aria-pressed={esFavorito}
      aria-label={
        esFavorito ? `Quitar ${nombre} de favoritos` : `Agregar ${nombre} a favoritos`
      }
      className={cn(
        "focus-visible:ring-ring grid size-8 place-items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none",
        "bg-background/85 hover:bg-background backdrop-blur-sm",
        className
      )}
    >
      <Heart
        className={cn(
          "size-4 transition-all",
          esFavorito ? "fill-destructive text-destructive" : "text-foreground"
        )}
        strokeWidth={1.75}
        aria-hidden
      />
    </button>
  )
}
