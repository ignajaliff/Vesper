"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/shared/components/ui/button"
import { HERO_SLIDES } from "../slides"

const INTERVALO_AUTOPLAY = 6000

/**
 * Slider principal de la home: imagen full-width con titular, bajada y CTA
 * sobreimpresos en HTML (no quemados en la imagen), por SEO y accesibilidad.
 */
export function Hero() {
  const [actual, setActual] = useState(0)
  const [pausado, setPausado] = useState(false)
  const total = HERO_SLIDES.length

  const irA = useCallback((i: number) => setActual((i + total) % total), [total])
  const siguiente = useCallback(() => irA(actual + 1), [actual, irA])
  const anterior = useCallback(() => irA(actual - 1), [actual, irA])

  useEffect(() => {
    if (pausado || total <= 1) return

    const id = setInterval(siguiente, INTERVALO_AUTOPLAY)
    return () => clearInterval(id)
  }, [pausado, siguiente, total])

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Promociones destacadas"
      className="bg-muted relative isolate overflow-hidden"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      <div className="relative h-[420px] w-full sm:h-[500px] lg:h-[560px]">
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} de ${total}`}
            aria-hidden={i !== actual}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              i === actual ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            {slide.imagenUrl && (
              <Image
                src={slide.imagenUrl}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            )}

            {/* Vela para que el texto se lea sobre cualquier imagen. */}
            <div
              aria-hidden
              className="from-background/90 via-background/60 absolute inset-0 bg-gradient-to-r to-transparent"
            />

            <div className="relative mx-auto flex h-full w-full max-w-6xl items-center px-4 sm:px-6">
              <div className="max-w-lg space-y-5">
                <h2 className="text-3xl leading-tight font-medium text-balance sm:text-4xl lg:text-5xl">
                  {slide.titulo}
                </h2>
                <p className="text-muted-foreground text-base text-pretty">
                  {slide.bajada}
                </p>
                <Button asChild size="lg" tabIndex={i === actual ? undefined : -1}>
                  <Link href={slide.ctaHref}>{slide.ctaLabel}</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}

        {total > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              aria-label="Anterior"
              onClick={anterior}
              className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Siguiente"
              onClick={siguiente}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full"
            >
              <ChevronRight />
            </Button>

            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
              {HERO_SLIDES.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => irA(i)}
                  aria-label={`Ir a la diapositiva ${i + 1}`}
                  aria-current={i === actual}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === actual ? "bg-foreground w-6" : "bg-foreground/30 w-2"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
