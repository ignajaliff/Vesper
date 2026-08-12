export type HeroSlide = {
  id: string
  titulo: string
  bajada: string
  ctaLabel: string
  ctaHref: string
  /** Imagen de fondo. Null mientras no haya arte definitivo (se ve el fondo neutro). */
  imagenUrl: string | null
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "originales",
    titulo: "Perfumes 100% originales",
    bajada: "Fragancias árabes, de diseñador y selectivas. Envío gratis a todo el país.",
    ctaLabel: "Ver catálogo",
    ctaHref: "/productos",
    imagenUrl: null,
  },
  {
    id: "transferencia",
    titulo: "20% OFF pagando por transferencia",
    bajada: "El descuento se aplica solo al finalizar tu compra.",
    ctaLabel: "Aprovechar descuento",
    ctaHref: "/productos",
    imagenUrl: null,
  },
  {
    id: "decants",
    titulo: "Decants 3 x 2",
    bajada: "Llevá tres decants de 5 ml y pagá dos. Ideal para probar antes del frasco.",
    ctaLabel: "Ver decants",
    ctaHref: "/productos",
    imagenUrl: null,
  },
]
