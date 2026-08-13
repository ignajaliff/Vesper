"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import Link from "next/link"

import { NAV_PRINCIPAL } from "@/lib/site"
import { cn } from "@/lib/utils"

type NavPrincipalProps = {
  className?: string
}

/**
 * `pointer: fine` = puntero preciso (mouse/trackpad), no dedo. Se evalúa una
 * sola vez por módulo; en el server el objeto no existe y el snapshot devuelve
 * `false`, así que el HTML inicial nunca asume hover.
 */
const MQ_PUNTERO_FINO =
  typeof window === "undefined"
    ? ({ matches: false } as MediaQueryList)
    : window.matchMedia("(hover: hover) and (pointer: fine)")

function suscribirsePuntero(alCambiar: () => void) {
  MQ_PUNTERO_FINO.addEventListener?.("change", alCambiar)
  return () => MQ_PUNTERO_FINO.removeEventListener?.("change", alCambiar)
}

/** Ancho máximo estimado del panel, para acotarlo contra los bordes. */
const MAX_PANEL = 460
/** Aire mínimo entre el panel y el borde de la pantalla. */
const MARGEN = 16

/**
 * Barra de categorías del header con panel desplegable.
 *
 * Con mouse el panel se abre al pasar por encima; en pantallas táctiles, donde
 * el hover no existe, se abre por clic (si no, el primer toque abriría el menú
 * en vez de navegar). Cierra con Escape, con clic afuera o al navegar.
 */
export function NavPrincipal({ className }: NavPrincipalProps) {
  const [abierto, setAbierto] = useState<string | null>(null)
  /** Centro horizontal del botón activo, relativo al contenedor. */
  const [centro, setCentro] = useState(0)
  const contenedor = useRef<HTMLDivElement>(null)
  /** Retardo al salir: cruzar el hueco botón→panel no debe cerrarlo. */
  const cierrePendiente = useRef<ReturnType<typeof setTimeout> | null>(null)

  /*
   * `useSyncExternalStore` en vez de estado + efecto: es la API pensada para
   * leer de una fuente externa (acá, un media query) sin renders en cascada.
   * En el server devuelve `false`, así que el HTML inicial sale sin hover.
   */
  const hayMouse = useSyncExternalStore(
    suscribirsePuntero,
    () => MQ_PUNTERO_FINO.matches,
    () => false
  )

  useEffect(() => {
    if (abierto === null) return

    const alApretarTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(null)
    }
    const alClickear = (e: MouseEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(null)
    }

    document.addEventListener("keydown", alApretarTecla)
    document.addEventListener("mousedown", alClickear)
    return () => {
      document.removeEventListener("keydown", alApretarTecla)
      document.removeEventListener("mousedown", alClickear)
    }
  }, [abierto])

  // Limpia el timer pendiente si el componente se desmonta a mitad de camino.
  useEffect(() => () => {
    if (cierrePendiente.current) clearTimeout(cierrePendiente.current)
  }, [])

  /**
   * Abre el panel y lo ancla al centro del botón que lo disparó.
   *
   * La posición se mide contra el contenedor (no contra el viewport) porque el
   * panel es `absolute` dentro de él. Después se recorta a los márgenes de la
   * pantalla para que un ítem del borde no lo empuje fuera de vista.
   */
  const abrir = (label: string, disparador: HTMLElement) => {
    if (cierrePendiente.current) clearTimeout(cierrePendiente.current)

    const caja = contenedor.current?.getBoundingClientRect()
    if (caja) {
      const boton = disparador.getBoundingClientRect()
      const centroEnPantalla = boton.left + boton.width / 2

      /*
       * El panel se centra sobre el botón, pero un ítem del borde (SALE) lo
       * empujaría fuera de la pantalla. Se acota el centro para que la tarjeta
       * —de ancho MAX_PANEL como máximo— entre siempre con su margen.
       */
      const mitad = Math.min(MAX_PANEL, window.innerWidth - MARGEN * 2) / 2
      const acotado = Math.min(
        Math.max(centroEnPantalla, mitad + MARGEN),
        window.innerWidth - mitad - MARGEN
      )

      setCentro(acotado - caja.left)
    }

    setAbierto(label)
  }

  const programarCierre = () => {
    if (cierrePendiente.current) clearTimeout(cierrePendiente.current)
    cierrePendiente.current = setTimeout(() => setAbierto(null), 120)
  }

  /*
   * `relative` es obligatorio: el panel se posiciona con `absolute top-full`
   * y sin un ancestro posicionado acá se anclaba al <header> sticky, quedando
   * al pie de todo el header y tapado por la marquesina de beneficios.
   */
  return (
    <div
      ref={contenedor}
      className={cn("relative", className)}
      onMouseLeave={hayMouse ? programarCierre : undefined}
    >
      <nav aria-label="Navegación principal">
        <ul className="flex items-center justify-center gap-7">
          {NAV_PRINCIPAL.map((item) => {
            const estaAbierto = abierto === item.label
            const esSale = item.label === "SALE"

            return (
              <li key={item.label}>
                {item.panel ? (
                  <button
                    type="button"
                    aria-expanded={estaAbierto}
                    onMouseEnter={
                      hayMouse
                        ? (e) => abrir(item.label, e.currentTarget)
                        : undefined
                    }
                    onFocus={(e) => abrir(item.label, e.currentTarget)}
                    onClick={(e) =>
                      estaAbierto
                        ? setAbierto(null)
                        : abrir(item.label, e.currentTarget)
                    }
                    className={cn(
                      "eyebrow relative py-3 transition-colors after:absolute after:bottom-2 after:left-0 after:h-px after:bg-current after:transition-all",
                      esSale ? "text-destructive" : "text-foreground/70",
                      "hover:text-foreground",
                      estaAbierto
                        ? "text-foreground after:w-full"
                        : "after:w-0 hover:after:w-full"
                    )}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    /* Un ítem sin panel también cierra el que esté abierto:
                       si no, pasar de "Productos" a "Inicio" lo dejaba colgado. */
                    onMouseEnter={hayMouse ? () => setAbierto(null) : undefined}
                    onFocus={() => setAbierto(null)}
                    className="eyebrow text-foreground/70 hover:text-foreground relative py-3 transition-colors after:absolute after:bottom-2 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all hover:after:w-full"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Panel a lo ancho del header: se despliega bajo la barra de categorías. */}
      {NAV_PRINCIPAL.map((item) =>
        item.panel && abierto === item.label ? (
          <div
            key={item.label}
            /*
             * Tarjeta acotada anclada al botón que la abrió: `left` sale de la
             * posición medida y `-translate-x-1/2` la centra sobre él. `z-20`
             * la pone sobre la marquesina, que va después en el DOM.
             */
            style={{ left: `${centro}px` }}
            className="bg-background animate-in fade-in slide-in-from-top-1 absolute top-full z-20 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-b-sm border border-t-0 shadow-lg duration-200"
          >
            <div
              className={cn(
                "grid gap-x-10 gap-y-7 px-8 py-7",
                item.panel.length > 1 ? "grid-cols-2" : "grid-cols-1"
              )}
            >
              {item.panel.map((columna) => (
                <div key={columna.titulo} className="min-w-40">
                  <p className="eyebrow text-primary mb-3.5">{columna.titulo}</p>
                  <ul className="space-y-2">
                    {columna.items.map((sub) => (
                      <li key={sub.label}>
                        <Link
                          href={sub.href}
                          onClick={() => setAbierto(null)}
                          className="text-muted-foreground hover:text-foreground block text-sm whitespace-nowrap transition-colors"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null
      )}
    </div>
  )
}
