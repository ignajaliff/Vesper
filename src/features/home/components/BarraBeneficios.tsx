import { BadgeCheck, CreditCard, Landmark, Truck } from "lucide-react"

const BENEFICIOS = [
  { icono: Truck, titulo: "Envíos gratis a todo el país" },
  { icono: CreditCard, titulo: "Hasta 3 cuotas sin interés" },
  { icono: Landmark, titulo: "20% OFF por transferencia" },
  { icono: BadgeCheck, titulo: "100% originales" },
] as const

export function BarraBeneficios() {
  return (
    <section aria-label="Beneficios" className="border-y">
      <ul className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4">
        {BENEFICIOS.map(({ icono: Icono, titulo }) => (
          <li key={titulo} className="flex items-center gap-3">
            <Icono className="text-muted-foreground size-5 shrink-0" aria-hidden />
            <span className="text-sm font-medium text-pretty">{titulo}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
