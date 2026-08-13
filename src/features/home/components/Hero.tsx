"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/shared/components/ui/button"
import { HERO_SLIDES } from "../slides"

const INTERVALO_AUTOPLAY = 6000

/**
 * Slider principal de la home: imagen full-width con titular, bajada y CTA
 * sobreimpresos en HTML (no quemados en la imagen), por SEO y accesibilidad.
 *
 * Las fotos de fondo son oscuras, así que el texto va en blanco sobre un velo
 * negro degradado. Un slide sin `imagenUrl` cae en el fondo tipográfico de
 * respaldo, que es claro y lleva su propio velo.
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
      className="bg-secondary relative isolate overflow-hidden"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      {/* Alto contenido: el header ya ocupa parte del viewport y abajo siguen
          los tres destacados, que también tienen que entrar en el primer scroll. */}
      <div className="relative h-[440px] w-full sm:h-[500px] lg:h-[560px]">
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} de ${total}`}
            aria-hidden={i !== actual}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              i === actual ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            {slide.imagenUrl ? (
              <Image
                src={slide.imagenUrl}
                alt=""
                fill
                /* Prioriza por URL, no por índice: un slide posterior puede
                   reusar la foto del primero y Next avisaría de un LCP sin
                   `priority` aunque ya esté precargada. */
                priority={slide.imagenUrl === HERO_SLIDES[0].imagenUrl}
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              /* Respaldo sin foto: azul oscuro de marca + inicial recortada.
                 Oscuro a propósito, para que el texto blanco siga leyéndose. */
              <div
                aria-hidden
                className="from-accent to-foreground absolute inset-0 bg-gradient-to-br"
              >
                <span className="font-heading absolute -right-8 bottom-[-14%] text-[26rem] leading-none text-white/[0.06] select-none sm:text-[34rem] lg:text-[40rem]">
                  {slide.titulo.charAt(0)}
                </span>
              </div>
            )}

            {/*
              Velo suave: solo el necesario para que el texto blanco tenga
              contraste. Se concentra a la izquierda, donde cae el titular, y se
              disipa hacia la derecha para dejar ver la foto y los frascos.
            */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent"
            />

            <div className="relative mx-auto flex h-full w-full max-w-6xl items-center px-4 sm:px-6">
              <div className="max-w-xl">
                {/* La sombra hace el trabajo que antes hacía el velo denso:
                    el texto se sostiene solo sobre las zonas claras de la foto. */}
                <p className="eyebrow text-white/85 [text-shadow:0_1px_8px_rgb(0_0_0/0.6)]">
                  Vesper
                </p>

                <h2 className="font-heading mt-4 text-3xl leading-[1.1] font-normal tracking-tight text-balance text-white [text-shadow:0_2px_16px_rgb(0_0_0/0.75)] sm:text-4xl lg:text-5xl">
                  {slide.titulo}
                </h2>

                <p className="mt-4 max-w-md text-sm leading-relaxed text-pretty text-white/95 [text-shadow:0_1px_10px_rgb(0_0_0/0.7)] sm:text-base">
                  {slide.bajada}
                </p>

                <Button
                  asChild
                  size="lg"
                  className="group/cta mt-6 rounded-none px-8"
                  tabIndex={i === actual ? undefined : -1}
                >
                  <Link href={slide.ctaHref}>
                    {slide.ctaLabel}
                    <ArrowRight className="transition-transform group-hover/cta:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}

        {total > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Anterior"
              onClick={anterior}
              className="absolute top-1/2 left-3 hidden -translate-y-1/2 rounded-none text-white hover:bg-white/15 hover:text-white sm:inline-flex"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Siguiente"
              onClick={siguiente}
              className="absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-none text-white hover:bg-white/15 hover:text-white sm:inline-flex"
            >
              <ChevronRight />
            </Button>

            {/* Filetes en vez de puntos: acompañan la voz editorial. */}
            <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
              {HERO_SLIDES.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => irA(i)}
                  aria-label={`Ir a la diapositiva ${i + 1}`}
                  aria-current={i === actual}
                  className={cn(
                    "h-px w-10 transition-all duration-500",
                    i === actual
                      ? "h-0.5 bg-white"
                      : "bg-white/40 hover:bg-white/70"
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
