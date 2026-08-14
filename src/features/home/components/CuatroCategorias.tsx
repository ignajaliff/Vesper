import Link from "next/link"
import { ArrowRight } from "lucide-react"

/**
 * Cuatro accesos por tipo de fragancia, entre la franja de marcas y los
 * carruseles de producto.
 *
 * Sin arte definitivo, cada bloque se resuelve con un degradado de la paleta y
 * una inicial gigante. Al tener las fotos, reemplazar el `div` de fondo por un
 * `<Image fill>`.
 *
 * Los `href` apuntan a `/productos` hasta que existan las páginas por
 * categoría: el mock no tiene los campos para filtrar.
 */
const CATEGORIAS = [
  {
    id: "nicho",
    titulo: "Nicho",
    href: "/productos",
    fondo: "from-accent/12 to-secondary",
  },
  {
    id: "disenador",
    titulo: "Diseñador",
    href: "/productos",
    fondo: "from-primary/10 to-accent/15",
  },
  {
    id: "arabe",
    titulo: "Árabe",
    href: "/productos",
    fondo: "from-secondary to-background",
  },
  {
    id: "decants",
    titulo: "Decants 2x1",
    href: "/productos",
    fondo: "from-accent/15 to-primary/10",
  },
] as const

export function CuatroCategorias() {
  return (
    <section
      aria-label="Categorías"
      className="mx-auto w-full max-w-[100rem] px-4 pt-6 pb-14 sm:px-6 lg:px-10"
    >
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CATEGORIAS.map(({ id, titulo, href, fondo }) => (
          <li key={id}>
            <Link
              href={href}
              className="group focus-visible:ring-ring relative block aspect-[4/3] overflow-hidden rounded-sm focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
            >
              <div
                aria-hidden
                className={`absolute inset-0 bg-gradient-to-br ${fondo} transition-transform duration-700 group-hover:scale-105`}
              >
                <span className="font-heading text-foreground/[0.06] absolute -right-4 -bottom-10 text-[10rem] leading-none select-none">
                  {titulo.charAt(0)}
                </span>
              </div>

              <div className="relative flex h-full flex-col justify-end p-5 sm:p-6">
                <h3 className="font-heading text-xl leading-tight font-normal tracking-tight text-balance sm:text-2xl">
                  {titulo}
                </h3>

                <span className="eyebrow mt-3 inline-flex items-center gap-1.5">
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
