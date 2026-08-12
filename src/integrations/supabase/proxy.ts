import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

import { type Database } from "./types"

/**
 * Refresca la sesión de Supabase en cada request y redirige por UX.
 *
 * IMPORTANTE: esto NO es una barrera de seguridad (CVE-2025-29927).
 * La autorización real vive en el DAL (`getUser()` + chequeo de rol) y en el RLS.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Supabase todavía no está conectado: dejar pasar el request sin tocar la sesión.
  if (!url || !anonKey) return supabaseResponse

  const supabase = createServerClient<Database>(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // No quitar: refresca el token y evita sesiones colgadas.
  await supabase.auth.getUser()

  return supabaseResponse
}
