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

---

## Módulos del sistema

| Módulo | Estado | Tablas Supabase | Notas |
|--------|--------|-----------------|-------|
| Base / scaffold | Completo | — | estructura, layout, providers |
| Home | UI lista | — | hero, beneficios, grillas, franja editorial |
| Auth | Pendiente | user_roles | DAL en `src/data/auth.ts` (stub) |
| Catálogo | UI lista | productos, categorias | grilla + card listas; DAL lee de `mock.ts` |
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
* **Favicon**: `src/app/icon.png` + `apple-icon.png` se generaron con **solo la "V"** — el wordmark completo es ilegible a 32px. Regenerarlos desde la V si cambia el logo.
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
* **`TresDestacados` va sin padding-top grande** (`pt-4`): con `py-14`, el aire blanco entre el hero y la grilla hacía leer la foto del hero como si cortara antes de tiempo. El cliente lo reportó como "se ve un poco blanco al final" — no era un hueco del hero, era el padding del vecino.
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
* **`MARCAS` pasó de `string[]` a `Marca[]`** (`nombre` + `href`) para que cada una lleve al catálogo. Las 18 marcas apuntan a `/productos` hasta que existan las páginas por marca.
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
* **Dos pantallas de carga "spray", para dos situaciones distintas**:
  * `PantallaCarga` (`loading.tsx` de `(shop)` y de `productos`) cubre las **navegaciones internas** de Next. Usa las utilidades `letra-rociada`/`vapor-spray` de `globals.css`.
  * `CargaInicial` (en el layout raíz) cubre la **recarga completa con F5**, que `loading.tsx` no alcanza: en una carga fresca el navegador pinta blanco hasta que React monta. Lleva CSS y JS **inline** a propósito — si dependiera de la hoja de Tailwind habría un parpadeo sin estilar antes de que cargue.
* **`CargaInicial` se engancha a `DOMContentLoaded`, NUNCA a `load`**: con `load` esperaba a que bajaran las imágenes del hero (~7 MB cada una) y el velo se quedaba **15 segundos** en pantalla. Medido. Además tiene `DURACION_MINIMA` (2400 ms, para que el rociado se vea entero) y `DURACION_MAXIMA` (3600 ms, tope duro por si el arranque falla). Ciclo real medido: letras en cascada a ~1.9 s, nombre completo a ~3.0 s, desvanecido a ~3.9 s, retirado a ~4.5 s.
* **Reviews en grilla fija, sin carrusel**: pedido explícito del cliente — arrastrar para leer esconde la mitad del contenido.
* **`CarruselProductos` reemplazó a `SeccionProductos`**: fila desplazable de 4 productos por vista (2 en tablet, 1.4 en mobile, para que la card cortada sugiera que hay más). Usa **scroll nativo con `snap-x`**, no una librería: funciona sin JS, respeta el gesto táctil y no suma dependencias. Las flechas mueven una página (`clientWidth`) y se deshabilitan en los extremos.
* **La home tiene 5 carruseles**: Los más elegidos → Decants 3x2 → Novedades → (franja editorial) → Ofertas → Promociones. Después van las dos secciones de opiniones.
* **`Producto` ganó `marca` y `colecciones`**: `colecciones` es un `Coleccion[]` (`destacado`/`tres-por-dos`/`novedad`/`oferta`/`promocion`) que alimenta cada carrusel vía `getProductosPorColeccion`. Al conectar Supabase esto pasa a ser tabla puente o columnas booleanas. El mock creció a 32 productos para que cada sección muestre cosas distintas.
* **`ProductoCard` recorta la marca del `nombre`** cuando lo repite: el rótulo de marca va arriba en versalita, así que mostrar "Armaf Armaf Odyssey…" sería redundante.
* **Dos secciones de opiniones, deliberadamente distintas**: `Reviews` (reseñas de producto, tarjetas sobre `bg-secondary`, con "Compra verificada") y `OpinionesGoogle` (perfil del negocio, sin tarjeta, cita centrada y filete). **Las estrellas van en azul de marca, no en el amarillo de Google**: el amarillo rompe la paleta y hace ver la sección como un widget pegado.
* **`OPINIONES_GOOGLE` y `PUNTAJE_GOOGLE` son andamiaje**. Reemplazar por las reseñas reales antes de publicar: atribuir opiniones inventadas a Google es publicidad engañosa y además incumple los términos de la plataforma.
* **Carrito con ícono `ShoppingBag`**, no `ShoppingCart`: decisión de marca del cliente ("que sea como una bolsa").

