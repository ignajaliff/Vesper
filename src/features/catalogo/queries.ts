import { PRODUCTOS_MOCK } from "./mock"
import { type Producto } from "./types"

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

/** Destacados de la home ("BEST SELLERS"). */
export async function getProductosDestacados(limite = 4): Promise<Producto[]> {
  // TODO(supabase): filtrar por `destacado = true` y limitar en la query.
  return PRODUCTOS_MOCK.slice(0, limite)
}

/** Productos con precio de lista mayor al de venta ("OFERTAS"). */
export async function getProductosEnOferta(limite = 4): Promise<Producto[]> {
  // TODO(supabase): where precio_lista is not null and precio_lista > precio
  return PRODUCTOS_MOCK.filter(
    (p) => p.precio_lista !== null && p.precio_lista > p.precio
  ).slice(0, limite)
}

export async function getProductoBySlug(slug: string): Promise<Producto | null> {
  // TODO(supabase): select * from productos where slug = slug and activo = true
  return PRODUCTOS_MOCK.find((p) => p.slug === slug) ?? null
}

export async function getSlugsActivos(): Promise<{ slug: string }[]> {
  // TODO(supabase): select slug from productos where activo = true
  return PRODUCTOS_MOCK.map((p) => ({ slug: p.slug }))
}
