import { type NextRequest } from "next/server"

import { updateSession } from "@/integrations/supabase/proxy"

/**
 * Ex middleware (Next 16+). Solo refresca la sesión y redirige por UX.
 * NO es la barrera de seguridad: eso es el RLS + el chequeo de rol en el DAL.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Todas las rutas menos:
     * - _next/static, _next/image
     * - favicon.ico, robots.txt, sitemap.xml
     * - archivos de imagen
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
}
