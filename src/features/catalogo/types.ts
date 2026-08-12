export type Categoria = {
  id: string
  slug: string
  nombre: string
}

export type Producto = {
  id: string
  slug: string
  nombre: string
  descripcion: string | null
  /** Precio de venta actual. */
  precio: number
  /** Precio de lista tachado. Null si el producto no está en oferta. */
  precio_lista: number | null
  stock: number
  activo: boolean
  imagen_url: string | null
  envio_gratis: boolean
  created_at: string
  updated_at: string
}

export type ProductoCardProps = {
  producto: Producto
  /** `priority` solo en las primeras imágenes visibles (LCP). */
  prioridad?: boolean
}
