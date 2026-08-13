import Link from "next/link"
import { ArrowRight } from "lucide-react"

/**
 * Tres accesos visuales bajo el hero (colección, promo y novedades).
 *
 * Sin arte definitivo, cada bloque se resuelve con un degradado de la paleta y
 * una inicial gigante, igual que el hero. Al tener las fotos, reemplazar el
 * `div` de fondo por un `<Image fill>`.
 */
const DESTACADOS = [
  {
    id: "masculinas",
    ojal: "Colección",
    titulo: "Masculinas",
    bajada: "Amaderadas, especiadas y de estela larga.",
    href: "/productos",
    fondo: "from-accent/12 to-secondary",
  },
  {
    id: "decants",
    ojal: "3x2",
    titulo: "Decants",
    bajada: "Llevá tres de 5 ml y pagá dos.",
    href: "/productos",
    fondo: "from-secondary to-background",
  },
  {
    id: "novedades",
    ojal: "Recién llegados",
    titulo: "Novedades",
    bajada: "Lo último que entró al depósito.",
    href: "/productos",
    fondo: "from-primary/10 to-accent/15",
  },
] as const

export function TresDestacados() {
  return (
    <section
      aria-label="Colecciones destacadas"
      className="mx-auto w-full max-w-6xl px-4 pt-2 pb-14 sm:px-6"
    >
      <ul className="grid gap-4 md:grid-cols-3">
        {DESTACADOS.map(({ id, ojal, titulo, bajada, href, fondo }) => (
          <li key={id}>
            <Link
              href={href}
              className="group focus-visible:ring-ring relative block aspect-[4/5] overflow-hidden rounded-sm focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none md:aspect-[3/4]"
            >
              <div
                aria-hidden
                className={`absolute inset-0 bg-gradient-to-br ${fondo} transition-transform duration-700 group-hover:scale-105`}
              >
                <span className="font-heading text-foreground/[0.06] absolute -right-6 -bottom-16 text-[16rem] leading-none select-none">
                  {titulo.charAt(0)}
                </span>
              </div>

              <div className="relative flex h-full flex-col justify-end p-7">
                <p className="eyebrow text-destructive">{ojal}</p>

                <h3 className="font-heading mt-2.5 text-3xl leading-tight font-normal tracking-tight">
                  {titulo}
                </h3>

                <p className="text-muted-foreground mt-2 text-sm text-pretty">
                  {bajada}
                </p>

                <span className="eyebrow mt-5 inline-flex items-center gap-1.5">
                  Ver más
                  <ArrowRight
                    className="size-3.5 transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
