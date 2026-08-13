import { cn } from "@/lib/utils"

type MarquesinaProps = {
  /** Mensajes de la cinta. Se repiten hasta llenar el ancho. */
  mensajes: readonly string[]
  /** Segundos que tarda una vuelta completa. Menos = más rápido. */
  duracion?: number
  /** Sentido del desplazamiento. Por defecto va hacia la izquierda. */
  sentido?: "izquierda" | "derecha"
  /** Punto separador entre mensajes. */
  separador?: boolean
  className?: string
  /** Rótulo accesible del bloque. */
  etiqueta: string
}

/**
 * Cinta de texto que se desplaza en loop continuo.
 *
 * La lista se renderiza cuatro veces y la animación corre la pista -50%: como
 * la segunda mitad es idéntica a la primera, el reinicio cae en un punto
 * exacto y no se ve el corte. Cuatro copias (no dos) para que la pista supere
 * el ancho de pantallas anchas y nunca queden huecos.
 *
 * Es Server Component: no necesita estado, solo CSS.
 */
export function Marquesina({
  mensajes,
  duracion = 32,
  sentido = "izquierda",
  separador = false,
  className,
  etiqueta,
}: MarquesinaProps) {
  return (
    <section
      aria-label={etiqueta}
      className={cn("overflow-hidden py-2.5", className)}
    >
      <div
        className={cn(
          "flex w-max",
          sentido === "izquierda" ? "marquesina-pista" : "marquesina-pista-inv"
        )}
        style={{ animationDuration: `${duracion}s` }}
      >
        {[0, 1, 2, 3].map((copia) => (
          <ul
            key={copia}
            /* Solo la primera copia se anuncia: el resto es repetición visual. */
            aria-hidden={copia !== 0}
            className="flex shrink-0 items-center"
          >
            {/* Key por índice a propósito: la lista es estática y `mensaje`
                colisionaría si alguna cinta repitiera un texto. */}
            {mensajes.map((mensaje, i) => (
              <li key={i} className="flex items-center">
                <span
                  className={cn(
                    "text-xs whitespace-nowrap sm:text-sm",
                    separador ? "px-5 sm:px-6" : "px-10 sm:px-14"
                  )}
                >
                  {mensaje}
                </span>
                {separador && (
                  <span aria-hidden className="opacity-50">
                    •
                  </span>
                )}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}
