import { cn } from "@/lib/utils"
import { SITE } from "@/lib/site"
import { V_TRAZO, V_VIEWBOX } from "./logo-v"

type LogoVProps = {
  /** Grosor del contorno, en unidades del viewBox. */
  grosor?: number
  className?: string
}

/**
 * Logotipo del header: la "V" del wordmark, contorneada sobre fondo blanco.
 *
 * Es la misma silueta que dibuja la pantalla de carga, pero acá va quieta y
 * solo con el trazo —sin relleno—, como queda al terminar de dibujarse.
 *
 * El cuadro blanco lleva `overflow-hidden` y la letra se dibuja con un margen
 * en el viewBox: sin eso el trazo se corta contra el borde del recuadro.
 */
export function LogoV({ grosor = 3.5, className }: LogoVProps) {
  const { x, y, width, height } = V_VIEWBOX

  return (
    <span
      className={cn(
        "bg-background border-border/70 grid aspect-square place-items-center overflow-hidden rounded-sm border",
        className
      )}
    >
      <svg
        viewBox={`${x} ${y} ${width} ${height}`}
        className="h-[72%] w-[72%]"
        role="img"
        aria-label={SITE.nombre}
      >
        <path
          d={V_TRAZO}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={grosor}
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}
