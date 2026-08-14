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

/** Markup del velo, como string: lo inserta el script, no React. */
const MARCADO_VELO = `<svg id="carga-logo" viewBox="0 0 ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}">
<g class="carga-trazos" fill="none" stroke="#104FAC" stroke-width="2.5" stroke-linejoin="round">
${LOGO_TRAZOS.map(
  (t, i) =>
    `<path d="${t.d}" style="stroke-dasharray:${t.largo};stroke-dashoffset:${t.largo};animation-delay:${retardo(i)}ms"/>`
).join("\n")}
</g>
<path class="carga-relleno" d="${LOGO_RELLENO}" fill="#104FAC" fill-rule="evenodd"/>
</svg>`

/**
 * Velo de carga de la primera visita.
 *
 * Cubre la recarga con F5: en una carga fresca el navegador pinta blanco hasta
 * que React monta.
 *
 * IMPORTANTE — el velo NO es JSX, lo crea e inserta el script inline.
 * Cuando era un `<div>` renderizado por React, el `el.remove()` del final
 * borraba un nodo que React todavía tenía en su árbol, y **la primera
 * navegación posterior tiraba `insertBefore ... is not a child of this node`**
 * (verificado: sin el `remove()` el error desaparece). Creándolo por fuera,
 * React nunca lo conoce y puede eliminarse sin romper nada.
 *
 * Los estilos van inline: si dependieran de la hoja de Tailwind, habría un
 * parpadeo sin estilar antes de que ésta cargue.
 */
export function CargaInicial() {
  return (
    <>
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

/*
 * Bloquea el scroll mientras dura el velo: sin esto se puede scrollear la
 * página por detrás, y al retirarse aparece a mitad de camino.
 *
 * El cuerpo va con position fixed, NO solo con overflow hidden: medido, con
 * overflow la clase se aplica pero window.scrollBy() igual mueve la página
 * (scrollY llegaba a 1800). Fijándolo no hay nada que scrollear.
 *
 * overscroll-behavior none frena además el rebote del gesto táctil.
 * (Sin etiquetas HTML en este comentario: va dentro de un template literal
 * de JSX y cortarían el bloque.)
 */
html.carga-bloqueada {
  overflow: hidden;
  overscroll-behavior: none;
}
html.carga-bloqueada body {
  position: fixed;
  inset: 0;
  overflow: hidden;
  overscroll-behavior: none;
}

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

      {/*
        Salvaguarda sin JavaScript: el bloqueo del scroll viene puesto desde el
        server y lo saca el script. Si el JS no corre, la página quedaría
        trabada para siempre — esto lo libera.
      */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: `
html.carga-bloqueada, html.carga-bloqueada body {
  overflow: visible !important;
  position: static !important;
}
`,
          }}
        />
      </noscript>

      {/* Script de arranque: crea el velo, lo inserta y lo retira. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function () {
  var inicio = Date.now();
  var hecho = false;

  /*
   * El velo se crea por fuera de React a propósito: si fuera un nodo del
   * árbol de React, removerlo rompería la próxima navegación con
   * "insertBefore ... is not a child of this node".
   */
  var velo = document.createElement('div');
  velo.id = 'carga-inicial';
  velo.setAttribute('aria-hidden', 'true');
  velo.innerHTML = ${JSON.stringify(MARCADO_VELO)};

  /*
   * La clase que bloquea el scroll YA viene puesta desde el server (ver
   * layout.tsx). Acá solo se saca al retirar el velo: agregarla desde el
   * script rompería la hidratación de React.
   */
  var raiz = document.documentElement;

  function montar() {
    if (document.body && !document.getElementById('carga-inicial')) {
      document.body.appendChild(velo);
    }
  }
  if (document.body) montar();
  else document.addEventListener('DOMContentLoaded', montar);

  function ocultar() {
    if (hecho) return;
    hecho = true;
    // Espera lo que falte para completar el dibujado antes de desvanecer.
    var resta = Math.max(0, ${DURACION_MINIMA} - (Date.now() - inicio));
    setTimeout(function () {
      velo.classList.add('oculto');
      // Se libera el scroll al empezar el desvanecido, no al final: para
      // cuando el velo termina de irse la página ya responde.
      raiz.classList.remove('carga-bloqueada');
      // Por si el navegador restauró una posición previa (F5 a media página).
      window.scrollTo(0, 0);
      setTimeout(function () {
        if (velo.parentNode) velo.parentNode.removeChild(velo);
      }, 550);
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

  /*
   * Red de seguridad: si algo rompiera antes de que corra ocultar(), la clase
   * quedaría puesta y la página no scrollearía NUNCA. Este tope la saca sí o sí.
   */
  setTimeout(function () {
    raiz.classList.remove('carga-bloqueada');
  }, ${DURACION_MAXIMA + 2000});
})();
`,
        }}
      />
    </>
  )
}
