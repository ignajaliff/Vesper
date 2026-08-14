import type { MetadataRoute } from "next"

import { getSlugsActivos, getSlugsMarcas } from "@/features/catalogo/queries"
import { SITE } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const estaticas: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/productos`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/nosotros`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE.url}/contacto`, changeFrequency: "monthly", priority: 0.4 },
  ]

  const [productos, marcas] = await Promise.all([
    getSlugsActivos(),
    getSlugsMarcas(),
  ])

  return [
    ...estaticas,
    ...marcas.map((m) => ({
      url: `${SITE.url}/marcas/${m.marca}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...productos.map((p) => ({
      url: `${SITE.url}/productos/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ]
}
