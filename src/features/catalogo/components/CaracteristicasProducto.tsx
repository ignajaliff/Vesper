import { CalendarDays, Clock, Sparkles, Waves } from "lucide-react"

import {
  type CaracteristicasProducto as Caracteristicas,
  type Intensidad,
} from "../types"

/**
 * Las cuatro cosas que definen un perfume al elegirlo: cuánto dura, cuánto
 * proyecta, cuándo usarlo y en qué época.
 *
 * Cada tarjeta cierra con una línea de contexto en texto, no con una escala de
 * puntos: se probó con puntos y los dos valores que la tenían —duración y
 * estela— caían los dos en el máximo, así que se veían idénticos y no
 * comunicaban nada; las otras dos quedaban vacías y la fila desbalanceada.
 */
export function CaracteristicasProducto({
  caracteristicas,
}: {
  caracteristicas: Caracteristicas
}) {
  const { duracion, estela, uso, epoca } = caracteristicas

  /** Qué significa cada nivel de estela, en palabras. */
  const CONTEXTO_ESTELA: Record<Intensidad, string> = {
    baja: "Se siente de cerca",
    media: "Deja rastro al pasar",
    alta: "Se percibe a distancia",
  }

  /**
   * Contexto de la duración según las horas del texto ("8 a 10 horas").
   * Si no hay número, no se muestra la línea.
   */
  function contextoDuracion(texto: string): string {
    const horas = texto.match(/\d+/g)?.map(Number) ?? []
    const max = horas.length ? Math.max(...horas) : 0
    if (!max) return ""
    if (max <= 5) return "Ideal para retocar"
    if (max <= 8) return "Aguanta la jornada"
    return "Sigue puesto al día siguiente"
  }

  const ITEMS = [
    {
      clave: "duracion",
      icono: Clock,
      rotulo: "Duración",
      valor: duracion,
      contexto: contextoDuracion(duracion),
    },
    {
      clave: "estela",
      icono: Waves,
      rotulo: "Estela",
      valor: estela,
      contexto: CONTEXTO_ESTELA[estela],
    },
    {
      clave: "uso",
      icono: Sparkles,
      rotulo: "Uso ideal",
      valor: uso,
      contexto: "Cuándo lo vas a querer usar",
    },
    {
      clave: "epoca",
      icono: CalendarDays,
      rotulo: "Época",
      valor: epoca,
      contexto: "Cuando mejor rinde",
    },
  ] as const

  return (
    <section aria-labelledby="caracteristicas-titulo" className="mt-16">
      <p className="eyebrow text-primary">En la piel</p>
      <h2
        id="caracteristicas-titulo"
        className="font-heading mt-3 text-2xl leading-tight font-normal tracking-tight sm:text-[1.75rem]"
      >
        Cómo se comporta
      </h2>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ clave, icono: Icono, rotulo, valor, contexto }) => (
          <li
            key={clave}
            className="border-border/70 hover:border-primary/30 flex flex-col border p-5 transition-colors"
          >
            <Icono
              className="text-primary size-5"
              strokeWidth={1.5}
              aria-hidden
            />

            <p className="eyebrow text-muted-foreground mt-6">{rotulo}</p>

            <p
              className={`font-heading mt-1.5 text-lg leading-snug font-normal text-balance ${
                clave === "estela" ? "capitalize" : ""
              }`}
            >
              {valor}
            </p>

            {/* `mt-auto` ancla la línea de contexto al pie: los valores ocupan
                una o dos líneas y sin esto quedan a distinta altura. */}
            {contexto && (
              <p className="text-muted-foreground border-border/60 mt-auto border-t pt-3 text-xs leading-relaxed text-pretty">
                {contexto}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
