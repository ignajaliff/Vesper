import { BadgeCheck, CreditCard, Landmark, Truck } from "lucide-react"

const BENEFICIOS = [
  {
    icono: Truck,
    titulo: "Envío gratis",
    detalle: "En todos los pedidos, a todo el país",
  },
  {
    icono: CreditCard,
    titulo: "3 cuotas sin interés",
    detalle: "Con todas las tarjetas de crédito",
  },
  {
    icono: Landmark,
    titulo: "20% off por transferencia",
    detalle: "El descuento se aplica en el checkout",
  },
  {
    icono: BadgeCheck,
    titulo: "100% originales",
    detalle: "Importación propia y garantía",
  },
] as const

export function BarraBeneficios() {
  return (
    <section aria-label="Beneficios" className="border-y">
      <ul className="mx-auto grid w-full max-w-6xl grid-cols-1 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {BENEFICIOS.map(({ icono: Icono, titulo, detalle }, i) => (
          <li
            key={titulo}
            className={[
              "flex items-start gap-3.5 py-7",
              // Separadores internos: verticales en desktop, horizontales en mobile.
              i > 0 ? "border-t sm:border-t-0" : "",
              i % 2 === 1 ? "sm:border-l sm:pl-6" : "",
              i > 1 ? "sm:border-t lg:border-t-0" : "",
              i > 0 ? "lg:border-l lg:pl-6" : "",
              i < 3 ? "sm:pr-6" : "",
            ].join(" ")}
          >
            <Icono
              className="text-destructive mt-0.5 size-[1.125rem] shrink-0"
              strokeWidth={1.5}
              aria-hidden
            />
            <div className="space-y-1">
              <p className="text-sm leading-none font-medium">{titulo}</p>
              <p className="text-muted-foreground text-xs leading-relaxed text-pretty">
                {detalle}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
