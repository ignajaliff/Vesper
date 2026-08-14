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
  productos: Producto[]
  /** CTA al otro extremo del encabezado. */
  verMasHref?: string
  cantidadPrioritaria?: number
}

/**
 * Sección de home: título + fila de productos desplazable.
 *
 * Muestra 4 productos por vista en desktop y se corre de a una página con las
 * flechas o arrastrando. Usa scroll nativo con `snap` en vez de una librería:
 * funciona sin JS, respeta el gesto táctil y no suma dependencias.
 *
 * Las flechas van **flotando sobre los extremos de la fila**, no en el
 * encabezado: quedan a la altura de las cards, que es donde el ojo las busca.
 */
export function CarruselProductos({
  titulo,
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

  /* Ambas flechas comparten posición y estilo: solo cambian de lado. */
  const claseFlecha =
    "bg-background/95 absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 rounded-full shadow-md backdrop-blur-sm disabled:pointer-events-none disabled:opacity-0 sm:flex"

  return (
    <section className="mx-auto w-full max-w-[100rem] px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
      {/*
        Título centrado con "Ver todo" a la derecha. Se resuelve con grid de
        tres columnas y una celda vacía a la izquierda, no con `justify-between`:
        así el título queda centrado respecto de la SECCIÓN y no del hueco que
        deja el CTA, que lo corría a la izquierda.
      */}
      <header className="mb-8 grid grid-cols-[1fr_auto_1fr] items-end gap-4">
        <span aria-hidden />

        <h2 className="font-heading text-center text-3xl leading-tight font-normal tracking-tight text-balance sm:text-[2rem]">
          {titulo}
        </h2>

        <div className="flex justify-end">
          {verMasHref && (
            <Button asChild variant="link" className="group h-auto p-0 text-sm">
              <Link href={verMasHref}>
                Ver todo
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          )}
        </div>
      </header>

      {/* `relative` ancla las flechas a los extremos de la fila. */}
      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          aria-label="Anterior"
          disabled={alInicio}
          onClick={() => mover(-1)}
          className={cn(claseFlecha, "-left-4 lg:-left-5")}
        >
          <ChevronLeft className="size-4" />
        </Button>

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
                // `flex` estira la card a la altura de la fila: sin eso, las
                // que tienen selector de ml quedan más altas que el resto.
                "flex shrink-0 snap-start",
                // 1.4 en mobile (la card cortada sugiere que hay más para el
                // costado), 2 en tablet, 4 en desktop y 5 en pantallas anchas:
                // con la sección a todo el ancho, 4 cards quedaban enormes.
                "w-[calc((100%-0.75rem)/1.4)] sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/4)] xl:w-[calc((100%-4rem)/5)]"
              )}
            >
              <ProductoCard
                producto={producto}
                prioridad={i < cantidadPrioritaria}
              />
            </li>
          ))}
        </ul>

        <Button
          variant="outline"
          size="icon"
          aria-label="Siguiente"
          disabled={alFinal}
          onClick={() => mover(1)}
          className={cn(claseFlecha, "-right-4 lg:-right-5")}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </section>
  )
}
