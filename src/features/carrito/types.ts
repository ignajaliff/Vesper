export type ItemCarrito = {
  producto_id: string
  slug: string
  nombre: string
  /** Precio REFERENCIAL para mostrar. El total real se recalcula en el server. */
  precio: number
  imagen_url: string | null
  cantidad: number
}