---

## Estado actual del desarrollo

**Última sesión**: 2026-08-12
**Próximo paso**: conectar Supabase (crear proyecto, tablas `productos`/`categorias` con RLS, regenerar types), reemplazar los cuerpos del DAL y borrar `mock.ts`.

**Lo que está funcionando**:
* Scaffold Next 16 + React 19 + TS strict + Tailwind v4 + shadcn
* Estructura de carpetas por dominio (`app/`, `features/`, `shared/`, `lib/`, `data/`, `integrations/`)
* Layout del shop: header con nav responsive (Sheet) + footer
* Home: hero slider (autoplay + flechas + dots), barra de beneficios, secciones "Best sellers" y "Ofertas"
* `ProductoCard` con envío gratis, % OFF, precio tachado, precio por transferencia, cuotas y estado sin stock
* `/productos` con grilla, `loading.tsx` y `error.tsx`
* Providers de React Query + Toaster (sonner)
* `proxy.ts`, `sitemap.ts`, `robots.ts`, `not-found.tsx`, `global-error.tsx`
* Clientes de Supabase (browser / server / proxy) listos, a la espera de credenciales

* Identidad visual editorial aplicada: paleta hueso/tinta/terracota, Fraunces en titulares, header con cinta de anuncio, hero tipográfico, franja "Sobre Vesper" entre grillas y footer de 3 columnas con medios de pago

**Lo que está pendiente**:
* Conectar la base: catálogo real, auth, órdenes, admin
* Páginas `/productos/[slug]`, `/carrito`, `/checkout`
* Filtros y categorías del catálogo (el menú del sitio actual tiene Decants / Masculinas / Femeninas / Beauty / SALE)
* Integración de Mercado Pago y su webhook
* Fotos reales de producto y arte de hero (`HERO_SLIDES[].imagenUrl` sigue en null)

**Problemas conocidos o deuda técnica**:
* El DAL lee de `features/catalogo/mock.ts`, no de Supabase. Borrar ese archivo al conectar la base.
* Los productos no tienen imagen (`imagen_url: null`): se muestra el frasco SVG de `placeholder.ts` hasta cargar Storage.
* Con solo 8 productos mock (6 en oferta), "En oferta" y "Los más elegidos" comparten los dos primeros ítems aunque las ofertas ya ordenen por descuento. Se resuelve solo con catálogo real.
* **Todas las rutas de la nav apuntan a `/productos`**: las categorías (3x2, Novedades, Beauty, SALE), los filtros de los paneles (género, familia, marca) y los enlaces de "Ayuda" del footer son placeholders. `/favoritos` tampoco existe todavía.
* **Nunca usar `href` como `key` de React mientras las rutas sean placeholders**: cinco ítems de `NAV_PRINCIPAL` comparten `/productos`, así que `key={item.href}` genera keys duplicadas (React puede duplicar u omitir elementos). Va `key={item.label}`, que sí es único. Al crear las páginas reales de categoría, el problema desaparece solo.
* **El buscador y el corazón son solo maqueta** (decisión del cliente para esta demo): el campo no filtra y el corazón no guarda nada. Para que funcionen hace falta agregar `marca`/`genero`/`familia` al tipo `Producto` y un store de favoritos.
* **Las categorías no filtran**: sin campos de marca/género/familia en el mock, cualquier subcategoría muestra los mismos 8 productos. Se resuelve al conectar Supabase con esas columnas.
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
