@AGENTS.md

# CLAUDE.md — Hoja de ruta del proyecto (Vesper)

> Este archivo es leído automáticamente por Claude al iniciar cualquier conversación en este proyecto.
> Contiene el contexto del sistema, las decisiones tomadas y el estado actual del desarrollo.
> **Mantenerlo actualizado es obligatorio** — es la memoria del proyecto entre sesiones.

---

## Proyecto

**Nombre**: Vesper
**Tipo**: E-commerce a medida
**Cliente**: Vesper
**Desarrollado por**: Nuvvora
**Inicio**: 2026-08-12

### Descripción del sistema

Tienda online de perfumes de autor. Catálogo por colección y familia olfativa, carrito,
checkout con Mercado Pago y panel de administración de productos y órdenes.

---

## Reglas del proyecto

Este proyecto respeta estrictamente los siguientes documentos. Leerlos antes de hacer cualquier cambio:

* [ai-pmp/rules.txt](ai-pmp/rules.txt) — Stack, arquitectura Server-first y reglas de código
* [ai-pmp/frontend-rules.txt](ai-pmp/frontend-rules.txt) — Server/Client Components, formularios, estado, RBAC, SEO
* [ai-pmp/supabase-rules.txt](ai-pmp/supabase-rules.txt) — @supabase/ssr, RLS, seguridad, queries
* [ai-pmp/ecommerce-rules.txt](ai-pmp/ecommerce-rules.txt) — Catálogo, carrito, checkout, stock, órdenes
* [ai-pmp/payments-rules.txt](ai-pmp/payments-rules.txt) — Integración y seguridad de Mercado Pago
* [ai-pmp/error-handling.txt](ai-pmp/error-handling.txt) — Manejo de errores y estados de carga
* [ai-pmp/naming-rules.txt](ai-pmp/naming-rules.txt) — Convenciones de nombres
* [ai-pmp/git-rules.txt](ai-pmp/git-rules.txt) — Commits y ramas

---

## Stack del proyecto

* Next.js 16.3 (App Router) + React 19.2 + TypeScript strict
* Turbopack (bundler por defecto)
* Tailwind CSS v4 + shadcn/ui (estilo `radix-nova`, base color `neutral`)
* Supabase (auth + base de datos + storage) vía `@supabase/ssr` — **no conectado todavía**
* TanStack React Query v5 (solo cliente)
* React Hook Form + Zod v4
* Zustand (carrito, persistido en localStorage)
* Mercado Pago (Checkout Pro) — pendiente

> Nomenclatura de keys de Supabase usada en este proyecto: **anon / service_role** (definir al crear el proyecto).
> Los componentes de shadcn viven en `src/shared/components/ui/` (alias configurado en `components.json`).

---

## Comandos

```
npm run dev          → servidor de desarrollo (Turbopack)
npm run build        → build de producción (debe pasar sin errores antes de entregar)
npm run typecheck    → tsc --noEmit (correr antes de entregar cualquier cambio)
npm run lint         → linter
```

### `npm run build` con el `dev` corriendo (OneDrive)

El proyecto vive en OneDrive, que bloquea archivos mientras los sincroniza. Si
el servidor de desarrollo está levantado, el build falla con
`EPERM: operation not permitted, unlink '.next\server\app\(shop)\...'`.

