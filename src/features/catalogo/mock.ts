import { type Coleccion, type Producto } from "./types"

/**
 * Datos de ejemplo para maquetar mientras Supabase no está conectado.
 *
 * BORRAR al conectar la base: las queries del DAL pasan a leer de `productos`.
 * Los precios son verosímiles pero inventados, y ningún producto tiene foto
 * (se muestra el frasco SVG de `placeholder.ts`).
 */
const base = {
  descripcion: null,
  activo: true,
  envio_gratis: true,
  imagen_url: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
} satisfies Partial<Producto>

/** Arma un producto con id y slug derivados del índice y el nombre. */
function crear(
  i: number,
  marca: string,
  nombre: string,
  precio: number,
  precio_lista: number | null,
  stock: number,
  colecciones: Coleccion[]
): Producto {
  const slug = `${marca} ${nombre}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

  return {
    ...base,
    id: `${String(i).padStart(8, "0")}-0000-4000-8000-000000000000`,
    slug,
    marca,
    nombre: `${marca} ${nombre}`,
    precio,
    precio_lista,
    stock,
    colecciones,
  }
}

export const PRODUCTOS_MOCK: Producto[] = [
  // — Más elegidos —
  crear(1, "Armaf", "Odyssey Homme White EDP 100ml", 93500, 135000, 12, ["destacado", "oferta"]),
  crear(2, "Armaf", "Club De Nuit Intense EDT 105ml", 88900, 119000, 8, ["destacado", "oferta"]),
  crear(3, "Al Haramain", "Amber Oud Gold EDP 120ml", 164000, null, 5, ["destacado"]),
  crear(4, "Xerjoff", "Erba Pura EDP 100ml", 412000, 520000, 3, ["destacado", "oferta"]),
  crear(5, "Lattafa", "Asad EDP 100ml", 76500, 98000, 20, ["destacado", "oferta"]),
  crear(6, "Rabanne", "Invictus EDT 100ml", 158000, null, 9, ["destacado"]),
  crear(7, "Dior", "Sauvage EDP 100ml", 289000, 340000, 6, ["destacado", "oferta"]),
  crear(8, "Jean Paul Gaultier", "Le Male EDT 125ml", 196000, null, 11, ["destacado"]),

  // — Decants 3x2 —
  crear(9, "Armaf", "Club De Nuit Urban Elixir Decant 5ml", 12400, null, 60, ["tres-por-dos"]),
  crear(10, "Lattafa", "Angham Decant 5ml", 9800, null, 45, ["tres-por-dos"]),
  crear(11, "Xerjoff", "Naxos Decant 5ml", 28900, null, 25, ["tres-por-dos"]),
  crear(12, "Tom Ford", "Oud Wood Decant 5ml", 34500, null, 18, ["tres-por-dos"]),
  crear(13, "Montale", "Intense Café Decant 5ml", 16800, null, 32, ["tres-por-dos"]),
  crear(14, "Mancera", "Cedrat Boise Decant 5ml", 18200, null, 28, ["tres-por-dos"]),
  crear(15, "Givenchy", "Gentleman Decant 5ml", 14600, null, 40, ["tres-por-dos"]),
  crear(16, "Valentino", "Uomo Born In Roma Decant 5ml", 15900, null, 35, ["tres-por-dos"]),

  // — Novedades —
  crear(17, "Rayhaan", "Nebras EDP 100ml", 68000, null, 22, ["novedad"]),
  crear(18, "French Avenue", "Liquid Brun EDP 100ml", 84000, null, 14, ["novedad"]),
  crear(19, "Carolina Herrera", "Bad Boy Cobalt EDP 100ml", 214000, null, 7, ["novedad"]),
  crear(20, "Afnan", "9PM Rebel EDP 100ml", 72500, null, 26, ["novedad"]),
  crear(21, "Lattafa", "Bade'e Al Oud Sublime EDP 100ml", 81000, null, 19, ["novedad"]),
  crear(22, "Armaf", "Ventana Blue EDP 100ml", 66000, null, 17, ["novedad"]),
  crear(23, "Versace", "Eros Flame EDP 100ml", 232000, null, 5, ["novedad"]),
  crear(24, "Cher", "Signature EDP 90ml", 118000, null, 10, ["novedad"]),

  // — Ofertas —
  crear(25, "Afnan", "Turathi Blue EDP 90ml", 72400, 96000, 0, ["oferta"]),
  crear(26, "Armaf", "Club De Nuit Precieux Extrait 55ml", 145000, 189000, 4, ["oferta"]),
  crear(27, "Lattafa", "Yara EDP 100ml", 58900, 79000, 30, ["oferta"]),
  crear(28, "Montale", "Arabians Tonka EDP 100ml", 178000, 235000, 6, ["oferta"]),

  // — Promociones —
  crear(29, "Lattafa", "Set Asad + Yara EDP", 128000, 176000, 15, ["promocion"]),
  crear(30, "Armaf", "Duo Club De Nuit Intense + Urban", 162000, 215000, 9, ["promocion"]),
  crear(31, "Afnan", "Kit 3 Decants a elección 5ml", 26400, 39600, 50, ["promocion"]),
  crear(32, "Xerjoff", "Set Descubrimiento 4 x 5ml", 96000, 132000, 12, ["promocion"]),
]
