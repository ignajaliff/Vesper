import Image from "next/image"
import Link from "next/link"

import { NAV_PRINCIPAL, SITE } from "@/lib/site"
import { Separator } from "@/shared/components/ui/separator"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm space-y-3">
            <Image
              src="/vesper-logo.png"
              alt={SITE.nombre}
              width={440}
              height={154}
              className="h-8 w-auto"
            />
            <p className="text-muted-foreground text-sm">{SITE.descripcion}</p>
          </div>

          <nav aria-label="Navegación del pie" className="grid gap-2">
            {NAV_PRINCIPAL.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <Separator className="my-8" />

        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} {SITE.nombre}. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  )
}
