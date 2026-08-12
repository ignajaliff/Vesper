import { redirect } from "next/navigation"
import { type User } from "@supabase/supabase-js"

import { createClient } from "@/integrations/supabase/server"

export const ROLES = ["admin", "gerente", "cliente"] as const
export type Rol = (typeof ROLES)[number]

/**
 * Usuario actual verificado contra el servidor de Supabase.
 * SIEMPRE `getUser()` — `getSession()` no valida el token y no sirve para autorizar.
 */
export async function getUsuarioActual(): Promise<User | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

/**
 * Rol del usuario actual, leído de `user_roles`.
 * Devuelve null si no hay usuario o no tiene rol asignado.
 */
export async function getRolActual(): Promise<Rol | null> {
  const user = await getUsuarioActual()
  if (!user) return null

  // TODO(supabase): implementar cuando exista la tabla `user_roles`.
  //   const supabase = await createClient()
  //   const { data } = await supabase
  //     .from("user_roles")
  //     .select("rol")
  //     .eq("user_id", user.id)
  //     .maybeSingle()
  //   return (data?.rol as Rol) ?? null
  return null
}

/**
 * Barrera de autorización del DAL: corta el render si el rol no alcanza.
 * El RLS de Supabase respalda esta verificación; el proxy.ts NO es seguridad.
 */
export async function requireRol(rolesPermitidos: readonly Rol[]): Promise<User> {
  const user = await getUsuarioActual()
  if (!user) redirect("/auth/login")

  const rol = await getRolActual()
  if (!rol || !rolesPermitidos.includes(rol)) redirect("/")

  return user
}
