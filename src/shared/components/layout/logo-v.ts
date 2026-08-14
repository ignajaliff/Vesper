/**
 * Contorno de la "V" de Vesper, para el logotipo del header.
 *
 * Se recorta del primer subpath de `LOGO_RELLENO` (ver `logo-trazos.ts`): es
 * la misma silueta vectorizada del wordmark, así que la letra del header y la
 * que se dibuja en la pantalla de carga son idénticas.
 *
 * La "V" es el único contorno del wordmark sin ojo interno, así que se dibuja
 * y se rellena con un solo path — no hace falta `fill-rule="evenodd"`.
 *
 * El viewBox está ajustado a la caja real de la letra (x 4.86–116.5,
 * y 5.12–115) más 3px de margen, para que el trazo no se corte contra el borde
 * y el alto lo controle el CSS.
 *
 * Si cambia el logo hay que regenerar `logo-trazos.ts` y volver a recortar
 * este subpath.
 */
export const V_VIEWBOX = { x: 1.86, y: 2.12, width: 117.64, height: 115.88 } as const

/** Longitud aproximada del contorno, para el `stroke-dasharray`. */
export const V_LARGO = 525

export const V_TRAZO =
  "M44.00 5.23Q59.25 5.33 61.36 5.94Q63.46 6.54 64.52 7.58Q65.58 8.61 65.62 9.54Q65.66 10.47 65.00 11.44Q64.35 12.41 63.05 13.17Q61.75 13.93 57.80 15.30Q53.84 16.66 52.94 17.62Q52.04 18.57 51.68 19.79Q51.33 21.00 52.42 45.50Q53.52 70.00 54.12 72.06Q54.72 74.13 55.40 74.77Q56.08 75.41 56.91 75.67Q57.75 75.94 59.12 75.27Q60.49 74.60 61.86 72.55Q63.22 70.50 75.10 46.38Q86.97 22.25 87.01 20.88Q87.05 19.51 86.33 18.38Q85.60 17.25 82.08 15.57Q78.56 13.89 77.80 13.23Q77.04 12.57 76.78 11.41Q76.52 10.25 77.06 9.09Q77.60 7.92 78.56 7.17Q79.53 6.42 80.89 6.03Q82.25 5.63 90.13 5.58Q98.00 5.53 105.37 6.04Q112.75 6.54 114.04 7.05Q115.33 7.56 115.92 8.43Q116.50 9.30 116.38 10.13Q116.26 10.95 115.58 11.81Q114.90 12.66 110.58 15.32Q106.26 17.98 104.38 19.99Q102.49 22.00 78.50 66.00Q54.51 109.99 53.22 111.49Q51.93 112.98 49.96 113.76Q48.00 114.53 44.38 114.76Q40.75 115.00 33.38 114.83Q26.00 114.66 24.01 113.85Q22.02 113.04 21.19 111.39Q20.37 109.75 16.70 65.62Q13.02 21.50 12.34 19.46Q11.66 17.42 8.97 15.37Q6.27 13.31 5.56 11.79Q4.86 10.26 5.73 8.84Q6.60 7.42 8.67 6.49Q10.75 5.56 19.63 5.35Q28.50 5.13 28.63 5.13Q28.75 5.12 44.00 5.23Z"
