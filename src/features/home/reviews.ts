export type Review = {
  id: string
  nombre: string
  /** Ciudad o provincia, para dar contexto al envío. */
  lugar: string
  puntaje: 1 | 2 | 3 | 4 | 5
  texto: string
  producto: string
}

/**
 * Reseñas de producto para maquetar la sección de opiniones.
 *
 * ANDAMIAJE: son textos inventados para la demo, no opiniones reales de
 * clientes. Reemplazar por reseñas verificadas antes de publicar el sitio —
 * mostrar testimonios ficticios como reales es publicidad engañosa.
 */
export const REVIEWS_MOCK: Review[] = [
  {
    id: "r1",
    nombre: "Martina G.",
    lugar: "Córdoba",
    puntaje: 5,
    texto:
      "Llegó en dos días y bien embalado. La fijación es real, me duró toda la jornada laboral sin retocar.",
    producto: "Armaf Club De Nuit Intense",
  },
  {
    id: "r2",
    nombre: "Nicolás R.",
    lugar: "Rosario",
    puntaje: 5,
    texto:
      "Compré primero un decant para probar y terminé llevando el frasco. Buena idea poder testear antes.",
    producto: "Xerjoff Erba Pura",
  },
  {
    id: "r3",
    nombre: "Julieta P.",
    lugar: "CABA",
    puntaje: 4,
    texto:
      "El perfume es original, idéntico al que probé en la perfumería. Tardó un día más de lo estimado, nada grave.",
    producto: "Al Haramain Amber Oud Gold",
  },
  {
    id: "r4",
    nombre: "Federico M.",
    lugar: "Mendoza",
    puntaje: 5,
    texto:
      "Pagué por transferencia y el descuento se aplicó sin drama. Atención por WhatsApp rapidísima.",
    producto: "Afnan Turathi Blue",
  },
]

export type OpinionGoogle = {
  id: string
  nombre: string
  puntaje: 1 | 2 | 3 | 4 | 5
  texto: string
}

/** Puntaje agregado del perfil. ANDAMIAJE: reemplazar por el real. */
export const PUNTAJE_GOOGLE = { promedio: "5,0", total: 87 } as const

/**
 * Opiniones del perfil de Google Maps.
 *
 * ANDAMIAJE: textos de ejemplo. Reemplazar por las reseñas verdaderas antes de
 * publicar — atribuir opiniones inventadas a Google es publicidad engañosa y
 * además incumple los términos de la plataforma.
 */
export const OPINIONES_GOOGLE: OpinionGoogle[] = [
  {
    id: "g1",
    nombre: "Lucas Celis",
    puntaje: 5,
    texto:
      "Excelente atención y precios. Me mandaron el perfume a casa y llegó impecable. Recomiendo.",
  },
  {
    id: "g2",
    nombre: "Tomás Carpio",
    puntaje: 5,
    texto:
      "Muy buena selección de árabes. Me asesoraron para elegir y acertaron con la recomendación.",
  },
  {
    id: "g3",
    nombre: "Evan Peñaloza",
    puntaje: 5,
    texto: "Precios muy competitivos y mercadería original. Volvería a comprar.",
  },
  {
    id: "g4",
    nombre: "Jorge Morillas",
    puntaje: 5,
    texto:
      "Compramos varios decants con mi pareja. Muy conformes con la atención, nos queríamos llevar todo.",
  },
]
