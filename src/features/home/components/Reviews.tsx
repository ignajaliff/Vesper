import { BadgeCheck, Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { REVIEWS_MOCK } from "../reviews"

/**
 * Opiniones de producto en grilla fija.
 *
 * Sin carrusel a propósito: arrastrar para leer esconde la mitad del contenido
 * y obliga a interactuar. Cada reseña es una tarjeta sobria —cita en serif,
 * producto y compra verificada al pie— para que transmita confianza sin
 * parecer un widget pegado.
 *
 * ANDAMIAJE: los textos son inventados. Ver `reviews.ts`.
 */
export function Reviews() {
  return (
    <section aria-labelledby="reviews-titulo" className="bg-secondary border-t">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
        <header className="mx-auto mb-14 flex max-w-lg flex-col items-center text-center">
          <p className="eyebrow text-primary mb-3">Reseñas</p>

          <h2
            id="reviews-titulo"
            className="font-heading text-3xl leading-tight font-normal tracking-tight text-balance sm:text-4xl"
          >
            Quienes ya compraron
          </h2>

          <span aria-hidden className="filete mt-6" />
        </header>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS_MOCK.map((review) => (
            <li
              key={review.id}
              className="bg-background flex flex-col rounded-sm border p-6"
            >
              <div
                className="flex gap-0.5"
                role="img"
                aria-label={`${review.puntaje} de 5 estrellas`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    aria-hidden
                    className={cn(
                      "size-3.5",
                      i < review.puntaje
                        ? "fill-primary text-primary"
                        : "text-foreground/20"
                    )}
                    strokeWidth={1}
                  />
                ))}
              </div>

              <blockquote className="font-heading mt-5 flex-1 text-[0.9375rem] leading-relaxed text-pretty">
                {review.texto}
              </blockquote>

              <footer className="mt-6 space-y-3">
                <p className="text-muted-foreground text-xs italic">
                  {review.producto}
                </p>

                <div className="border-border/70 flex items-center justify-between border-t pt-3">
                  <div>
                    <p className="text-sm font-medium">{review.nombre}</p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {review.lugar}
                    </p>
                  </div>

                  <span
                    className="text-primary inline-flex items-center gap-1 text-[0.6875rem]"
                    title="Compra verificada"
                  >
                    <BadgeCheck className="size-3.5" strokeWidth={1.5} aria-hidden />
                    Verificada
                  </span>
                </div>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
