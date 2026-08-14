/**
 * Convierte un texto en slug de URL.
 *
 * Saca acentos y eñes (`normalize("NFD")` separa la letra de su tilde, y el
 * rango ̀-ͯ descarta los diacríticos combinantes), así
 * "Al Haramain" → "al-haramain" y "Diseñador" → "disenador".
 *
 * Es la única definición de cómo se arma un slug en el proyecto: la usan el
 * mock y el filtro de marcas, para que el link y el dato coincidan siempre.
 */
export function aSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}
