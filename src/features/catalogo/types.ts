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

/**
 * Pirámide olfativa: cómo evoluciona la fragancia en la piel.
 *
 * Se muestra en la ficha. Cada nivel es una lista de notas ("Manzana",
 * "Bergamota"). Null mientras no se carguen los datos del producto.
 */
export type NotasOlfativas = {
  /** Primera impresión, los primeros minutos. */
  salida: string[]
  /** El cuerpo de la fragancia. */
  corazon: string[]
  /** Lo que queda al final, la estela que perdura. */
  base: string[]
}

/** Intensidad de una característica, en tres niveles. */
export type Intensidad = "baja" | "media" | "alta"

/**
 * Una presentación del producto: el mismo perfume en distinto tamaño.
 *
 * ANDAMIAJE: hoy son solo visuales —elegir otro tamaño no cambia el precio ni
 * lo que se agrega a la bolsa—. Al conectar Supabase cada presentación pasa a
 * ser su propia fila de `productos` (con su stock y su precio) o una tabla
 * `variantes`, y ahí el selector cambia de producto de verdad.
 */
export type Presentacion = {
  /** Contenido en mililitros. */
  ml: number
  /** Si es la presentación que se está mostrando. */
  predeterminada?: boolean
}

/**
 * Las cuatro cosas que definen un perfume a la hora de elegirlo.
 * Se muestran como una fila de cuatro en la ficha.
 */
export type CaracteristicasProducto = {
  /** Cuánto dura puesto, en horas ("6 a 8 horas"). */
  duracion: string
  /** Cuánto proyecta: la nube que deja alrededor. */
  estela: Intensidad
  /** Cuándo usarlo ("Noche", "Diario", "Oficina"). */
  uso: string
  /** Estación del año que mejor le sienta. */
  epoca: string
}

export type Producto = {
  id: string
  slug: string
  nombre: string
  /** Casa perfumera. */
  marca: string
  descripcion: string | null
  /** Tamaños disponibles. Vacío si el producto viene en uno solo. */
  presentaciones: Presentacion[]
  /** Pirámide olfativa. Null hasta cargar los datos del producto. */
  notas: NotasOlfativas | null
  /** Duración, estela, uso y época. Null hasta cargar los datos. */
  caracteristicas: CaracteristicasProducto | null
  /** Precio de venta actual. */
  precio: number
  /** Precio de lista tachado. Null si el producto no está en oferta. */
  precio_lista: number | null
  stock: number
  activo: boolean
  /** Foto principal del producto. */
  imagen_url: string | null
  /**
   * Segunda foto, que reemplaza a la principal al pasar el cursor por la
   * tarjeta. Null si el producto tiene una sola foto: ahí no hay cambio.
   */
  imagen_hover_url: string | null
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
