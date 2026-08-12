"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu } from "lucide-react"

import { NAV_PRINCIPAL, SITE } from "@/lib/site"
import { Button } from "@/shared/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet"

export function MobileNav() {
  const [abierto, setAbierto] = useState(false)

  return (
    <Sheet open={abierto} onOpenChange={setAbierto}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Abrir menú"
          className="md:hidden"
        >
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="sr-only">{SITE.nombre}</SheetTitle>
          <Image
            src="/vesper-logo.png"
            alt=""
            width={440}
            height={154}
            className="h-7 w-auto"
          />
        </SheetHeader>

        <nav aria-label="Navegación móvil" className="grid gap-1 px-4">
          {NAV_PRINCIPAL.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setAbierto(false)}
              className="hover:bg-muted rounded-md px-2 py-2 text-sm transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
