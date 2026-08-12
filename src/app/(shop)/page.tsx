import {
  getProductosDestacados,
  getProductosEnOferta,
} from "@/features/catalogo/queries"
import { SeccionProductos } from "@/features/catalogo/components/SeccionProductos"
import { BarraBeneficios } from "@/features/home/components/BarraBeneficios"
import { Hero } from "@/features/home/components/Hero"

export default async function HomePage() {
  const [destacados, ofertas] = await Promise.all([
    getProductosDestacados(4),
    getProductosEnOferta(4),
  ])

  return (
    <>
      <Hero />
      <BarraBeneficios />

      <SeccionProductos
        titulo="Best sellers"
        productos={destacados}
        verMasHref="/productos"
        cantidadPrioritaria={4}
      />

      <SeccionProductos
        titulo="Ofertas"
        productos={ofertas}
        verMasHref="/productos"
      />
    </>
  )
}
