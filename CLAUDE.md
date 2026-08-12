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
| Home | UI lista | — | hero slider, barra de beneficios, grillas |
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
* Estética neutral a propósito (solo tokens semánticos). Los colores de marca se inyectan editando las variables de `globals.css`.

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

**Lo que está pendiente**:
* Conectar la base: catálogo real, auth, órdenes, admin
* Páginas `/productos/[slug]`, `/carrito`, `/checkout`
* Filtros y categorías del catálogo (el menú del sitio actual tiene Decants / Masculinas / Femeninas / Beauty / SALE)
* Integración de Mercado Pago y su webhook
* Diseño de marca (paleta, tipografías) e imágenes reales de hero y productos

**Problemas conocidos o deuda técnica**:
* El DAL lee de `features/catalogo/mock.ts`, no de Supabase. Borrar ese archivo al conectar la base.
* Los productos no tienen imagen (`imagen_url: null`): las cards muestran el placeholder neutro hasta cargar Storage.

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
