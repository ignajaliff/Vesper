export const SITE = {
  nombre: "Vesper",
  descripcionCorta: "Perfumería de autor",
  descripcion:
    "Vesper crea perfumes de autor en pequeñas series: fragancias de alta concentración, pensadas para durar y para recordarse.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const

/**
 * Navegación principal del header.
 *
 * Los ítems con `panel` abren un desplegable con sus subcategorías; el resto
 * son enlaces directos. Todas las rutas apuntan a `/productos` mientras no
 * existan las páginas de categoría.
 */
export type ItemNav = {
  href: string
  label: string
  /** Secciones del panel desplegable. Sin esto, el ítem es un enlace simple. */
  panel?: {
    titulo: string
    items: { label: string; href: string }[]
  }[]
}

const POR_GENERO = {
  titulo: "Por género",
  items: [
    { label: "Masculinas", href: "/productos" },
    { label: "Femeninas", href: "/productos" },
    { label: "Unisex", href: "/productos" },
  ],
}

const POR_FAMILIA = {
  titulo: "Por familia",
  items: [
    { label: "Árabes", href: "/productos" },
    { label: "Amaderadas", href: "/productos" },
    { label: "Cítricas", href: "/productos" },
    { label: "Orientales", href: "/productos" },
  ],
}

export const NAV_PRINCIPAL: ItemNav[] = [
  { href: "/", label: "Inicio" },
  {
    href: "/productos",
    label: "Productos",
    panel: [
      POR_GENERO,
      POR_FAMILIA,
      {
        titulo: "Por marca",
        items: [
          { label: "Armaf", href: "/productos" },
          { label: "Xerjoff", href: "/productos" },
          { label: "Lattafa", href: "/productos" },
          { label: "Ver todas", href: "/productos" },
        ],
      },
    ],
  },
  {
    href: "/productos",
    label: "3x2",
    panel: [
      {
        titulo: "Promoción 3x2",
        items: [
          { label: "Decants 5 ml", href: "/productos" },
          { label: "Decants 10 ml", href: "/productos" },
          { label: "Cómo funciona", href: "/productos" },
        ],
      },
      POR_GENERO,
    ],
  },
  {
    href: "/productos",
    label: "Novedades",
    panel: [
      {
        titulo: "Recién llegados",
        items: [
          { label: "Últimos ingresos", href: "/productos" },
          { label: "Preventa", href: "/productos" },
          { label: "Ediciones limitadas", href: "/productos" },
        ],
      },
      POR_FAMILIA,
    ],
  },
  {
    href: "/productos",
    label: "Beauty",
    panel: [
      {
        titulo: "Cuidado personal",
        items: [
          { label: "Body splash", href: "/productos" },
          { label: "Cremas corporales", href: "/productos" },
          { label: "Desodorantes", href: "/productos" },
          { label: "Sets de regalo", href: "/productos" },
        ],
      },
    ],
  },
  {
    href: "/productos",
    label: "Promociones",
    panel: [
      {
        titulo: "Combos y sets",
        items: [
          { label: "Sets de regalo", href: "/productos" },
          { label: "Combos 2x1", href: "/productos" },
          { label: "Kits de decants", href: "/productos" },
          { label: "Set descubrimiento", href: "/productos" },
        ],
      },
    ],
  },
  {
    href: "/productos",
    label: "SALE",
    panel: [
      {
        titulo: "Liquidación",
        items: [
          { label: "Hasta 30% off", href: "/productos" },
          { label: "Hasta 50% off", href: "/productos" },
          { label: "Últimas unidades", href: "/productos" },
        ],
      },
    ],
  },
]

/** Cinta superior del sitio, sobre el header. Se desplaza en loop. */
export const ANUNCIOS = [
  "Envío gratis en todos los perfumes",
  "Hasta 3 cuotas sin interés",
  "Garantía oficial en todos los productos",
  "3 x 2 en todos los Decants",
  "Envíos a todo el país",
] as const

/** Cinta de beneficios: va bajo el nav del header y arriba del footer. */
export const MARQUESINA = [
  "3 CUOTAS SIN INTERÉS",
  "20% OFF POR TRANSFERENCIA",
  "ENVÍO GRATIS A TODO EL PAÍS",
  "GARANTÍA OFICIAL",
  "100% ORIGINALES",
] as const

/**
 * Medios de pago y de envío del footer.
 *
 * `logo` apunta al archivo oficial de cada marca. Mientras sea `null` se
 * muestra el nombre en texto sobre el mismo chip blanco: son marcas
 * registradas y no se pueden dibujar imitaciones — hay que usar los kits que
 * publica cada una. Al copiar los archivos a `public/medios/`, completar el
 * campo y el chip pasa a mostrar la imagen sin tocar nada más.
 */
export type Medio = {
  nombre: string
  /** Ruta en `public/`. Null hasta tener el archivo oficial. */
  logo: string | null
}

export const MEDIOS_PAGO: Medio[] = [
  { nombre: "Visa", logo: null },
  { nombre: "Mastercard", logo: null },
  { nombre: "American Express", logo: null },
  { nombre: "Banelco", logo: null },
  { nombre: "Cabal", logo: null },
  { nombre: "Pago Fácil", logo: null },
  { nombre: "Naranja X", logo: null },
  { nombre: "Rapipago", logo: null },
  { nombre: "Nativa", logo: null },
  { nombre: "Diners Club", logo: null },
  { nombre: "Argencard", logo: null },
  { nombre: "Cabal Débito", logo: null },
  { nombre: "Provincia NET", logo: null },
  { nombre: "Mercado Pago", logo: null },
  { nombre: "Transferencia", logo: null },
]

export const MEDIOS_ENVIO: Medio[] = [
  { nombre: "Correo Argentino", logo: null },
  { nombre: "Envío Nube", logo: null },
]

/**
 * Marcas que trabajamos, para la franja de la home.
 *
 * Son wordmarks tipográficos, no isologos: usar los logos reales de cada casa
 * requiere sus archivos y su permiso de uso. `href` apunta al catálogo
 * filtrado; hasta que existan las páginas de marca, todas van a `/productos`.
 */
export type Marca = {
  nombre: string
  href: string
}

export const MARCAS: Marca[] = [
  { nombre: "Jean Paul Gaultier", href: "/productos" },
  { nombre: "Lattafa", href: "/productos" },
  { nombre: "Afnan", href: "/productos" },
  { nombre: "Rabanne", href: "/productos" },
  { nombre: "Valentino", href: "/productos" },
  { nombre: "Xerjoff", href: "/productos" },
  { nombre: "Al Haramain", href: "/productos" },
  { nombre: "French Avenue", href: "/productos" },
  { nombre: "Rayhaan", href: "/productos" },
  { nombre: "Carolina Herrera", href: "/productos" },
  { nombre: "Montale", href: "/productos" },
  { nombre: "Mancera", href: "/productos" },
  { nombre: "Givenchy", href: "/productos" },
  { nombre: "Cher", href: "/productos" },
  { nombre: "Armaf", href: "/productos" },
  { nombre: "Tom Ford", href: "/productos" },
  { nombre: "Dior", href: "/productos" },
  { nombre: "Versace", href: "/productos" },
]
