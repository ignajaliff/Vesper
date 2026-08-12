import type { MetadataRoute } from "next"

import { getSlugsActivos } from "@/features/catalogo/queries"
import { SITE } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const estaticas: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/productos`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/nosotros`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE.url}/contacto`, changeFrequency: "monthly", priority: 0.4 },
  ]

  const productos = await getSlugsActivos()

  return [
    ...estaticas,
    ...productos.map((p) => ({
      url: `${SITE.url}/productos/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ]
}
