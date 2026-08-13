"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Menu } from "lucide-react"

import { NAV_PRINCIPAL, SITE } from "@/lib/site"
import { cn } from "@/lib/utils"
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
  const [expandido, setExpandido] = useState<string | null>(null)

  const cerrar = () => {
    setAbierto(false)
    setExpandido(null)
  }

  return (
    <Sheet open={abierto} onOpenChange={setAbierto}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Abrir menú"
          className="-ml-2 md:hidden"
        >
          <Menu strokeWidth={1.5} />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="sr-only">{SITE.nombre}</SheetTitle>
          <Image
            src="/vesper-logo.png"
            alt=""
            width={440}
            height={154}
            className="h-8 w-auto"
          />
        </SheetHeader>

        <nav aria-label="Navegación móvil" className="grid gap-0.5 px-4 pb-8">
          {NAV_PRINCIPAL.map((item) => {
            const estaExpandido = expandido === item.label

            if (!item.panel) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={cerrar}
                  className="hover:bg-secondary eyebrow rounded-sm px-2 py-3 transition-colors"
                >
                  {item.label}
                </Link>
              )
            }

            return (
              <div key={item.label}>
                <button
                  type="button"
                  aria-expanded={estaExpandido}
                  onClick={() => setExpandido(estaExpandido ? null : item.label)}
                  className={cn(
                    "hover:bg-secondary eyebrow flex w-full items-center justify-between rounded-sm px-2 py-3 transition-colors",
                    item.label === "SALE" && "text-destructive"
                  )}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform",
                      estaExpandido && "rotate-180"
                    )}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </button>

                {estaExpandido && (
                  <div className="border-border/70 mt-1 mb-2 ml-2 space-y-4 border-l pl-4">
                    {item.panel.map((columna) => (
                      <div key={columna.titulo}>
                        <p className="text-muted-foreground mb-2 text-xs font-medium">
                          {columna.titulo}
                        </p>
                        <ul className="space-y-1.5">
                          {columna.items.map((sub) => (
                            <li key={sub.label}>
                              <Link
                                href={sub.href}
                                onClick={cerrar}
                                className="text-muted-foreground hover:text-foreground block py-0.5 text-sm transition-colors"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
