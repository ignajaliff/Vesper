"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

import { type ItemCarrito } from "../types"

type CarritoState = {
  items: ItemCarrito[]
  agregar: (item: Omit<ItemCarrito, "cantidad">, cantidad?: number) => void
  quitar: (productoId: string) => void
  cambiarCantidad: (productoId: string, cantidad: number) => void
  vaciar: () => void
}

/**
 * Carrito: estado de cliente persistido en localStorage.
 *
 * Los precios guardados acá son REFERENCIALES (solo UX).
 * Al hacer checkout se envía solo `{ producto_id, cantidad }` y el server
 * recalcula el total leyendo los precios actuales de la base.
 */
export const useCarrito = create<CarritoState>()(
  persist(
    (set) => ({
      items: [],

      agregar: (item, cantidad = 1) =>
        set((state) => {
          const existente = state.items.find(
            (i) => i.producto_id === item.producto_id
          )
          if (existente) {
            return {
              items: state.items.map((i) =>
                i.producto_id === item.producto_id
                  ? { ...i, cantidad: i.cantidad + cantidad }
                  : i
              ),
            }
          }
          return { items: [...state.items, { ...item, cantidad }] }
        }),

      quitar: (productoId) =>
        set((state) => ({
          items: state.items.filter((i) => i.producto_id !== productoId),
        })),

      cambiarCantidad: (productoId, cantidad) =>
        set((state) => ({
          items:
            cantidad <= 0
              ? state.items.filter((i) => i.producto_id !== productoId)
              : state.items.map((i) =>
                  i.producto_id === productoId ? { ...i, cantidad } : i
                ),
        })),

      vaciar: () => set({ items: [] }),
    }),
    { name: "vesper-carrito" }
  )
)

/** Cantidad total de unidades en el carrito. */
export function useCantidadCarrito(): number {
  return useCarrito((state) =>
    state.items.reduce((total, item) => total + item.cantidad, 0)
  )
}

/** Subtotal REFERENCIAL del carrito — no es el total que se cobra. */
export function useSubtotalCarrito(): number {
  return useCarrito((state) =>
    state.items.reduce((total, item) => total + item.precio * item.cantidad, 0)
  )
}
