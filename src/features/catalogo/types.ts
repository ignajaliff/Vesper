export type Categoria = {
  id: string
  slug: string
  nombre: string
}

/**
 * Secciones comerciales de la home. Un producto puede estar en varias.
 *
 * Al conectar Supabase esto pasa a ser una tabla `categorias` + tabla puente,
 * o columnas booleanas en `productos` según cómo lo administre el negocio.
 */
export type Coleccion =
  | "destacado"
  | "tres-por-dos"
  | "novedad"
  | "oferta"
  | "promocion"

export type Producto = {
  id: string
  slug: string
  nombre: string
  /** Casa perfumera. */
  marca: string
  descripcion: string | null
  /** Precio de venta actual. */
  precio: number
  /** Precio de lista tachado. Null si el producto no está en oferta. */
  precio_lista: number | null
  stock: number
  activo: boolean
  imagen_url: string | null
  envio_gratis: boolean
  /** Secciones de la home en las que aparece. */
  colecciones: Coleccion[]
  created_at: string
  updated_at: string
}

export type ProductoCardProps = {
  producto: Producto
  /** `priority` solo en las primeras imágenes visibles (LCP). */
  prioridad?: boolean
}
