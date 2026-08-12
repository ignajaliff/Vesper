import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, User } from "lucide-react"

import { NAV_PRINCIPAL, SITE } from "@/lib/site"
import { Button } from "@/shared/components/ui/button"
import { MobileNav } from "./MobileNav"

export function SiteHeader() {
  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <MobileNav />

        <Link href="/" aria-label={`${SITE.nombre} — ir al inicio`}>
          <Image
            src="/vesper-logo.png"
            alt={SITE.nombre}
            width={440}
            height={154}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav
          aria-label="Navegación principal"
          className="ml-6 hidden items-center gap-6 md:flex"
        >
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

        <div className="ml-auto flex items-center gap-1">
          <Button asChild variant="ghost" size="icon" aria-label="Mi cuenta">
            <Link href="/auth/login">
              <User />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Ver carrito">
            <Link href="/carrito">
              <ShoppingBag />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
