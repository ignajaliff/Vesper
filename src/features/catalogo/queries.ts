import { aSlug } from "@/lib/slug"
import { PRODUCTOS_MOCK } from "./mock"
import { type Coleccion, type Producto } from "./types"

/**
 * DAL del catálogo — lecturas server, tipadas.
 *
 * Supabase todavía no está conectado: estas funciones devuelven los datos
 * de `mock.ts`. Al conectar la base, reemplazar el cuerpo por la query
 * (los TODO indican cuál) y borrar `mock.ts`.
 */

export async function getProductos(): Promise<Producto[]> {
  // TODO(supabase):
  //   const supabase = await createClient()
  //   const { data, error } = await supabase
  //     .from("productos")
  //     .select("*")
  //     .eq("activo", true)
  //     .order("created_at", { ascending: false })
  //   if (error) throw error
  //   return data
  return PRODUCTOS_MOCK
}

/** Productos de una sección de la home (best sellers, 3x2, novedades…). */
export async function getProductosPorColeccion(
  coleccion: Coleccion,
  limite = 12
): Promise<Producto[]> {
  // TODO(supabase): join con la tabla de colecciones, o `where <flag> = true`.
  return PRODUCTOS_MOCK.filter((p) => p.colecciones.includes(coleccion)).slice(
    0,
    limite
  )
}

/** Destacados de la home ("Los más elegidos"). */
export async function getProductosDestacados(limite = 12): Promise<Producto[]> {
  return getProductosPorColeccion("destacado", limite)
}

/**
 * Productos con precio de lista mayor al de venta ("Ofertas").
 *
 * Se ordenan por descuento descendente: además de ser lo que corresponde
 * comercialmente, evita que la home muestre en "Ofertas" los mismos primeros
 * productos que ya salieron en "Los más elegidos".
 */
export async function getProductosEnOferta(limite = 12): Promise<Producto[]> {
  // TODO(supabase): where precio_lista is not null and precio_lista > precio
  //   order by (precio_lista - precio) / precio_lista desc
  return PRODUCTOS_MOCK.filter(
    (p) => p.precio_lista !== null && p.precio_lista > p.precio
  )
    .map((p) => ({ producto: p, off: 1 - p.precio / p.precio_lista! }))
    .sort((a, b) => b.off - a.off)
    .slice(0, limite)
    .map(({ producto }) => producto)
}

export async function getProductoBySlug(slug: string): Promise<Producto | null> {
  // TODO(supabase): select * from productos where slug = slug and activo = true
  return PRODUCTOS_MOCK.find((p) => p.slug === slug) ?? null
}

/**
 * Productos de una marca, buscada por su slug ("al-haramain").
 *
 * El slug se deriva del nombre con `aSlug`, no se guarda: mientras la marca sea
 * un texto en `productos.marca` no hay dónde guardarlo. Al normalizar marcas en
 * su propia tabla, esto pasa a ser un join por `marcas.slug`.
 */
export async function getProductosPorMarca(
  marcaSlug: string,
  limite = 60
): Promise<Producto[]> {
  // TODO(supabase): join con `marcas` por slug, o `where slug(marca) = $1`.
  return PRODUCTOS_MOCK.filter((p) => aSlug(p.marca) === marcaSlug).slice(
    0,
    limite
  )
}

/** Nombre real de una marca a partir de su slug. Null si no existe. */
export async function getNombreMarca(marcaSlug: string): Promise<string | null> {
  return (
    PRODUCTOS_MOCK.find((p) => aSlug(p.marca) === marcaSlug)?.marca ?? null
  )
}

/** Slugs de todas las marcas con productos, para prerenderizar sus páginas. */
export async function getSlugsMarcas(): Promise<{ marca: string }[]> {
  const slugs = new Set(PRODUCTOS_MOCK.map((p) => aSlug(p.marca)))
  return [...slugs].map((marca) => ({ marca }))
}

/**
 * Otros perfumes para mostrar al pie de una ficha.
 *
 * Prioriza los de la misma marca —quien mira un Bharara suele querer ver los
 * otros Bharara— y completa con el resto del catálogo hasta llegar al límite.
 * Excluye el producto que se está viendo.
 */
export async function getProductosRelacionados(
  producto: Producto,
  limite = 8
): Promise<Producto[]> {
  // TODO(supabase): dos selects (misma marca / resto) o un order by
  //   (marca = producto.marca) desc, con limit.
  const otros = PRODUCTOS_MOCK.filter((p) => p.id !== producto.id)
  const mismaMarca = otros.filter((p) => p.marca === producto.marca)
  const resto = otros.filter((p) => p.marca !== producto.marca)

  return [...mismaMarca, ...resto].slice(0, limite)
}

export async function getSlugsActivos(): Promise<{ slug: string }[]> {
  // TODO(supabase): select slug from productos where activo = true
  return PRODUCTOS_MOCK.map((p) => ({ slug: p.slug }))
}
