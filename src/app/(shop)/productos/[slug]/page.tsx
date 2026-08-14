import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { CarruselProductos } from "@/features/catalogo/components/CarruselProductos"
import { DetalleProducto } from "@/features/catalogo/components/DetalleProducto"
import {
  getProductoBySlug,
  getProductosRelacionados,
  getSlugsActivos,
} from "@/features/catalogo/queries"
import { OpinionesGoogle } from "@/features/home/components/OpinionesGoogle"

type Params = { params: Promise<{ slug: string }> }

/** Prerenderiza las fichas del catálogo en build. */
export async function generateStaticParams() {
  return getSlugsActivos()
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const producto = await getProductoBySlug(slug)

  if (!producto) return { title: "Producto no encontrado" }

  return {
    title: producto.nombre,
    description:
      producto.descripcion ??
      `${producto.nombre} — ${producto.marca}. Perfume 100% original con envío gratis a todo el país.`,
  }
}

export default async function ProductoPage({ params }: Params) {
  const { slug } = await params
  const producto = await getProductoBySlug(slug)

  if (!producto) notFound()

  const relacionados = await getProductosRelacionados(producto)

  return (
    <>
      <DetalleProducto producto={producto} />

      <CarruselProductos titulo="Otros perfumes" productos={relacionados} verMasHref="/productos" />

      <OpinionesGoogle />
    </>
  )
}
