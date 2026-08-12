import { createBrowserClient } from "@supabase/ssr"

import { type Database } from "./types"

/**
 * Cliente de Supabase para el navegador (Client Components).
 * Usa solo la anon key: nunca la service role key.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
