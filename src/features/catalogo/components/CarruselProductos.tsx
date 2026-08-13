"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/shared/components/ui/button"
import { type Producto } from "../types"
import { ProductoCard } from "./ProductoCard"

type CarruselProductosProps = {
  titulo: string
  /** Versalita sobre el título ("Selección", "Temporada"). */
  ojal?: string
  descripcion?: string
  productos: Producto[]
  /** CTA al final del encabezado. */
  verMasHref?: string
  cantidadPrioritaria?: number
}

/**
 * Sección de home: encabezado editorial + fila de productos desplazable.
 *
 * Muestra 4 productos por vista en desktop y se corre de a una página con las
 * flechas o arrastrando. Usa scroll nativo con `snap` en vez de una librería:
 * funciona sin JS, respeta el gesto táctil y no suma dependencias.
 */
export function CarruselProductos({
  titulo,
  ojal,
  descripcion,
  productos,
  verMasHref,
  cantidadPrioritaria = 0,
}: CarruselProductosProps) {
  const pista = useRef<HTMLUListElement>(null)
  const [alInicio, setAlInicio] = useState(true)
  const [alFinal, setAlFinal] = useState(false)

  /** Habilita o deshabilita las flechas según la posición del scroll. */
  const revisarBordes = useCallback(() => {
    const el = pista.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setAlInicio(el.scrollLeft <= 1)
    setAlFinal(el.scrollLeft >= max - 1)
  }, [])

  useEffect(() => {
    const el = pista.current
    if (!el) return

    revisarBordes()
    el.addEventListener("scroll", revisarBordes, { passive: true })
    window.addEventListener("resize", revisarBordes)
    return () => {
      el.removeEventListener("scroll", revisarBordes)
      window.removeEventListener("resize", revisarBordes)
    }
  }, [revisarBordes])

  /** Corre una página completa (el ancho visible de la pista). */
  const mover = (sentido: 1 | -1) => {
    const el = pista.current
    if (!el) return
    el.scrollBy({ left: sentido * el.clientWidth, behavior: "smooth" })
  }

  if (productos.length === 0) return null

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          {ojal && <p className="eyebrow text-primary mb-2.5">{ojal}</p>}

          <h2 className="font-heading text-3xl leading-tight font-normal tracking-tight text-balance sm:text-[2rem]">
            {titulo}
          </h2>

          {descripcion && (
            <p className="text-muted-foreground mt-2.5 max-w-md text-sm leading-relaxed text-pretty">
              {descripcion}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {verMasHref && (
            <Button asChild variant="link" className="group h-auto p-0 text-sm">
              <Link href={verMasHref}>
                Ver todo
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          )}

          {/* Flechas: solo desktop. En táctil se arrastra. */}
          <div className="ml-2 hidden gap-1.5 sm:flex">
            <Button
              variant="outline"
              size="icon"
              aria-label="Anterior"
              disabled={alInicio}
              onClick={() => mover(-1)}
              className="size-9 rounded-full"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Siguiente"
              disabled={alFinal}
              onClick={() => mover(1)}
              className="size-9 rounded-full"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <ul
        ref={pista}
        /* `snap-x` alinea cada card al detener el arrastre. El scrollbar se
           oculta pero el scroll sigue siendo nativo y accesible. */
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {productos.map((producto, i) => (
          <li
            key={producto.id}
            className={cn(
              "shrink-0 snap-start",
              // 4 por vista en desktop, 2 en tablet, 1.4 en mobile (la card
              // cortada sugiere que hay más para el costado).
              "w-[calc((100%-0.75rem)/1.4)] sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/4)]"
            )}
          >
            <ProductoCard
              producto={producto}
              prioridad={i < cantidadPrioritaria}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
