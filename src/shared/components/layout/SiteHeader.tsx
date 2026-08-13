"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, User } from "lucide-react"

import { ANUNCIOS, MARQUESINA, SITE } from "@/lib/site"
import { cn } from "@/lib/utils"
import { Button } from "@/shared/components/ui/button"
import { Buscador } from "./Buscador"
import { Marquesina } from "./Marquesina"
import { MobileNav } from "./MobileNav"
import { NavPrincipal } from "./NavPrincipal"

/** Scroll a partir del cual el header se compacta. */
const UMBRAL_COMPACTO = 40

export function SiteHeader() {
  const [compacto, setCompacto] = useState(false)

  useEffect(() => {
    const alScrollear = () => setCompacto(window.scrollY > UMBRAL_COMPACTO)

    alScrollear()
    window.addEventListener("scroll", alScrollear, { passive: true })
    return () => window.removeEventListener("scroll", alScrollear)
  }, [])

  return (
    <>
      {/*
       * Cinta de anuncios: hermana del header, no hija.
       *
       * `position: sticky` solo se mueve dentro de su padre, así que el sticky
       * tiene que ser el propio <header>. Con la cinta adentro, al colapsar a
       * `h-0` su contenido no entraba y quedaba pujando contra el borde: ese
       * era el "trabado". Afuera, simplemente se va con el scroll.
       */}
      <Marquesina
        etiqueta="Anuncios"
        mensajes={ANUNCIOS}
        duracion={45}
        separador
        className="bg-marca-profundo text-white"
      />

      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/85 sticky top-0 z-50 backdrop-blur">
        {/* Fila 1: logo + buscador + acciones. */}
        <div
          className={cn(
            "mx-auto flex w-full max-w-6xl items-center gap-4 px-4 transition-[height] duration-300 sm:px-6",
            compacto ? "h-16" : "h-24"
          )}
        >
          <MobileNav />

          <Link
            href="/"
            aria-label={`${SITE.nombre} — ir al inicio`}
            className="focus-visible:ring-ring shrink-0 rounded-sm focus-visible:ring-2 focus-visible:outline-none"
          >
            <Image
              src="/vesper-logo.png"
              alt={SITE.nombre}
              width={440}
              height={154}
              priority
              /* El azul del wordmark (#104FAC) es el primary de la marca:
                 va sin filtros de color. */
              className={cn(
                "w-auto transition-[height] duration-300",
                compacto ? "h-8" : "h-10 sm:h-12"
              )}
            />
          </Link>

          <Buscador className="mx-auto hidden w-full max-w-md md:block" />

          {/* Accesos: solo íconos, sin rótulo. El `aria-label` los nombra. */}
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <Button
              asChild
              variant="ghost"
              size="icon"
              aria-label="Favoritos"
              className="hover:text-primary size-11 rounded-sm"
            >
              <Link href="/favoritos">
                <Heart className="size-[1.375rem]" strokeWidth={1.5} />
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon"
              aria-label="Mi cuenta"
              className="hover:text-primary size-11 rounded-sm"
            >
              <Link href="/auth/login">
                <User className="size-[1.375rem]" strokeWidth={1.5} />
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon"
              aria-label="Ver carrito"
              className="hover:text-primary size-11 rounded-sm"
            >
              <Link href="/carrito">
                <ShoppingBag className="size-[1.375rem]" strokeWidth={1.5} />
              </Link>
            </Button>
          </div>
        </div>

        {/* Fila 2: categorías con panel desplegable (solo desktop). */}
        <NavPrincipal className="hidden border-t md:block" />

        {/* El buscador baja a su propia fila en mobile. */}
        <div className="border-t px-4 py-2.5 md:hidden">
          <Buscador className="mx-auto w-full max-w-6xl" />
        </div>

      </header>

      {/*
       * Cinta de beneficios: FUERA del sticky, igual que la de anuncios. Las
       * dos barras publicitarias se van con el scroll y solo queda fijo el
       * header. Va en sentido contrario y a otra velocidad que la de anuncios,
       * para que las dos nunca se lean sincronizadas.
       */}
      <Marquesina
        etiqueta="Beneficios"
        mensajes={MARQUESINA}
        duracion={38}
        sentido="derecha"
        className="bg-foreground text-background"
      />
    </>
  )
}
