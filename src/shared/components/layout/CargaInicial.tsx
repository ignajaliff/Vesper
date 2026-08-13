import {
  LOGO_RELLENO,
  LOGO_SILUETAS,
  LOGO_TRAZOS,
  LOGO_VIEWBOX,
} from "./logo-trazos"

/** Retardo entre trazo y trazo, para que se dibujen en orden. */
const PASO = 300
/** Cuánto tarda cada trazo. */
const DURACION_TRAZO = 2200
/** Momento en que entra el relleno sólido. */
const INICIO_RELLENO = LOGO_SILUETAS * PASO + DURACION_TRAZO - 850

/**
 * Retardo de cada contorno.
 *
 * Las siluetas van escalonadas; los ojos internos arrancan **a la vez que su
 * silueta**, no después, para que la línea del medio se dibuje junto con la
 * letra y no aparezca como un paso aparte al final.
 */
function retardo(i: number) {
  return (i < LOGO_SILUETAS ? i : i - LOGO_SILUETAS) * PASO
}
/**
 * Tiempo mínimo del velo: el dibujado completo + una pausa para apreciar el
 * logo ya terminado antes de que el velo se vaya.
 */
const DURACION_MINIMA = INICIO_RELLENO + 850 + 450
/** Tope duro: pase lo que pase, el velo no se queda más que esto. */
const DURACION_MAXIMA = DURACION_MINIMA + 1200

/**
 * Velo de carga de la primera visita.
 *
 * El `loading.tsx` de Next solo cubre navegaciones internas: al recargar con
 * F5 el navegador pinta blanco hasta que React monta. Este bloque va en el
 * HTML del layout raíz, así se ve desde el primer frame, y un script inline lo
 * retira cuando la página terminó de cargar.
 *
 * El logo se dibuja trazo a trazo con los contornos de `logo-trazos.ts`. Los
 * estilos van inline: si dependieran de la hoja de Tailwind, habría un
 * parpadeo sin estilar antes de que ésta cargue.
 */
export function CargaInicial() {
  return (
    <>
      <div id="carga-inicial" aria-hidden>
        <svg
          id="carga-logo"
          viewBox={`0 0 ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`}
        >
          <g
            className="carga-trazos"
            fill="none"
            stroke="#104FAC"
            strokeWidth={2.5}
            strokeLinejoin="round"
          >
            {LOGO_TRAZOS.map((t, i) => (
              <path
                key={i}
                d={t.d}
                style={{
                  strokeDasharray: t.largo,
                  strokeDashoffset: t.largo,
                  animationDelay: `${retardo(i)}ms`,
                }}
              />
            ))}
          </g>

          {/* UN SOLO path (siluetas + huecos) para que evenodd cale los
              espacios internos; con paths separados las letras salen macizas. */}
          <path
            className="carga-relleno"
            d={LOGO_RELLENO}
            fill="#104FAC"
            fillRule="evenodd"
          />
        </svg>
      </div>

      {/* CSS inline: si dependiera de la hoja de Tailwind habría parpadeo. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
#carga-inicial {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  background: #fff;
  transition: opacity .45s ease, visibility .45s ease;
}
#carga-inicial.oculto { opacity: 0; visibility: hidden; }

#carga-logo { width: min(62vw, 17rem); height: auto; }

/*
 * El trazo avanza recorriendo el contorno: stroke-dashoffset va de la longitud
 * total a 0, como si una pluma escribiera la palabra. Se compone en GPU, igual
 * que opacity — evitar filter: blur() animado, que hunde el framerate.
 */
.carga-trazos path {
  animation: carga-trazo ${DURACION_TRAZO}ms cubic-bezier(.55,.05,.35,1) forwards;
}
@keyframes carga-trazo {
  to { stroke-dashoffset: 0; }
}

/* El relleno entra cuando el trazo ya recorrió casi toda la palabra. */
.carga-relleno {
  opacity: 0;
  animation: carga-relleno 850ms ease-out ${INICIO_RELLENO}ms forwards;
}
@keyframes carga-relleno {
  to { opacity: 1; }
}

/* El trazo se apaga al entrar el relleno: si queda encima, su línea pisa el
   borde de los huecos y los ojos de las letras se ven tapados. */
.carga-trazos {
  animation: carga-trazo-salida 500ms ease-out ${INICIO_RELLENO + 300}ms forwards;
}
@keyframes carga-trazo-salida {
  to { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .carga-trazos { animation: none; opacity: 0; }
  .carga-trazos path { animation: none; stroke-dashoffset: 0; }
  .carga-relleno { animation: none; opacity: 1; }
}
`,
        }}
      />

      {/* Script de arranque: corre antes de que React monte. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function () {
  var inicio = Date.now();
  var hecho = false;

  function ocultar() {
    if (hecho) return;
    hecho = true;
    var el = document.getElementById('carga-inicial');
    if (!el) return;
    // Espera lo que falte para completar el dibujado antes de desvanecer.
    var resta = Math.max(0, ${DURACION_MINIMA} - (Date.now() - inicio));
    setTimeout(function () {
      el.classList.add('oculto');
      setTimeout(function () { el.remove() }, 550);
    }, resta);
  }

  /*
   * Se engancha a DOMContentLoaded, NO a 'load': 'load' espera a que bajen
   * las imágenes del hero (varios MB) y dejaba el velo ~15 s en pantalla.
   * El timeout es el tope duro por si algo del arranque falla.
   */
  if (document.readyState !== 'loading') ocultar();
  else document.addEventListener('DOMContentLoaded', ocultar);
  setTimeout(ocultar, ${DURACION_MAXIMA});
})();
`,
        }}
      />
    </>
  )
}
