import Link from "next/link"

import { MARCAS } from "@/lib/site"

/**
 * Marcas que trabajamos, en una cinta a todo el ancho bajo el hero.
 *
 * Cada marca lleva al catálogo filtrado. Misma mecánica que las marquesinas
 * del layout: la lista se repite y la pista se corre -50%, así el reinicio del
 * loop cae en un punto idéntico. Las máscaras laterales difuminan los extremos
 * para que los nombres entren y salgan sin cortarse de golpe.
 *
 * La animación se pausa al pasar el mouse, para poder apuntar a una marca.
 */
export function FranjaMarcas() {
  return (
    <section aria-label="Marcas que trabajamos" className="border-y py-8">
      <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        {/* Más lenta que las cintas del header: acá los nombres se leen, no
            son un rótulo de fondo. La duración pisa la de `marquesina-pista`. */}
        <ul
          className="marquesina-pista flex w-max items-center group-hover:[animation-play-state:paused]"
          style={{ animationDuration: "75s" }}
        >
          {[0, 1, 2, 3].map((copia) => (
            <li key={copia} aria-hidden={copia !== 0}>
              <ul className="flex items-center">
                {MARCAS.map((marca) => (
                  <li key={marca.nombre}>
                    <Link
                      href={marca.href}
                      tabIndex={copia === 0 ? undefined : -1}
                      className="font-heading text-foreground/45 hover:text-primary focus-visible:ring-ring block px-8 text-lg whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none sm:px-11 sm:text-xl"
                    >
                      {marca.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
