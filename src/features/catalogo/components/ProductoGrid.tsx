import { type Producto } from "../types"
import { ProductoCard } from "./ProductoCard"

type ProductoGridProps = {
  productos: Producto[]
  /** Cuántas cards reciben `priority` en su imagen (las visibles al cargar). */
  cantidadPrioritaria?: number
}

/** Grilla de catálogo: 2 columnas en mobile, 4 en desktop. */
export function ProductoGrid({
  productos,
  cantidadPrioritaria = 0,
}: ProductoGridProps) {
  if (productos.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        No hay productos para mostrar.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {productos.map((producto, i) => (
        <ProductoCard
          key={producto.id}
          producto={producto}
          prioridad={i < cantidadPrioritaria}
        />
      ))}
    </div>
  )
}
