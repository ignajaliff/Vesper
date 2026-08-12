import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

import { type Database } from "./types"

/**
 * Cliente de Supabase para Server Components, Server Actions y Route Handlers.
 * Siempre verificar el usuario con `getUser()` — nunca con `getSession()`.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Llamado desde un Server Component: el refresh de sesión
            // lo resuelve el proxy.ts. Se puede ignorar.
          }
        },
      },
    }
  )
}
