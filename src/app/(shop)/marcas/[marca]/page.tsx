import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { ProductoGrid } from "@/features/catalogo/components/ProductoGrid"
import {
  getNombreMarca,
  getProductosPorMarca,
  getSlugsMarcas,
} from "@/features/catalogo/queries"

type Params = { params: Promise<{ marca: string }> }

/** Prerenderiza una página por marca con productos. */
export async function generateStaticParams() {
  return getSlugsMarcas()
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { marca } = await params
  const nombre = await getNombreMarca(marca)

  if (!nombre) return { title: "Marca no encontrada" }

  return {
    title: nombre,
    description: `Perfumes ${nombre} 100% originales, con envío gratis a todo el país.`,
  }
}

export default async function MarcaPage({ params }: Params) {
  const { marca } = await params
  const nombre = await getNombreMarca(marca)

  if (!nombre) notFound()

  const productos = await getProductosPorMarca(marca)

  return (
    <div className="mx-auto w-full max-w-[100rem] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <nav aria-label="Miga de pan" className="mb-8">
        <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-xs">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden />
          <li>
            <Link
              href="/productos"
              className="hover:text-foreground transition-colors"
            >
              Catálogo
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden />
          <li aria-current="page" className="text-foreground">
            {nombre}
          </li>
        </ol>
      </nav>

      <header className="mb-12 max-w-xl">
        <p className="eyebrow text-destructive">Marca</p>

        <h1 className="font-heading mt-4 text-4xl leading-tight font-normal tracking-tight text-balance sm:text-5xl">
          {nombre}
        </h1>

        <span aria-hidden className="filete mt-6" />

        <p className="text-muted-foreground eyebrow mt-8">
          {productos.length} {productos.length === 1 ? "producto" : "productos"}
        </p>
      </header>

      <ProductoGrid productos={productos} cantidadPrioritaria={4} />
    </div>
  )
}
