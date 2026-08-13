import { CarruselProductos } from "@/features/catalogo/components/CarruselProductos"
import {
  getProductosEnOferta,
  getProductosPorColeccion,
} from "@/features/catalogo/queries"
import { BarraBeneficios } from "@/features/home/components/BarraBeneficios"
import { FranjaEditorial } from "@/features/home/components/FranjaEditorial"
import { FranjaMarcas } from "@/features/home/components/FranjaMarcas"
import { Hero } from "@/features/home/components/Hero"
import { OpinionesGoogle } from "@/features/home/components/OpinionesGoogle"
import { Reviews } from "@/features/home/components/Reviews"
import { TresDestacados } from "@/features/home/components/TresDestacados"

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
      <TresDestacados />
      <BarraBeneficios />

      <CarruselProductos
        ojal="Selección"
        titulo="Los más elegidos"
        descripcion="Las fragancias que más salen del depósito, mes a mes."
        productos={destacados}
        verMasHref="/productos"
        cantidadPrioritaria={4}
      />

      <CarruselProductos
        ojal="Promoción"
        titulo="Decants 3 x 2"
        descripcion="Llevá tres decants de 5 ml y pagá dos. Ideal para probar antes del frasco."
        productos={tresPorDos}
        verMasHref="/productos"
      />

      <CarruselProductos
        ojal="Recién llegados"
        titulo="Novedades"
        descripcion="Lo último que entró al depósito, antes de que se agote."
        productos={novedades}
        verMasHref="/productos"
      />

      <FranjaEditorial />

      <CarruselProductos
        ojal="Precio especial"
        titulo="Ofertas"
        descripcion="Stock limitado. El descuento por transferencia se suma al precio de lista."
        productos={ofertas}
        verMasHref="/productos"
      />

      <CarruselProductos
        ojal="Combos"
        titulo="Promociones"
        descripcion="Sets y kits armados, a mejor precio que comprando por separado."
        productos={promociones}
        verMasHref="/productos"
      />

      <Reviews />
      <OpinionesGoogle />
    </>
  )
}
