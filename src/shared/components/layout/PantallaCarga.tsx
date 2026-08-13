import { SITE } from "@/lib/site"
import {
  LOGO_RELLENO,
  LOGO_SILUETAS,
  LOGO_TRAZOS,
  LOGO_VIEWBOX,
} from "./logo-trazos"

/*
 * Mismos tiempos que `CargaInicial`: las dos pantallas tienen que verse igual,
 * una en navegación interna y la otra al recargar.
 */
/** Retardo entre trazo y trazo, para que se dibujen en orden. */
const PASO = 300
/** Cuánto tarda cada trazo (coincide con la utilidad `logo-trazo`). */
const DURACION_TRAZO = 2200
/** Momento en que entra el relleno sólido. */
const INICIO_RELLENO = LOGO_SILUETAS * PASO + DURACION_TRAZO - 850

/**
 * Retardo de cada contorno.
 *
 * Las siluetas van escalonadas; los ojos internos arrancan **a la vez que su
 * silueta**, no después, para que la línea del medio se dibuje junto con la
 * letra y no aparezca como un paso aparte al final.
 */
function retardo(i: number) {
  return (i < LOGO_SILUETAS ? i : i - LOGO_SILUETAS) * PASO
}

/**
 * Pantalla de carga: el wordmark se dibuja trazo a trazo.
 *
 * Cada contorno se recorre con `stroke-dashoffset` —como si una pluma
 * escribiera la palabra— y al terminar entra el relleno sólido. Nada más en
 * pantalla: solo el logo con su tipografía.
 *
 * Server Component: es solo CSS, no necesita estado ni JS de cliente.
 */
export function PantallaCarga() {
  return (
    <div
      role="status"
      aria-label="Cargando"
      className="bg-background fixed inset-0 z-[100] grid place-items-center"
    >
      <svg
        viewBox={`0 0 ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`}
        className="w-[min(62vw,17rem)]"
        role="img"
        aria-label={SITE.nombre}
      >
        {/* Trazo: dibuja el contorno de cada letra y se apaga al llegar el
            relleno, para no pisar el borde de los huecos internos. */}
        <g
          fill="none"
          stroke="var(--primary)"
          strokeWidth={2.5}
          strokeLinejoin="round"
          className="logo-trazo-salida"
          style={{ animationDelay: `${INICIO_RELLENO + 300}ms` }}
        >
          {LOGO_TRAZOS.map((t, i) => (
            <path
              key={i}
              d={t.d}
              className="logo-trazo"
              style={{
                ["--largo" as string]: t.largo,
                animationDelay: `${retardo(i)}ms`,
              }}
            />
          ))}
        </g>

        {/* Relleno: entra cuando el trazo ya recorrió la palabra.
            Es UN SOLO path (siluetas + huecos) para que `evenodd` cale los
            espacios internos; con paths separados las letras salen macizas. */}
        <path
          d={LOGO_RELLENO}
          fill="var(--primary)"
          fillRule="evenodd"
          className="logo-relleno"
          style={{ animationDelay: `${INICIO_RELLENO}ms` }}
        />
      </svg>
    </div>
  )
}
