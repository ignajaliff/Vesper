import Link from "next/link"

import { Button } from "@/shared/components/ui/button"
import { type Producto } from "../types"
import { ProductoGrid } from "./ProductoGrid"

type SeccionProductosProps = {
  titulo: string
  productos: Producto[]
  /** Si se pasa, se muestra un CTA al final de la sección. */
  verMasHref?: string
  cantidadPrioritaria?: number
}

/** Bloque de home: título centrado + grilla + CTA opcional. */
export function SeccionProductos({
  titulo,
  productos,
  verMasHref,
  cantidadPrioritaria = 0,
}: SeccionProductosProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <h2 className="mb-8 text-center text-xl font-medium tracking-wide uppercase">
        {titulo}
      </h2>

      <ProductoGrid
        productos={productos}
        cantidadPrioritaria={cantidadPrioritaria}
      />

      {verMasHref && (
        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline">
            <Link href={verMasHref}>Ver más productos</Link>
          </Button>
        </div>
      )}
    </section>
  )
}
