"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type FavoritosState = {
  /** Ids de producto marcados como favoritos. */
  ids: string[]
  /**
   * Si `persist` ya leyó localStorage.
   *
   * En el server y en el primer render del cliente vale `false`: sin esta
   * bandera, el HTML del server (sin favoritos) no coincide con el del cliente
   * (con favoritos) y React tira un error de hidratación.
   */
  hidratado: boolean
  alternar: (productoId: string) => void
  quitar: (productoId: string) => void
  vaciar: () => void
}

/**
 * Favoritos: estado de cliente persistido en localStorage.
 *
 * Guarda solo ids — los datos del producto se leen del catálogo. Es por
 * navegador: al haber cuentas de usuario en Supabase, esto pasa a ser una
 * tabla `favoritos` con RLS y el store queda como caché optimista.
 */
export const useFavoritos = create<FavoritosState>()(
  persist(
    (set) => ({
      ids: [],
      hidratado: false,

      alternar: (productoId) =>
        set((state) => ({
          ids: state.ids.includes(productoId)
            ? state.ids.filter((id) => id !== productoId)
            : [...state.ids, productoId],
        })),

      quitar: (productoId) =>
        set((state) => ({ ids: state.ids.filter((id) => id !== productoId) })),

      vaciar: () => set({ ids: [] }),
    }),
    {
      name: "vesper-favoritos",
      // `hidratado` es estado de sesión: no se guarda, se marca al rehidratar.
      partialize: (state) => ({ ids: state.ids }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hidratado = true
      },
    }
  )
)

/** Si un producto está en favoritos. `false` hasta que hidrate. */
export function useEsFavorito(productoId: string): boolean {
  return useFavoritos(
    (state) => state.hidratado && state.ids.includes(productoId)
  )
}

/** Cantidad de favoritos, para el contador del header. */
export function useCantidadFavoritos(): number {
  return useFavoritos((state) => (state.hidratado ? state.ids.length : 0))
}
