/**
 * Placeholder visual para productos sin foto cargada.
 *
 * Dibuja un frasco estilizado como SVG inline (data URI): no pesa, no pide red
 * y no finge ser el producto real. La variante de color se deriva del slug, así
 * que un mismo producto siempre cae en la misma y la grilla se ve variada.
 *
 * Al cargar las fotos reales en Storage esto deja de usarse solo: `ProductoCard`
 * solo recurre al placeholder cuando `imagen_url` es null.
 */

/**
 * Tintes del frasco, derivados de la paleta de marca: el azul del logo
 * (#104FAC) y el azul oscuro (#0A2E66) en distintas luminosidades, más grises
 * neutros. Se alternan claros y oscuros para que dos cards contiguas de la
 * grilla no caigan en variantes casi idénticas.
 */
const TINTES = [
  { vidrio: "#A8BDDC", liquido: "#104FAC", tapa: "#0A2E66" },
  { vidrio: "#C2C6CC", liquido: "#5B6675", tapa: "#12161C" },
  { vidrio: "#9FB4D6", liquido: "#0A2E66", tapa: "#000000" },
  { vidrio: "#B9C8DE", liquido: "#2E6BC4", tapa: "#0A2E66" },
  { vidrio: "#CBD2DA", liquido: "#8494A8", tapa: "#1B2129" },
  { vidrio: "#93A9CE", liquido: "#153E82", tapa: "#000000" },
  { vidrio: "#B0B4B9", liquido: "#3A4048", tapa: "#000000" },
] as const

const FONDO = "#F5F6F8"

/**
 * Hash rodante (djb2 simplificado) sobre el slug. A diferencia de sumar los
 * caracteres, dispersa slugs parecidos —"...edp-100ml" vs "...edt-105ml"— en
 * tintes distintos, que es justo lo que pasa en este catálogo.
 */
function indiceDeTinte(slug: string): number {
  let hash = 5381
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 33 + slug.charCodeAt(i)) % 100000
  }
  return hash % TINTES.length
}

/**
 * SVG de un frasco de perfume centrado sobre el fondo hueso de la paleta.
 * Devuelve un data URI listo para `<Image src>` o `background-image`.
 */
export function placeholderProducto(slug: string): string {
  const { vidrio, liquido, tapa } = TINTES[indiceDeTinte(slug)]

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" role="img" aria-label="Ilustración de un frasco de perfume">
<rect width="400" height="400" fill="${FONDO}"/>
<g transform="translate(200 214)">
<rect x="-16" y="-118" width="32" height="26" rx="3" fill="${tapa}"/>
<rect x="-10" y="-96" width="20" height="14" fill="${tapa}" opacity="0.55"/>
<rect x="-62" y="-84" width="124" height="164" rx="12" fill="${vidrio}" opacity="0.55"/>
<rect x="-62" y="-14" width="124" height="94" rx="12" fill="${liquido}" opacity="0.72"/>
<rect x="-48" y="-70" width="16" height="132" rx="8" fill="#FFFFFF" opacity="0.28"/>
<rect x="-62" y="-84" width="124" height="164" rx="12" fill="none" stroke="${tapa}" stroke-opacity="0.22" stroke-width="1.5"/>
<ellipse cx="0" cy="92" rx="74" ry="9" fill="${tapa}" opacity="0.12"/>
</g>
</svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
