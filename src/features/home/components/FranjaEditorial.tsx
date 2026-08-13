import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/shared/components/ui/button"

/**
 * Corte de ritmo entre las dos grillas de la home: bloque a sangre completa,
 * con fondo de arena y una cita de marca. Evita que la portada sea solo
 * catálogo apilado.
 */
export function FranjaEditorial() {
  return (
    <section className="bg-accent/8 relative isolate overflow-hidden border-y">
      {/* Marca de agua tipográfica, puramente decorativa. */}
      <span
        aria-hidden
        className="font-heading text-foreground/[0.04] pointer-events-none absolute -top-24 -left-10 text-[22rem] leading-none select-none sm:text-[30rem]"
      >
        V
      </span>

      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-28">
        <div>
          <p className="eyebrow text-destructive">Sobre Vesper</p>

          <h2 className="font-heading mt-5 text-3xl leading-[1.15] font-normal tracking-tight text-balance sm:text-4xl">
            Una fragancia no se elige por la etiqueta
          </h2>

          <span aria-hidden className="filete mt-6" />
        </div>

        <div className="space-y-6">
          <p className="text-muted-foreground text-[0.9375rem] leading-relaxed text-pretty">
            Trabajamos con casas árabes, de diseñador y selectivas, y probamos
            cada frasco antes de sumarlo al catálogo. Si una fragancia no nos
            convence en la piel, no entra.
          </p>

          <p className="text-muted-foreground text-[0.9375rem] leading-relaxed text-pretty">
            Por eso también vendemos decants: cinco mililitros alcanzan para
            saber si una fragancia es tuya, sin comprometer un frasco entero.
          </p>

          <Button asChild variant="link" className="group h-auto p-0">
            <Link href="/productos">
              Ver los decants
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
