import { CarruselProductos } from "@/features/catalogo/components/CarruselProductos"
import {
  getProductosEnOferta,
  getProductosPorColeccion,
} from "@/features/catalogo/queries"
import { CuatroCategorias } from "@/features/home/components/CuatroCategorias"
import { FranjaMarcas } from "@/features/home/components/FranjaMarcas"
import { Hero } from "@/features/home/components/Hero"
import { OpinionesGoogle } from "@/features/home/components/OpinionesGoogle"
import { Reviews } from "@/features/home/components/Reviews"

export default async function HomePage() {
  const [destacados, tresPorDos, novedades, ofertas, promociones] =
    await Promise.all([
      getProductosPorColeccion("destacado"),
      getProductosPorColeccion("tres-por-dos"),
      getProductosPorColeccion("novedad"),
      getProductosEnOferta(),
      getProductosPorColeccion("promocion"),
    ])

  return (
    <>
      <Hero />
      <FranjaMarcas />
      <CuatroCategorias />

      <CarruselProductos
        titulo="Los más elegidos"
        productos={destacados}
        verMasHref="/productos"
        cantidadPrioritaria={4}
      />

      <CarruselProductos
        titulo="Decants 3 x 2"
        productos={tresPorDos}
        verMasHref="/productos"
      />

      <CarruselProductos
        titulo="Novedades"
        productos={novedades}
        verMasHref="/productos"
      />

      <CarruselProductos
        titulo="Ofertas"
        productos={ofertas}
        verMasHref="/productos"
      />

      <CarruselProductos
        titulo="Promociones"
        productos={promociones}
        verMasHref="/productos"
      />

      <Reviews />
      <OpinionesGoogle />
    </>
  )
}
