import { type Producto } from "./types"

/**
 * Datos de ejemplo para maquetar mientras Supabase no está conectado.
 *
 * BORRAR al conectar la base: las queries del DAL pasan a leer de `productos`.
 */
const base = {
  descripcion: null,
  activo: true,
  envio_gratis: true,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
} satisfies Partial<Producto>

export const PRODUCTOS_MOCK: Producto[] = [
  {
    ...base,
    id: "11111111-1111-4111-8111-111111111111",
    slug: "armaf-odyssey-homme-white-edp-100ml",
    nombre: "Armaf Odyssey Homme White EDP 100ml",
    precio: 93500,
    precio_lista: 135000,
    stock: 12,
    imagen_url: null,
  },
  {
    ...base,
    id: "22222222-2222-4222-8222-222222222222",
    slug: "armaf-club-de-nuit-intense-edt-105ml",
    nombre: "Armaf Club De Nuit Intense EDT 105ml",
    precio: 88900,
    precio_lista: 119000,
    stock: 8,
    imagen_url: null,
  },
  {
    ...base,
    id: "33333333-3333-4333-8333-333333333333",
    slug: "al-haramain-amber-oud-gold-edp-120ml",
    nombre: "Al Haramain Amber Oud Gold EDP 120ml",
    precio: 164000,
    precio_lista: null,
    stock: 4,
    imagen_url: null,
  },
  {
    ...base,
    id: "44444444-4444-4444-8444-444444444444",
    slug: "xerjoff-erba-pura-edp-100ml",
    nombre: "Xerjoff Erba Pura EDP 100ml",
    precio: 412000,
    precio_lista: 520000,
    stock: 2,
    imagen_url: null,
  },
  {
    ...base,
    id: "55555555-5555-4555-8555-555555555555",
    slug: "afnan-turathi-blue-edp-90ml",
    nombre: "Afnan Turathi Blue EDP 90ml",
    precio: 72400,
    precio_lista: 96000,
    stock: 0,
    imagen_url: null,
  },
  {
    ...base,
    id: "66666666-6666-4666-8666-666666666666",
    slug: "azzaro-wanted-edt-100ml",
    nombre: "Azzaro Wanted EDT 100ml",
    precio: 178000,
    precio_lista: null,
    stock: 6,
    imagen_url: null,
  },
  {
    ...base,
    id: "77777777-7777-4777-8777-777777777777",
    slug: "al-oud-for-glory-edp-100ml",
    nombre: "Al Oud For Glory EDP 100ml",
    precio: 121500,
    precio_lista: 158000,
    stock: 9,
    imagen_url: null,
  },
  {
    ...base,
    id: "88888888-8888-4888-8888-888888888888",
    slug: "armaf-club-de-nuit-precieux-extrait-55ml",
    nombre: "Armaf Club De Nuit Precieux Extrait De Parfum 55ml",
    precio: 145000,
    precio_lista: 189000,
    stock: 5,
    imagen_url: null,
  },
]
