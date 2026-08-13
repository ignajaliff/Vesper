import Image from "next/image"

import { MEDIOS_ENVIO, MEDIOS_PAGO, type Medio } from "@/lib/site"

/**
 * Chip blanco con el logo de un medio de pago o envío.
 *
 * Mientras `logo` sea null muestra el nombre en texto: son marcas registradas
 * y hay que usar los archivos oficiales de cada una, no imitaciones. Al cargar
 * el archivo en `public/medios/` y completar el campo, el chip pasa a mostrar
 * la imagen sin cambiar el layout.
 */
function Chip({ medio }: { medio: Medio }) {
  return (
    <li className="grid h-9 min-w-14 place-items-center rounded-sm bg-white px-2.5 shadow-sm">
      {medio.logo ? (
        <Image
          src={medio.logo}
          alt={medio.nombre}
          width={56}
          height={24}
          className="h-5 w-auto object-contain"
        />
      ) : (
        <span className="text-[0.625rem] leading-none font-semibold whitespace-nowrap text-neutral-700">
          {medio.nombre}
        </span>
      )}
    </li>
  )
}

/** Bloque de medios de pago y de envío, al pie del footer. */
export function MediosDePago() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.9fr_1fr] lg:gap-12">
      <section aria-labelledby="medios-pago">
        <h2 id="medios-pago" className="eyebrow mb-3.5 font-bold text-white">
          Medios de pago
        </h2>
        <ul className="flex flex-wrap gap-1.5">
          {MEDIOS_PAGO.map((m) => (
            <Chip key={m.nombre} medio={m} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="medios-envio">
        <h2 id="medios-envio" className="eyebrow mb-3.5 font-bold text-white">
          Medios de envío
        </h2>
        <ul className="flex flex-wrap gap-1.5">
          {MEDIOS_ENVIO.map((m) => (
            <Chip key={m.nombre} medio={m} />
          ))}
        </ul>
      </section>
    </div>
  )
}
