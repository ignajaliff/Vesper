import { QueryClient } from "@tanstack/react-query"

/**
 * Configuración base del QueryClient.
 * React Query se usa SOLO para estado de cliente interactivo (carrito, optimistic updates).
 * Las lecturas iniciales van por Server Components + DAL.
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
      },
    },
  })
}
