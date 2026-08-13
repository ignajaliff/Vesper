import { Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { OPINIONES_GOOGLE, PUNTAJE_GOOGLE } from "../reviews"

/**
 * Opiniones de Google Maps.
 *
 * Grilla fija y sobria, sin la estética de widget de reseñas: cita en serif,
 * firma discreta y estrellas en el azul de marca (no el amarillo de Google,
 * que rompe la paleta). El objetivo es que transmita confianza sin parecer un
 * badge pegado.
 *
 * ANDAMIAJE: los textos son de ejemplo. Reemplazar por las reseñas reales
 * antes de publicar — mostrar opiniones inventadas como verificadas es
 * publicidad engañosa.
 */
export function OpinionesGoogle() {
  return (
    <section aria-labelledby="google-titulo" className="border-t">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
        <header className="mx-auto mb-14 flex max-w-lg flex-col items-center text-center">
          <p className="eyebrow text-primary mb-3">Opiniones en Google</p>

          <h2
            id="google-titulo"
            className="font-heading text-3xl leading-tight font-normal tracking-tight text-balance sm:text-4xl"
          >
            Lo que dicen de nosotros
          </h2>

          <div className="mt-6 flex items-center gap-3">
            <div
              className="flex gap-1"
              role="img"
              aria-label={`${PUNTAJE_GOOGLE.promedio} de 5 estrellas`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  aria-hidden
                  className="fill-primary text-primary size-4"
                  strokeWidth={1}
                />
              ))}
            </div>

            <p className="text-sm">
              <span className="font-medium">{PUNTAJE_GOOGLE.promedio}</span>
              <span className="text-muted-foreground">
                {" "}
                · {PUNTAJE_GOOGLE.total} opiniones
              </span>
            </p>
          </div>
        </header>

        <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {OPINIONES_GOOGLE.map((op) => (
            <li key={op.id} className="flex flex-col text-center">
              <div
                className="mx-auto flex gap-0.5"
                role="img"
                aria-label={`${op.puntaje} de 5 estrellas`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    aria-hidden
                    className={cn(
                      "size-3",
                      i < op.puntaje
                        ? "fill-primary text-primary"
                        : "text-foreground/20"
                    )}
                    strokeWidth={1}
                  />
                ))}
              </div>

              <blockquote className="font-heading mt-5 flex-1 text-[0.9375rem] leading-relaxed text-balance">
                {op.texto}
              </blockquote>

              <footer className="mt-5">
                <span aria-hidden className="filete mx-auto mb-4" />
                <p className="eyebrow text-muted-foreground">{op.nombre}</p>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
