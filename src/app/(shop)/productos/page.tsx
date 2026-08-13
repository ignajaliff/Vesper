import type { Metadata } from "next"

import { ProductoGrid } from "@/features/catalogo/components/ProductoGrid"
import { getProductos } from "@/features/catalogo/queries"

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Perfumes 100% originales: fragancias árabes, de diseñador y selectivas. Envío gratis a todo el país.",
}

export default async function ProductosPage() {
  const productos = await getProductos()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-14 max-w-xl">
        <p className="eyebrow text-destructive">Catálogo</p>

        <h1 className="font-heading mt-4 text-4xl leading-tight font-normal tracking-tight text-balance sm:text-5xl">
          Todas las fragancias
        </h1>

        <span aria-hidden className="filete mt-6" />

        <p className="text-muted-foreground mt-6 text-sm leading-relaxed text-pretty">
          Árabes, de diseñador y selectivas. Todas originales, con envío gratis
          a todo el país.
        </p>

        <p className="text-muted-foreground eyebrow mt-8">
          {productos.length} {productos.length === 1 ? "producto" : "productos"}
        </p>
      </header>

      <ProductoGrid productos={productos} cantidadPrioritaria={4} />
    </div>
  )
}
