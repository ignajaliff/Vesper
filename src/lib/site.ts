export const SITE = {
  nombre: "Vesper",
  descripcionCorta: "Perfumería de autor",
  descripcion:
    "Vesper crea perfumes de autor en pequeñas series: fragancias de alta concentración, pensadas para durar y para recordarse.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const

export const NAV_PRINCIPAL = [
  { href: "/productos", label: "Catálogo" },
  { href: "/colecciones", label: "Colecciones" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
] as const
