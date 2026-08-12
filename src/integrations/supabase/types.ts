/**
 * Tipos generados por Supabase.
 *
 * Cuando el proyecto de Supabase esté conectado, regenerar con:
 *   npx supabase gen types typescript --project-id <ID> > src/integrations/supabase/types.ts
 *
 * Hasta entonces se deja un placeholder tipado para que los clientes compilen.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
