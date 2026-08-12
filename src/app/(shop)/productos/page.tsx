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
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <h1 className="text-2xl font-medium">Catálogo</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {productos.length} {productos.length === 1 ? "producto" : "productos"}
        </p>
      </header>

      <ProductoGrid productos={productos} cantidadPrioritaria={4} />
    </div>
  )
}
