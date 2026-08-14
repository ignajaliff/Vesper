import { type NotasOlfativas as Notas } from "../types"

/**
 * Pirámide olfativa: cómo evoluciona la fragancia en la piel.
 *
 * Va en tres bloques —salida, corazón, base— en ese orden, que es el del
 * tiempo: lo que se huele al primer minuto, a la hora y al final del día.
 *
 * Cada nivel lleva su número y una barra de intensidad creciente: sin eso son
 * tres listas de palabras sueltas y se pierde que hay una progresión.
 */
export function NotasOlfativas({ notas }: { notas: Notas }) {
  const NIVELES = [
    {
      clave: "salida",
      paso: "01",
      titulo: "Salida",
      detalle: "Los primeros minutos",
      lista: notas.salida,
      /* Ancho de la barra: crece con la permanencia del nivel. */
      peso: "w-1/3",
    },
    {
      clave: "corazon",
      paso: "02",
      titulo: "Corazón",
      detalle: "El cuerpo de la fragancia",
      lista: notas.corazon,
      peso: "w-2/3",
    },
    {
      clave: "base",
      paso: "03",
      titulo: "Base",
      detalle: "La estela que perdura",
      lista: notas.base,
      peso: "w-full",
    },
  ] as const

  return (
    <section
      aria-labelledby="notas-titulo"
      className="bg-secondary/50 mt-16 px-6 py-12 sm:px-10 lg:py-14"
    >
      <h2
        id="notas-titulo"
        className="font-heading text-2xl leading-tight font-normal tracking-tight sm:text-[1.75rem]"
      >
        Pirámide olfativa
      </h2>

      <ol className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-3">
        {NIVELES.map(({ clave, paso, titulo, detalle, lista, peso }) => (
          <li key={clave}>
            {/* Riel de intensidad: la barra azul crece de un nivel al otro. */}
            <div className="bg-border/70 h-px w-full" aria-hidden>
              <div className={`bg-primary h-px ${peso}`} />
            </div>

            <div className="mt-5 flex items-baseline gap-2.5">
              <span
                aria-hidden
                className="font-heading text-primary/35 text-xl leading-none"
              >
                {paso}
              </span>
              <h3 className="font-heading text-lg leading-none font-normal">
                {titulo}
              </h3>
            </div>

            <p className="text-muted-foreground mt-2 text-xs">{detalle}</p>

            {/* Las notas van como texto separado por filetes, no como chips:
                los recuadros grises las hacían leer como etiquetas de sistema. */}
            <ul className="mt-5 space-y-2.5">
              {lista.map((nota) => (
                <li
                  key={nota}
                  className="border-border/60 flex items-center gap-2.5 border-b pb-2.5 text-sm last:border-b-0"
                >
                  <span
                    aria-hidden
                    className="bg-primary/40 size-1 shrink-0 rounded-full"
                  />
                  {nota}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  )
}
