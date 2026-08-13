export type HeroSlide = {
  id: string
  titulo: string
  bajada: string
  ctaLabel: string
  ctaHref: string
  /** Imagen de fondo. Null mientras no haya arte definitivo (se ve el fondo neutro). */
  imagenUrl: string | null
}

/**
 * Las fotos de fondo son oscuras y dejan el aire a la izquierda, que es donde
 * cae el texto. El Hero las trata con velo oscuro y tipografía clara: si en el
 * futuro se cargan fotos claras, hay que revisar ese contraste.
 */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "originales",
    titulo: "Perfumes 100% originales",
    bajada: "Fragancias árabes, de diseñador y selectivas. Envío gratis a todo el país.",
    ctaLabel: "Ver catálogo",
    ctaHref: "/productos",
    imagenUrl: "/fondo-hero1.webp",
  },
  {
    id: "transferencia",
    titulo: "20% OFF pagando por transferencia",
    bajada: "El descuento se aplica solo al finalizar tu compra.",
    ctaLabel: "Aprovechar descuento",
    ctaHref: "/productos",
    imagenUrl: "/fondo-hero2.webp",
  },
  {
    id: "decants",
    titulo: "Decants 3 x 2",
    bajada: "Llevá tres decants de 5 ml y pagá dos. Ideal para probar antes del frasco.",
    ctaLabel: "Ver decants",
    ctaHref: "/productos",
    imagenUrl: "/fondo-hero1.webp",
  },
]
