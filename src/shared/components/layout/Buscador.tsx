"use client"

import { Search } from "lucide-react"

/**
 * Campo de búsqueda del header.
 *
 * Maquetado solamente: todavía no filtra. Al conectar el catálogo real,
 * enganchar el submit a `/productos?q=` y sumar panel de resultados.
 */
export function Buscador({ className }: { className?: string }) {
  return (
    <form
      role="search"
      className={className}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="group relative">
        <Search
          className="text-muted-foreground group-focus-within:text-primary pointer-events-none absolute top-1/2 left-4 size-[1.125rem] -translate-y-1/2 transition-colors"
          strokeWidth={1.5}
          aria-hidden
        />

        <input
          type="search"
          name="q"
          placeholder="Buscar por fragancia, marca o familia olfativa…"
          aria-label="Buscar productos"
          /* `pr-20` deja lugar al botón; el `search` nativo de WebKit dibuja
             su propia cruz que se pisaría con él. */
          className="border-border bg-secondary/50 placeholder:text-muted-foreground/80 focus-visible:border-primary/40 focus-visible:bg-background focus-visible:ring-primary/15 h-12 w-full rounded-full border pr-24 pl-11 text-sm transition-all focus-visible:ring-4 focus-visible:outline-none [&::-webkit-search-cancel-button]:appearance-none"
        />

        <button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-accent focus-visible:ring-primary/30 absolute top-1/2 right-1.5 h-9 -translate-y-1/2 rounded-full px-5 text-xs font-medium tracking-wide transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          Buscar
        </button>
      </div>
    </form>
  )
}
