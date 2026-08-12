# Vesper — E-commerce de perfumería

Tienda online de perfumes de autor. Next.js 16 (App Router) + React 19 + TypeScript strict, Tailwind v4 y shadcn/ui, con Supabase y Mercado Pago previstos.

## Requisitos

* Node.js 20+ (probado en v22)

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # completar cuando exista el proyecto de Supabase
npm run dev
```

La app queda en http://localhost:3000

## Comandos

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Servidor de desarrollo (Turbopack) |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |

## Estructura

```
src/
  app/                  App Router: rutas, layouts, sitemap, robots
    (shop)/             grupo público (header + footer)
  features/             módulos de negocio por dominio
    carrito/            estado de cliente (Zustand + localStorage)
    catalogo/           DAL, tipos y schemas del catálogo
    checkout/           Server Actions, tipos y schemas de la orden
    home/               componentes de la home (Hero)
  shared/               UI reutilizable
    components/ui/      componentes shadcn (dumb)
    components/layout/  header, footer, nav
  lib/                  configuración base (queryClient, formato, site)
  data/                 Data Access Layer transversal (auth)
  integrations/         clientes externos (Supabase)
  proxy.ts              ex middleware: refresco de sesión / redirects de UX
```

## Reglas de desarrollo

Todo el desarrollo sigue los documentos de [`ai-pmp/`](ai-pmp/). Leerlos antes de tocar código.
El contexto y estado del proyecto vive en [`CLAUDE.md`](CLAUDE.md).

Puntos no negociables:

* **Server-first**: Server Components por defecto; `"use client"` lo más abajo posible.
* **Lecturas** por el DAL en Server Components; **mutaciones** por Server Actions; React Query solo para interactividad de cliente.
* La autorización real vive en el **RLS de Supabase + el DAL** (`getUser()`), nunca en `proxy.ts`.
* El **total de la orden y el stock se calculan en el server**; el precio del carrito es referencial.
* Sin colores hardcodeados: solo tokens semánticos de shadcn.

## Estado

Base del proyecto lista. Supabase y Mercado Pago todavía **no** están conectados: las funciones del DAL son stubs marcados con `TODO(supabase)`.