**NO borrar `.next` para destrabarlo**: si el `dev` está corriendo, se le borran
los archivos en caliente y el servidor se cae (pasó, el cliente reportó "se cayó
el localhost"). En su lugar, buildear a otro directorio:

1. Agregar temporalmente `distDir: process.env.NEXT_DIST_DIR || ".next"` a `next.config.ts`
2. `NEXT_DIST_DIR=".next-verify" npm run build`
3. Restaurar el config y borrar `.next-verify`

Si el `dev` está apagado, `rm -rf .next` es seguro.

---

## Módulos del sistema

| Módulo | Estado | Tablas Supabase | Notas |
|--------|--------|-----------------|-------|
| Base / scaffold | Completo | — | estructura, layout, providers |
| Home | UI lista | — | hero, marcas, 4 categorías, 5 carruseles, opiniones |
| Auth | Pendiente | user_roles | DAL en `src/data/auth.ts` (stub) |
| Catálogo | UI lista | productos, categorias | grilla + card + ficha listas; DAL lee de `mock.ts` |
| Carrito | UI lista | — | Zustand + localStorage, sin UI de página |
| Checkout / Pagos | Pendiente | ordenes, items_orden | Mercado Pago |
| Admin | Pendiente | — | protegido por rol |

Estados: `Pendiente` / `En desarrollo` / `UI lista` / `Completo`

---

## Base de datos — Tablas creadas

```
[Ninguna todavía — Supabase no está conectado]
```

Modelo previsto (ver `ai-pmp/ecommerce-rules.txt`):
```
- user_roles    → roles (admin, gerente, cliente)
- productos     → catálogo (slug, precio, stock)
- categorias    → colecciones / familias olfativas
- ordenes       → cabecera de orden (estado, total, pago_id)
- items_orden   → detalle (precio_unitario congelado)
```

---

## Roles del sistema

| Rol | Permisos |
|-----|----------|
| admin | Acceso total: productos, órdenes, usuarios |
| gerente | Productos y órdenes; sin gestión de usuarios |
| cliente | Comprar, ver sus propias órdenes |

**Alta de usuarios**: signup abierto crea rol `cliente` (trigger `handle_new_user`). El admin sube roles desde el dashboard / service key.

---

## Checklist de seguridad

- [ ] Tabla `user_roles` con RLS propio: nadie modifica su rol desde el cliente
- [ ] Función `tiene_rol()` con `SECURITY DEFINER`
- [ ] Trigger `handle_new_user` (rol por defecto: `cliente`)
- [x] Autorización en el DAL con `getUser()` (NUNCA `getSession()`) — `src/data/auth.ts`
- [x] `proxy.ts` usado solo para redirects de UX, no como barrera de seguridad
- [ ] Toda tabla nueva: RLS + `WITH CHECK` en escritura
- [ ] Toda tabla nueva: trigger `updated_at` + constraints SQL
- [ ] Dinero en `numeric(12,2)` — nunca float
- [x] Total de orden recalculado en el server (contrato definido en `features/checkout/`)
- [ ] Stock descontado solo tras pago aprobado, de forma atómica
- [ ] Webhook de Mercado Pago: firma validada + re-consulta del pago + idempotente
- [x] Secretos (access token MP, service key) sin prefijo `NEXT_PUBLIC_` — ver `.env.example`
- [ ] Después de cada cambio de schema: correr `get_advisors` del MCP

---

## Decisiones técnicas tomadas

* **Componentes shadcn en `src/shared/components/ui/`** (no `src/components/ui/`), para respetar la estructura por dominio de `rules.txt`. Alias ajustado en `components.json`.
* **`form.tsx` escrito a mano**: el registro `radix-nova` de shadcn no lo trae. Es la implementación estándar sobre React Hook Form.
* **Carrito en Zustand + `persist` a localStorage** (`vesper-carrito`). Sin tabla `carritos` por ahora.
* **`src/integrations/supabase/types.ts` es un placeholder**: regenerar con `supabase gen types` al conectar el proyecto.
* **Grupo de rutas `(shop)`** contiene la home: el header/footer viven en `app/(shop)/layout.tsx`, no en el layout raíz.
* **Logo**: `public/vesper-logo.png` (wordmark azul, 440×154, fondo transparente) reemplaza el texto "Vesper" en header, footer y menú móvil. Se recortó el aire del original (480×480) para que el alto lo controle el CSS.
* **El header lleva el wordmark completo** (`/vesper-logo.png`), igual que `MobileNav` y `SiteFooter`. Se probó reemplazarlo por la "V" contorneada y el cliente lo revirtió: esa letra va en el **favicon**, no en el header.
* **Favicon: la "V", en DOS versiones según el tamaño** (2026-08-14). Next toma los tres por convención de nombre en `src/app/`:
  * `icon0.png` (32px) — **la V RELLENA**. Es el que se ve en la pestaña. A 16–32px el hueco del contorno mide menos de un píxel y la letra se empasta en una mancha azul: **medido con las tres variantes ampliadas**, la rellena es la única legible.
  * `icon1.png` (512px) — **la V CONTORNEADA**, que es el logotipo que pidió el cliente. Se usa en buscadores, PWA y vista previa al compartir, donde el tamaño alcanza.
  * `apple-icon.png` (180px) — contorneada; a ese tamaño todavía se lee.
  * **Regenerarlos desde `logo-v.ts` si cambia el logo**, y **verificar ampliando a 16px con `kernel: "nearest"`** antes de darlos por buenos: a tamaño real no se distingue si se empastó.
* **`logo-v.ts` es el contorno de la "V"**, recortado del **primer subpath de `LOGO_RELLENO`**: es el único contorno del wordmark **sin ojo interno**, así que se dibuja con un solo path y no necesita `fill-rule="evenodd"`. Su caja real es x 4.86–116.5, y 5.12–115, y el `viewBox` le suma 3px de margen para que el trazo no se corte.
* **`LogoV.tsx` no se usa en la app**: quedó como componente listo por si hace falta la V contorneada en pantalla. `logo-v.ts` sí se usa — es la fuente para regenerar los favicons.
* **Home calcada de vesper.com.ar** (Tiendanube): hero slider → barra de 4 beneficios → "Best sellers" → "Ofertas". A diferencia del sitio actual, los slides llevan titular/bajada/CTA **en HTML sobre la imagen**, no quemados en el banner (SEO + accesibilidad). Los slides se editan en `features/home/slides.ts`.
* **Reglas comerciales de precio en `lib/precios.ts`**: 20% OFF por transferencia y 3 cuotas sin interés se derivan del `precio`, no se guardan por producto. Si el negocio las cambia, se toca un solo archivo.
* **`productos.precio_lista`** (nullable) es el precio tachado; el `-31% OFF` se calcula, no se carga a mano. Constraint pendiente en la base: `precio_lista >= precio`.
* **`features/catalogo/mock.ts` es andamiaje**: el DAL devuelve esos 8 productos para poder maquetar. **Borrar al conectar Supabase**.
* **`updateSession()` es no-op si faltan `NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY`**: sin esa guarda el proxy tira 500 en toda ruta mientras Supabase no esté conectado. Al cargar las credenciales, el refresco de sesión se activa solo.
* **Paleta de marca — cuatro colores, definida por el cliente** (2026-08-12): azul del logo `#104FAC` → `--primary`, azul oscuro `#0A2E66` → `--accent`, negro puro `#000000` → `--foreground`, blanco puro `#FFFFFF` → `--background`. Los grises son negro a opacidad reducida, no colores nuevos. El azul se muestreó del PNG del wordmark (era el color dominante, 3001px), no se eligió a ojo. `--destructive` y `--ring` apuntan al mismo azul: los `% OFF` y el precio de transferencia salen en azul, no en rojo. Todo el color vive en `globals.css`: ningún componente hardcodea hex.
* **El logo va sin filtros de color.** En una iteración previa se lo desaturó a tinta para que pegara con una paleta cálida; el cliente lo rechazó. El azul del wordmark ES el color de marca. No aplicarle `grayscale`/`brightness-0`.
* **Fondos de marca al 8-15% de opacidad** (`bg-accent/8`, `from-primary/10`): el azul oscuro a opacidad plena en secciones grandes tapa el texto y satura la página. Los planos de color fuertes quedan reservados a las marquesinas.
* **El Hero va con texto blanco sobre velo suave** (`from-black/55 via-black/20 to-transparent`) **+ `text-shadow` en cada línea de texto**: `fondo-hero1.png` y `fondo-hero2.png` son fotos oscuras y con detalle (dorados, rosas secas, madera). Un velo denso las apagaba —el cliente lo rechazó— así que el contraste lo aporta la sombra del texto, no el oscurecimiento de la foto. **Si se tocan las opacidades, verificar que el titular siga legible sobre las zonas claras de ambas fotos.** Flechas, filetes y bajada también están en blanco.
* **Las imágenes del hero pesan ~7 MB cada una** (1408×768 PNG). Next las optimiza al servirlas, así que no rompen la carga, pero conviene reemplazarlas por WebP/AVIF comprimidos antes de producción.
* **`--marca-profundo`** (~#061A3D) es un quinto token fuera de la paleta de cuatro colores, reservado a la cinta de anuncios: el `--accent` no tenía peso suficiente para separarse del header blanco. No usarlo en otro lado sin consultar.
* **`CuatroCategorias` reemplazó a `TresDestacados`** (2026-08-13): cuatro accesos —Nicho, Diseñador, Árabe, Decants 2x1— entre la franja de marcas y el primer carrusel. Va con `pt-6` y no más: con `py-14`, el aire blanco entre el hero y la grilla hacía leer la foto del hero como si cortara antes de tiempo. El cliente lo reportó como "se ve un poco blanco al final" — no era un hueco del hero, era el padding del vecino.
* **`BarraBeneficios` se eliminó** (2026-08-13): los cuatro beneficios (envío gratis, 3 cuotas, 20% transferencia, 100% originales) ya se anuncian en la marquesina del header y se repiten en la ficha de producto. La barra los decía por tercera vez. **Ojo al buscarla**: la marquesina de beneficios del header también lleva `aria-label="Beneficios"`, así que un grep por ese texto da un falso positivo.
* **`--radius: 0.25rem`** y botones `rounded-none` en CTAs: el ángulo vivo es parte del lenguaje editorial. Si se sube el radio, se pierde.
* **Tipografía**: `Fraunces` (serif variable, ejes SOFT/WONK/opsz) para titulares vía `--font-heading` + utilidad `font-heading`; Geist Sans para texto corrido. Dos utilidades propias en `globals.css`: `eyebrow` (versalita espaciada de rótulo) y `filete` (rayita bajo los títulos de sección).
* **Logo recoloreado por CSS**, no por archivo: el `vesper-logo.png` es azul y rompía la paleta cálida. Se neutraliza con `brightness-0 contrast-125 grayscale` (y `dark:invert`) en `SiteHeader` y `SiteFooter`. Al recibir el logo definitivo de marca, quitar esas clases.
* **`features/catalogo/placeholder.ts`**: frasco SVG inline (data URI) para productos sin foto. El tinte se deriva del slug con un hash djb2 —no con una suma de caracteres, que mandaba slugs parecidos al mismo color—. `ProductoCard` lo usa solo si `imagen_url` es null, así que deja de aplicarse solo al cargar Storage.
* **`ProductoCard` reserva el renglón del precio tachado** aunque el producto no tenga `precio_lista`: sin eso, el filete de financiación queda a distinta altura en cada card de la grilla.
* **`getProductosEnOferta` ordena por descuento descendente**, no por orden de inserción: además de ser lo correcto comercialmente, evita que la home repita en "En oferta" los mismos productos de "Los más elegidos".
* **Las DOS marquesinas son hermanas del `<header>`, no hijas** — el sticky es el `<header>` mismo. Pedido explícito del cliente: al scrollear solo debe quedar fijo el header (logo + buscador + categorías); las dos barras publicitarias se van con la página. Además, `position: sticky` solo se desplaza dentro de su padre: con las cintas adentro y el sticky en un `div` interno, el header terminaba scrolleándose fuera de pantalla. Estructura correcta: `<> <Marquesina anuncios/> <header sticky>…</header> <Marquesina beneficios/> </>`. Verificado: a scrollY 600, header `top=0`, cintas en `-600` y `-450`.
* **Header sticky de dos filas** (`SiteHeader` es Client Component por el scroll): logo + `Buscador` + favoritos/cuenta/bolsa → `NavPrincipal` con paneles. Al pasar `UMBRAL_COMPACTO` (40px) la fila del logo baja de `h-24` a `h-16`.
* **El footer usa `bg-marca-profundo`** (el mismo azul de la cinta de anuncios), con títulos en `font-bold`, texto en `text-white/70` y el logo invertido a blanco por CSS (`brightness-0 invert`) — el wordmark azul desaparecería sobre ese fondo. El padding se comprimió de `py-16` a `py-10`.
* **`FranjaMarcas` es una cinta a todo el ancho justo debajo del hero** (antes iba entre las dos grillas, estática, y después como tarjeta con título). Va **sin encabezado** por pedido del cliente. Reusa `marquesina-pista` y difumina los extremos con `mask-image`. Cada marca es un `<Link>` al catálogo y mantiene el hover en `text-primary`; la animación se pausa con `group-hover:[animation-play-state:paused]` para poder apuntarle a una.
* **`/marcas/[marca]` filtra de verdad desde 2026-08-13**: 19 páginas prerenderizadas, una por marca con productos. La marca es clickeable en la franja de la home, en cada tarjeta y en la ficha (encabezado + miga de pan). Una marca inexistente da 404. **Verificado marca por marca**: las 19 devuelven 200 y ninguna muestra productos de otra.
* **El `href` de `MARCAS` se DERIVA del nombre con `aSlug`, nunca se escribe a mano.** `getProductosPorMarca` compara contra `aSlug(producto.marca)`, así que un href cargado suelto con un typo daría una **página vacía sin ningún error**: la ruta existiría y la query no encontraría nada. Derivándolo, link y filtro salen de la misma función. `NOMBRES_MARCAS` es la lista; el nombre debe coincidir exacto con `productos.marca`.
* **`lib/slug.ts` (`aSlug`) es la única definición de cómo se arma un slug**: la usan `mock.ts` para los slugs de producto y `site.ts`/`queries.ts` para los de marca. Saca acentos y eñes con `normalize("NFD")` + descarte del rango `̀-ͯ`, así "Al Haramain" → `al-haramain`.
* **El slug de marca no se guarda, se deriva**: mientras la marca sea un texto en `productos.marca` no hay dónde guardarlo. Al normalizar marcas en su propia tabla, `getProductosPorMarca` pasa a ser un join por `marcas.slug`.
* **Dos marquesinas, un solo componente**: `Marquesina` recibe `mensajes`, `duracion`, `sentido`, `separador`, `etiqueta` y `className`. Las cintas NO rotan mensaje por mensaje — se desplazan en loop continuo. Las dos viven en `SiteHeader`; **el footer no lleva ninguna** (se probó una tercera arriba del footer y el cliente la sacó).
* **Las cintas van deliberadamente desincronizadas**: la de anuncios va a la **izquierda** en 45s y con puntos separadores; la de beneficios va a la **derecha** en 38s y sin puntos. Sentidos y duraciones distintos a propósito, para que nunca se lean como un bloque sincronizado. Si se igualan las duraciones, se pierde el efecto.
* **`priority` del Hero se decide por URL, no por índice** (`slide.imagenUrl === HERO_SLIDES[0].imagenUrl`): el tercer slide reusa `fondo-hero1.png`, y con `priority={i === 0}` Next avisaba de un LCP sin prioridad aunque la imagen ya estuviera precargada.
* **`NAV_PRINCIPAL` cambió de forma**: ahora es `ItemNav[]` con `panel?` opcional (columnas de subcategorías). `SiteFooter` sigue funcionando porque solo lee `href`/`label`.
* **El panel abre por hover con mouse y por clic en táctil**: se detecta con `matchMedia("(hover: hover) and (pointer: fine)")` vía `useSyncExternalStore` (no `useState` + `useEffect`: el linter de React lo rechaza por renders en cascada, y el snapshot del server devuelve `false` así que el HTML inicial nunca asume hover). Sin esa distinción, en celular el primer toque abriría el menú en vez de navegar. El cierre lleva **120 ms de retardo** para poder cruzar el hueco entre el botón y el panel sin que se cierre en el camino, y los ítems sin panel (Inicio) cierran el que esté abierto.
* **Marquesina por CSS puro** (`@keyframes marquesina` + utilidad `marquesina-pista`): la lista se renderiza **cuatro** veces y la pista se corre `-50%`, así el reinicio del loop cae en un punto idéntico y no se ve el corte. Cuatro copias, no dos, para que la pista supere el ancho de monitores anchos y no queden huecos. Solo la primera se anuncia; el resto va con `aria-hidden`. Respeta `prefers-reduced-motion`.
* **Para capturar screenshots hay que congelar las animaciones con `animation: none`**, no con `animation-play-state: paused`: con `paused` el screenshot igual expira a los 30s y Playwright devuelve **un fotograma viejo**, que parece un bug de la UI cuando en realidad la captura está desactualizada. Inyectar el estilo **después** del `goto` (si se inyecta antes, la navegación lo descarta), y verificar el estado por DOM (`querySelector`) antes de confiar en lo que muestra la imagen.
* **El panel de `NavPrincipal` necesita `relative` en su contenedor**: se posiciona con `absolute top-full`, así que sin ancestro posicionado se anclaba al `<header>` sticky y caía al pie de todo el header. Lleva además `z-20` para quedar sobre la marquesina de beneficios, que va después en el DOM.
* **El panel es una tarjeta acotada anclada al botón que lo abre**, no una barra a todo el ancho ni un bloque siempre centrado: al abrir se mide el centro del disparador con `getBoundingClientRect()` (relativo al contenedor, que es el ancestro `relative`) y se aplica por `style.left` + `-translate-x-1/2`. El valor se acota con `MAX_PANEL`/`MARGEN` para que un ítem del borde —SALE— no empuje la tarjeta fuera de la pantalla. Mide solo lo que necesitan sus columnas (426px con dos, 226px con una). **No muestra productos** — se probó con una vista previa del catálogo y el cliente la rechazó.
* **La animación de carga dibuja el logo trazo a trazo, y nada más.** El fondo (nubes de vapor, partículas de aerosol) se eliminó por pedido del cliente: solo queda el wordmark sobre blanco. Iteraciones descartadas antes de llegar acá: letras difuminándose en el lugar (se leía como gotas de agua), barrido lateral, y zoom-out con foco.
* **`logo-trazos.ts` son los contornos del wordmark vectorizados** desde `public/vesper-logo.png`. **El trazado se hace sobre una versión x4 (lanczos) + suavizado por media móvil + salida en curvas de Bézier**: el PNG es 440×154 y sus bordes vienen pixelados, así que trazarlo directo copiaba la escalera y los contornos salían ondulados. Son 3 siluetas (el wordmark es cursiva y varias letras comparten contorno) + 3 ojos internos, cada uno con su `largo` para el `stroke-dasharray`. **Si cambia el logo hay que regenerarlos** — el trazador quedó en el scratchpad de la sesión, no en el repo.
* **Al regenerar: el seguimiento de bordes detecta cada ojo DOS veces**, como silueta y como hueco. Hay que descartar las siluetas cuya caja coincide con la de un hueco; si no, `evenodd` las cuenta dos veces y **el ojo vuelve a rellenarse de azul**. Verificar muestreando el color del píxel en el centro de cada ojo, no a ojo en una captura chica.
* **El dibujado va en dos capas**: `<g>` de trazo (`fill:none` + `stroke`) que recorre los 6 contornos con `stroke-dashoffset` de `--largo` a 0, y **un único `<path>`** de relleno que entra con un fundido al final. Los ojos internos arrancan **a la vez que su silueta** (`retardo()`), no después: si van escalonados al final, se ven como un paso aparte. El grupo de trazo se desvanece al entrar el relleno, porque su línea pisa el borde de los huecos.
* **El relleno DEBE ser un solo path** (`LOGO_RELLENO`, siluetas + huecos concatenados) con `fillRule="evenodd"`. Con un path por letra, `evenodd` no puede calar nada: cada uno se rellena por su cuenta y las letras salen macizas — se pierden la muesca de la "V" y los ojos de las "e"/"p".
* **NUNCA animar `filter: blur()` en la pantalla de carga.** Ésta fue la causa real del "se ve en ráfaga" que el cliente reportó tres veces; ajustar keyframes y duraciones no lo arreglaba. Un blur que cambia de escala obliga al navegador a **recalcular el desenfoque en cada frame**. Medido con 20 elementos así: 54.4 FPS, percentil 95 de 33 ms, peor frame 83 ms, 7 saltos visibles. Reescrito para animar solo `transform`/`opacity`: **59.6 FPS, p95 17 ms, peor frame 33 ms, 1 salto**. Las dos reglas que lo sostienen:
  1. **El desenfoque de nubes y gotitas sale de un `radial-gradient`**, no de `filter`. Un degradado se rasteriza una vez y la GPU solo lo compone.
  2. **El logo va en dos capas superpuestas** (`logo-capa-difusa` con blur FIJO + `logo-capa-nitida`) y el paso de difuso a definido se hace **cruzando opacidades**. La escala la anima el contenedor por separado.
  Si en el futuro se toca esta animación, volver a medir FPS antes de darla por buena.
* **La carga anima el PNG del wordmark, no texto en Fraunces**: el logo de Vesper es un itálico grueso propio que ninguna fuente del proyecto replica. Se probó con texto y el cliente pidió "la misma tipografía que el logo de arriba a la izquierda". En `CargaInicial` va como `<img>` crudo (no `next/image`) porque el velo se pinta antes de que React monte.
* **Duración del velo: ~2 s** desde que aparece (`DURACION_MINIMA` 1500 ms, tope 2600 ms). Medir siempre desde que `#carga-inicial` existe, no desde el `goto`: en dev el primer render incluye la compilación de la ruta e infla el número a más de 10 s.
* **UNA sola pantalla de carga, y solo al entrar o recargar** (2026-08-13): `CargaInicial` (en el layout raíz) cubre la **primera visita y la recarga con F5**. Lleva CSS y JS **inline** a propósito — si dependiera de la hoja de Tailwind habría un parpadeo sin estilar antes de que cargue.
  * **Se eliminaron `PantallaCarga` y los `loading.tsx`** de `(shop)` y `productos`: hacían aparecer el velo del logo en **cada navegación interna** (por ejemplo al abrir una ficha de producto), y el cliente lo pidió solo al principio. Sin `loading.tsx` la navegación es instantánea porque las rutas son estáticas.
  * Al borrarlos quedaron huérfanas las utilidades `logo-trazo`/`logo-relleno`/`logo-trazo-salida` de `globals.css` (`CargaInicial` tiene su propio CSS inline): también se sacaron.
  * **Si en el futuro se agrega un `loading.tsx`**, el velo del logo vuelve a aparecer en cada navegación. Para estados de carga por ruta, usar un skeleton de la sección, no el logo.
* **El velo de `CargaInicial` NO es JSX: lo crea e inserta el script inline** (2026-08-14). Cuando era un `<div>` renderizado por React, el `el.remove()` del final borraba un nodo que React todavía tenía en su árbol, y **la primera navegación posterior tiraba `Failed to execute 'insertBefore' on 'Node'`** — el cliente lo reportó al intentar abrir un perfume. Verificado aislando la causa: neutralizando el `remove()` el error desaparecía. Creándolo por fuera del árbol, React nunca lo conoce y se puede eliminar sin romper nada. **Si alguna vez se vuelve a renderizar el velo como JSX, el error vuelve.**
* **El velo bloquea el scroll mientras dura** (2026-08-14, pedido del cliente). Tres decisiones que hay que respetar juntas:
  1. **`position: fixed` en el cuerpo, NO solo `overflow: hidden`.** Medido: con `overflow` la clase se aplica pero `window.scrollBy()` igual mueve la página — `scrollY` llegaba a 1800. Fijándolo no hay nada que scrollear.
  2. **La clase `carga-bloqueada` se renderiza YA en el server** (`layout.tsx`) y el script solo la SACA. Agregarla desde el script rompe la hidratación: React ve un `class` distinto al del HTML del server y avisa *"A tree hydrated but some attributes didn't match"* — verificado, aparecía en los 8 escenarios de navegación.
  3. **Va con salvaguarda `<noscript>` y un `setTimeout` de tope duro.** Como el bloqueo viene puesto desde el server, si el JS no corre o falla la página quedaría trabada para siempre.
  * Al liberar se hace `window.scrollTo(0, 0)`: si el navegador restauró una posición previa (F5 a media página), el velo se retira y la página aparece arrancando arriba.
* **`CargaInicial` se engancha a `DOMContentLoaded`, NUNCA a `load`**: con `load` esperaba a que bajaran las imágenes del hero (~7 MB cada una) y el velo se quedaba **15 segundos** en pantalla. Medido.
* **No poner etiquetas HTML dentro de los comentarios de `CargaInicial`**: el CSS y el script viven en template literals de JSX, y un `<html>` o `<body>` en un comentario corta el bloque y rompe el parseo. Además tiene `DURACION_MINIMA` (2400 ms, para que el rociado se vea entero) y `DURACION_MAXIMA` (3600 ms, tope duro por si el arranque falla). Ciclo real medido: letras en cascada a ~1.9 s, nombre completo a ~3.0 s, desvanecido a ~3.9 s, retirado a ~4.5 s.
* **Reviews en grilla fija, sin carrusel**: pedido explícito del cliente — arrastrar para leer esconde la mitad del contenido.
* **`CarruselProductos` reemplazó a `SeccionProductos`**: fila desplazable de 4 productos por vista (2 en tablet, 1.4 en mobile, para que la card cortada sugiera que hay más). Usa **scroll nativo con `snap-x`**, no una librería: funciona sin JS, respeta el gesto táctil y no suma dependencias. Las flechas mueven una página (`clientWidth`) y se deshabilitan en los extremos.
* **El encabezado del carrusel es solo título + "Ver todo"** (2026-08-13): se sacaron las props `ojal` y `descripcion`. Los rótulos ("Selección", "Recién llegados") y las bajadas ("Las fragancias que más salen del depósito…") sumaban tres renglones de texto antes de cada fila de productos y empujaban el catálogo hacia abajo. Pedido explícito del cliente.
* **El título del carrusel va CENTRADO, con "Ver todo" a la derecha** (2026-08-14). Se arma con `grid-cols-[1fr_auto_1fr]` y una celda vacía a la izquierda, **no con `justify-between`**: con flex, el título se centra respecto del hueco que deja el CTA y queda corrido a la izquierda. Verificado a 1600px: centro del título 800 = centro de la ventana.
* **Las secciones de producto van a `max-w-[100rem]` con `lg:px-10`**, no `max-w-6xl`: el cliente reportó "demasiado espacio en los costados". Aplica a `CarruselProductos`, `/productos`, `/marcas/[marca]` y `CuatroCategorias`. **La ficha y las secciones de opiniones se dejaron en `max-w-6xl`** — ahí el ancho limitado ayuda a leer.
* **Con la sección ancha, la grilla suma una quinta columna** (`xl:grid-cols-5` y `xl:w-[calc((100%-4rem)/5)]` en el carrusel): con 4 cards a todo el ancho, cada una quedaba enorme. Verificado: 5 por vista a 1600px, márgenes de 40px.
* **Las flechas del carrusel flotan sobre los extremos de la fila**, no en el encabezado: van `absolute top-1/2` dentro de un contenedor `relative` que envuelve el `<ul>`, ligeramente afuera (`-left-4`/`-right-4`). Quedan a la altura de las cards, que es donde el ojo las busca. Se ocultan con `disabled:opacity-0` en vez de verse grises: una flecha apagada en el borde de la foto se lee como suciedad. **Verificado**: fila de x=168 a x=1272, flechas en 148 y 1252, mismo centro vertical.
* **La home tiene 5 carruseles seguidos**: Los más elegidos → Decants 3x2 → Novedades → Ofertas → Promociones. Después van las dos secciones de opiniones.
* **`FranjaEditorial` ("Sobre Vesper" / "Una fragancia no se elige por la etiqueta") se eliminó** (2026-08-13): iba entre Novedades y Ofertas y cortaba la seguidilla de carruseles con un bloque de texto largo. Pedido explícito del cliente.
* **`Producto` ganó `marca` y `colecciones`**: `colecciones` es un `Coleccion[]` (`destacado`/`tres-por-dos`/`novedad`/`oferta`/`promocion`) que alimenta cada carrusel vía `getProductosPorColeccion`. Al conectar Supabase esto pasa a ser tabla puente o columnas booleanas. El mock creció a 32 productos para que cada sección muestre cosas distintas.
* **`ProductoCard` recorta la marca del `nombre`** cuando lo repite: el rótulo de marca va arriba en versalita, así que mostrar "Armaf Armaf Odyssey…" sería redundante.
* **Dos secciones de opiniones, deliberadamente distintas**: `Reviews` (reseñas de producto, tarjetas sobre `bg-secondary`, con "Compra verificada") y `OpinionesGoogle` (perfil del negocio, sin tarjeta, cita centrada y filete). **Las estrellas van en azul de marca, no en el amarillo de Google**: el amarillo rompe la paleta y hace ver la sección como un widget pegado.
* **`OPINIONES_GOOGLE` y `PUNTAJE_GOOGLE` son andamiaje**. Reemplazar por las reseñas reales antes de publicar: atribuir opiniones inventadas a Google es publicidad engañosa y además incumple los términos de la plataforma.
* **Carrito con ícono `ShoppingBag`**, no `ShoppingCart`: decisión de marca del cliente ("que sea como una bolsa").
* **`/productos/[slug]` existe desde 2026-08-13**: `ProductoCard` linkeaba ahí desde el principio, pero la ruta no estaba creada — **cada clic en un perfume daba 404**. Usa `generateStaticParams` + `getSlugsActivos`, así las 32 fichas se prerenderizan en build. La UI vive en `features/catalogo/components/DetalleProducto.tsx` (Server Component).
* **Orden de la ficha, definido por el cliente** (2026-08-13): foto a la izquierda; a la derecha marca → nombre → precio + tachado → cuotas → transferencia → cantidad → Comprar → descripción. Debajo, a todo el ancho: **Pirámide olfativa** (salida/corazón/base) → **Cómo se comporta** (duración, estela, uso, época) → **Otros perfumes** → **opiniones de Google** → footer.
* **Orden de la tarjeta, definido por el cliente**: `-29%` arriba a la izquierda, corazón arriba a la derecha, foto de extremo a extremo, y debajo marca → nombre → **selector de ml** → **precio en negrita** + precio tachado al lado → cuotas subrayadas. El signo menos va adelante (`-29%`, no `29% off`).
* **La tarjeta va enmarcada con un filete de 1px** (`border-border/70`, que se oscurece a `foreground/25` en hover) y un filete horizontal entre la foto y el texto. Pedido del cliente: "trazos finos". La grilla pasó de `gap-x-4 gap-y-8` a `gap-4` parejo, porque el marco ya separa visualmente.
* **TODAS las cards miden lo mismo, en todos los carruseles.** Hacen falta cuatro cosas y sacar una sola rompe la alineación:
  1. `mt-auto` en el bloque de precio (el nombre ocupa una o dos líneas),
  2. `flex w-full` en la card y `flex` en el `<li>` del carrusel (estira a la altura de la fila),
  3. `min-h-[1.625rem]` en el renglón del selector de ml,
  4. `min-h-9` en el renglón del botón Comprar.
  **Los `min-h` son los que igualan carruseles entre sí**: sin ellos, una sección cuyos productos no tienen presentaciones queda 18px más baja que otra que sí, y aunque cada fila esté pareja por dentro, las secciones se ven escalonadas. El cliente lo reportó así. **Verificado**: los 5 carruseles miden 514px.
* **`SelectorMl` usa `useId()` para el `id` y el `name`, NUNCA el slug del producto.** Un mismo perfume aparece en más de un carrusel de la home (p. ej. en "Los más elegidos" y en "Ofertas"), así que derivarlos del slug generaba **dos grupos de radios con el mismo `name`**: el navegador los trataba como UN grupo y marcar uno desmarcaba el otro. Se veía como que ningún tamaño quedaba seleccionado. Verificado: 10 radios, 10 ids únicos, 4 grupos, exactamente 1 marcado por grupo, y cambiar el tamaño en una card no toca la otra copia.
* **El selector va con `defaultChecked`, no `checked`**: con `checked` + `onChange` el label se veía bien pero `input.checked` quedaba en `false` tras hidratar, así que `querySelector(":checked")` no encontraba nada y un `<form>` no enviaría el valor.
* **`presentaciones` (ml) es ANDAMIAJE**: cambiar de tamaño no cambia el precio ni lo que se agrega a la bolsa. Al conectar Supabase, cada presentación pasa a ser su propia fila de `productos` (con su precio y su stock) o una tabla `variantes`, y elegir una navegará a ese producto. **Los tamaños del mock son inventados.**
* **El botón "Comprar" de la tarjeta va al PIE, debajo de las cuotas** — no sobre la foto (2026-08-14, corrección del cliente). Aparece solo en hover, con `inert` porque **en táctil no hay hover y nunca llegaría a mostrarse**: ahí el camino es entrar a la ficha. Su renglón se reserva siempre con `min-h-9`, si no la card cambia de alto al pasar el cursor.
* **Los CTA de compra van en NEGRO, no en el azul de marca** (`variante="oscuro"` de `BotonAgregar`): el azul ya está en el header, las marquesinas, los `% OFF`, el precio por transferencia y el footer. Sumarlo también en el CTA de cada card dejaba la página saturada — el cliente lo reportó como "todo muy cargado de azul". Aplica a la tarjeta y a la ficha.
* **Las píldoras de ml van `rounded-full`**, contra el ángulo vivo del resto de la UI: pedido del cliente. Es la única excepción al `--radius: 0.25rem` junto con el corazón de favoritos.
* **La financiación va resaltada con la utilidad `resaltador`** (2026-08-14), no subrayada. Es un trazo de marcador azul y lleva tres decisiones que hay que respetar si se toca:
  1. **Va en un `<span>`, nunca en el `<p>`**: sobre el bloque pintaría todo el ancho de la card aunque el texto no llegue hasta el borde.
  2. **Cubre TODO el alto del texto** (`background-size: 100% 100%` + `padding: 0.15em 0.35em`). Primero se hizo como trazo bajo pasando por el pie de las letras y el cliente lo rechazó ("el subrayado se ve horrible"): pidió que cubriera la palabra entera. El aire lo da el padding, no el `background-size`.
  3. **Degradado, no color plano**, y a 14–26% de opacidad: da el borde difuso del fibrón y **deja los números legibles**, que es el punto (pedido explícito: "que no se pierda legibilidad"). Subir la opacidad los tapa.
* **`NotasOlfativas` va sobre `bg-secondary/50` con numeración 01/02/03 y un riel que crece por nivel** (1/3 → 2/3 → 3/3). Antes eran tres columnas de chips grises sobre fondo blanco y el cliente lo reportó como "muy raro y seco". Las notas van como lista con filetes, no como chips: los recuadros las hacían leer como etiquetas de sistema. **El rótulo "Cómo huele" y la bajada explicativa se eliminaron** (2026-08-14, pedido del cliente): queda solo el título "Pirámide olfativa".
* **`CaracteristicasProducto` cierra cada tarjeta con una línea de contexto en texto, NO con una escala de puntos.** Se probó con puntos y falló por dos motivos a la vez: los únicos dos valores graficables —duración y estela— **caían los dos en el máximo**, así que se veían idénticos y no comunicaban nada; y uso/época quedaban vacías, dejando la fila desbalanceada. El contexto ("8 a 10 horas → Sigue puesto al día siguiente") se deriva del valor, no se carga por producto. `mt-auto` en esa línea mantiene las cuatro tarjetas parejas (verificado: 166px las cuatro).
* **Las tarjetas son 1:1 con fondo `bg-secondary`** (gris neutro), no 4:5. El fondo es deliberadamente intermedio porque las dos fotos del mismo producto tienen fondos opuestos: la principal es clara de estudio y la de hover es oscura con la caja. Un fondo claro o uno oscuro pelearía con una de las dos.
* **Cada producto puede tener DOS fotos** (2026-08-13): `imagen_url` (principal) e `imagen_hover_url`, que la reemplaza al pasar el cursor cruzando opacidades. Pedido del cliente: la principal muestra el frasco solo sobre fondo claro y la de hover, el producto con su caja. **Si `imagen_hover_url` es null no hay cambio** — la card mantiene el zoom de siempre, así que los productos con una sola foto siguen funcionando igual.
* **La segunda foto va con `alt=""`**: muestra el mismo producto que la principal, así que describirla haría que un lector de pantalla lea el nombre dos veces por tarjeta.
* **El placeholder SVG acompaña a la foto PRINCIPAL, no a la de hover**: fondo claro (`#F2F3F5`/`#DCDEE2`). Se repintó dos veces en la misma sesión —claro → oscuro → claro— al cambiar cuál era la foto principal. **La regla es: el placeholder sigue el tono de `imagen_url`, no el de `imagen_hover_url`.**
* **Favoritos funciona**: `features/favoritos/` con Zustand + `persist` en `vesper-favoritos`, mismo patrón que el carrito. Guarda **solo ids**. `BotonFavorito` es un Client Component chico y aislado, así `ProductoCard` y la ficha siguen siendo Server Components. **Verificado**: click → `aria-pressed=true`, badge en 1, persiste tras recargar.
* **`hidratado` en el store de favoritos NO es cosmético**: `persist` lee localStorage recién al hidratar, así que sin esa bandera el HTML del server (sin favoritos) no coincide con el del cliente (con favoritos) y React tira error de hidratación. Se marca en `onRehydrateStorage` y se excluye de lo guardado con `partialize`.
* **El corazón lleva `z-[2]`**: la foto está cubierta por un `<Link>` en `z-[1]` que hace clickeable toda la imagen. Sin el z-index mayor, el clic en el corazón lo intercepta el link y el usuario termina navegando a la ficha en vez de guardar el favorito.
* **`Producto` ganó `notas` y `caracteristicas`** (ambos nullable): `NotasOlfativas` (salida/corazón/base) y `CaracteristicasProducto` (duración, estela `baja|media|alta`, uso, época). Los bloques de la ficha **no se renderizan si el campo es null**, así que los 32 productos sin cargar no muestran secciones vacías.
* **Dos productos con fotos y ficha completa** (`bharara-king` y `armaf-club-de-nuit-intense-edt-105ml`): sirven de referencia del formato al cargar el resto. Cada uno con su par `*-sombra.webp` (principal, fondo claro) y `*.webp` (hover, con la caja). Las notas y características son las que publica cada casa; **los precios y los tamaños son inventados**, como en todo el mock.
* **Las fotos de producto NO se reencuadran: solo se recodifican a WebP** (2026-08-14, pedido explícito del cliente: *"no quiero que las muevas porque las fotos están derechas y después se distorsionan"*). El único procesamiento permitido es `sharp(p).webp({quality:88})` — **sin `trim`, sin `resize`, sin `fit:"contain"`**. Verificar que las dimensiones queden idénticas después de convertir.
  * Se probó antes recortando y recentrando (trim + lienzo cuadrado + mediana del borde) y el cliente lo rechazó dos veces: cada pasada movía el encuadre que él ya había dejado bien.
  * **El ajuste al cuadro lo hace el CSS con `object-contain`, no la imagen.** Así una foto vertical entra entera en la tarjeta cuadrada en vez de que `cover` le corte arriba y abajo. El contenedor va con `bg-background` (blanco) para que el aire sobrante no se note contra el fondo de estudio de las fotos.
  * `sharp` no puede escribir sobre el mismo archivo que está leyendo: escribir a `.tmp` y renombrar.
* **Verificar las imágenes midiendo píxeles, NO mirando capturas.** Next cachea la optimización en `.next/cache/images` **y** el navegador cachea la respuesta, así que una captura puede mostrar la versión vieja mucho después de corregir el archivo. Pasó en esta sesión: tres capturas seguidas mostraron franjas que ya no existían. Lo confiable es `curl` al `/_next/image` + `sharp`, o `Network.setCacheDisabled` por CDP y medir el `<img>` con canvas.
* **Las fotos pueden llegar como JPEG con extensión `.webp`**: funcionan (el navegador lee el contenido) pero pesan ~10× de más. Comprobar el formato real con `sharp(...).metadata()` antes de darlas por buenas — en esta sesión dos reemplazos venían así, 530KB y 470KB, y quedaron en 25 y 31KB.
* **Verificar los nombres de archivo de las fotos con `ls`, no de memoria**: `bharara-king.webp` se guardó una vez como `bahara-king.webp` (sin la primera "r") y el mock apuntaba al nombre correcto, así que la imagen daba **404**. No se notó en las capturas porque el navegador la tenía cacheada del nombre anterior. **Al agregar fotos, comprobar con un contexto sin caché** (`browser.newContext()` nuevo) y mirar `naturalWidth > 0`, no la captura.
* **Falta todavía en `Producto`**: varias fotos por producto (hoy es un solo `imagen_url`), familia olfativa, género y concentración. Esos son los campos que destraban el filtrado por categoría del menú.

---

## Estado actual del desarrollo

**Última sesión**: 2026-08-13
**Próximo paso**: el cliente va a pasar **el resto de las fotos de producto**. Cargarlas a `public/productos/` en WebP (`sharp`, quality 86, fondo oscuro) y completar `notas`/`caracteristicas` de cada producto en `mock.ts`, siguiendo el formato de `bharara-king`. Después, conectar Supabase.

**Lo que está funcionando**:
* Scaffold Next 16 + React 19 + TS strict + Tailwind v4 + shadcn
* Estructura de carpetas por dominio (`app/`, `features/`, `shared/`, `lib/`, `data/`, `integrations/`)
* Layout del shop: header con nav responsive (Sheet) + footer
* Home: hero slider (autoplay + flechas + dots) → franja de marcas → cuatro categorías → 5 carruseles → opiniones
* `ProductoCard` con envío gratis, % OFF, precio tachado, precio por transferencia, cuotas y estado sin stock
* `/productos` con grilla y `error.tsx`
* `/productos/[slug]`: ficha completa prerenderizada (33 rutas estáticas) — foto, precio, cantidad, comprar, pirámide olfativa, características, otros perfumes y opiniones
* Favoritos con corazón funcional y contador en el header (localStorage)
* "Comprar" enganchado al carrito, desde la tarjeta (hover) y desde la ficha, con contador en la bolsa
* Providers de React Query + Toaster (sonner)
* `proxy.ts`, `sitemap.ts`, `robots.ts`, `not-found.tsx`, `global-error.tsx`
* Clientes de Supabase (browser / server / proxy) listos, a la espera de credenciales

* Identidad visual aplicada: paleta de marca en azul, Fraunces en titulares, header con dos cintas, hero fotográfico y footer de 3 columnas con medios de pago
* `/marcas/[marca]`: 19 páginas de marca prerenderizadas, con filtrado real

**Lo que está pendiente**:
* Conectar la base: catálogo real, auth, órdenes, admin
* Páginas `/carrito`, `/favoritos` y `/checkout` (el header ya linkea a las tres)
* Fotos y datos de detalle del resto de los perfumes (solo `bharara-king` está cargado)
* Filtros y categorías del catálogo (el menú del sitio actual tiene Decants / Masculinas / Femeninas / Beauty / SALE)
* Integración de Mercado Pago y su webhook
* Fotos reales de producto y arte de hero (`HERO_SLIDES[].imagenUrl` sigue en null)

**Problemas conocidos o deuda técnica**:
* El DAL lee de `features/catalogo/mock.ts`, no de Supabase. Borrar ese archivo al conectar la base.
* **Solo 1 de 33 productos tiene foto real** (`bharara-king`): el resto muestra el frasco SVG de `placeholder.ts`. Es lo más visible que falta para que la demo se vea terminada.
* Con solo 8 productos mock (6 en oferta), "En oferta" y "Los más elegidos" comparten los dos primeros ítems aunque las ofertas ya ordenen por descuento. Se resuelve solo con catálogo real.
* **Casi todas las rutas de la nav apuntan a `/productos`**: las categorías (3x2, Novedades, Beauty, SALE), los filtros de género y familia de los paneles, los cuatro cuadrados de la home y los enlaces de "Ayuda" del footer son placeholders. **Las marcas son la excepción: ésas ya filtran.**
* **Nunca usar `href` como `key` de React mientras las rutas sean placeholders**: cinco ítems de `NAV_PRINCIPAL` comparten `/productos`, así que `key={item.href}` genera keys duplicadas (React puede duplicar u omitir elementos). Va `key={item.label}`, que sí es único. Al crear las páginas reales de categoría, el problema desaparece solo.
* **El buscador sigue siendo maqueta**: el campo no filtra. Para que funcione hace falta `genero`/`familia` en `Producto` (la `marca` ya está). El corazón, en cambio, ya guarda de verdad desde 2026-08-13.
* **`/favoritos` no existe todavía**: el corazón guarda bien y el contador del header funciona, pero el link lleva a una ruta sin página. Es lo próximo que conviene armar del lado del cliente.
* **Las categorías no filtran** (las marcas sí): sin `genero`/`familia` en `Producto`, cualquier subcategoría de los paneles muestra el catálogo entero. Se resuelve agregando esas columnas.
* **`features/home/reviews.ts` son testimonios inventados** para maquetar. Reemplazar por reseñas verificadas antes de publicar: mostrar opiniones ficticias como reales es publicidad engañosa.
* **`MARCAS` en `lib/site.ts` son wordmarks tipográficos**, no isologos. Usar los logos reales de cada casa requiere sus archivos y su permiso de uso.
* **Los medios de pago/envío del footer muestran el nombre en texto, no el logo**: Visa, Mastercard, Mercado Pago, Correo Argentino y el resto son marcas registradas y no se pueden dibujar imitaciones — hay que usar los kits oficiales que publica cada una. `MEDIOS_PAGO`/`MEDIOS_ENVIO` (`lib/site.ts`) tienen un campo `logo` en null; al copiar los archivos a `public/medios/` y completarlo, el chip pasa a mostrar la imagen sin tocar el layout.
* No hay toggle de tema en la UI. Los tokens `.dark` están definidos y probados, pero sin un `ThemeProvider` el modo oscuro no se puede activar todavía.

---

## Instrucciones para la IA

1. **Antes de escribir código**, leer los documentos de `ai-pmp/`.
2. **No empezar módulos nuevos** sin que el usuario lo indique.
3. **Antes de entregar**: correr `npm run typecheck` y verificar imports/errores. Cambios grandes: `npm run build`.
4. **Server-first**: componentes Server por defecto; `"use client"` solo donde hay interactividad real, lo más abajo posible.
5. **Lecturas** vía DAL en Server Components; **mutaciones** vía Server Actions; **React Query** solo para cliente.
6. **Si hay ambigüedad**, preguntar antes de implementar.
7. **No agregar dependencias** fuera del stack sin consultar.
8. **Actualizar la tabla de módulos** al completar uno.
9. **Límite 300 líneas por archivo** — dividir si se supera.
10. **Nunca leer, imprimir ni commitear `.env`** ni secretos (access token MP, service key).
11. **Después de cambios de schema**, correr `get_advisors` del MCP y corregir alertas.
12. **El total de la orden y el stock se manejan en el server**; el webhook valida firma y re-consulta el pago.
13. **Al terminar una sesión**, actualizar "Estado actual del desarrollo".

---

## Cómo actualizar este archivo

* **Al terminar un módulo** → cambiar su estado en la tabla
* **Al crear una tabla** → agregarla en "Base de datos"
* **Al tomar una decisión técnica** → registrarla
* **Al terminar una sesión** → actualizar "Estado actual del desarrollo"
