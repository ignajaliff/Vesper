import Image from "next/image"
import Link from "next/link"

import { NAV_PRINCIPAL, SITE } from "@/lib/site"
import { MediosDePago } from "./MediosDePago"

const AYUDA = [
  { label: "Cómo comprar", href: "/productos" },
  { label: "Envíos y entregas", href: "/productos" },
  { label: "Cambios y devoluciones", href: "/productos" },
  { label: "Contacto", href: "/productos" },
] as const

export function SiteFooter() {
  return (
    // Mismo azul profundo que la cinta de anuncios: cierra el sitio con el
    // color con el que abre.
    <footer className="bg-marca-profundo mt-auto text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr] md:gap-12">
          <div className="max-w-sm space-y-3">
            <Image
              src="/vesper-logo.png"
              alt={SITE.nombre}
              width={440}
              height={154}
              /* El wordmark es azul y sobre este fondo desaparecería: se
                 lleva a blanco puro por CSS, sin tocar el archivo. */
              className="h-8 w-auto brightness-0 invert"
            />
            <p className="text-sm leading-relaxed text-pretty text-white/70">
              {SITE.descripcion}
            </p>
          </div>

          <nav aria-labelledby="footer-tienda">
            <h2 id="footer-tienda" className="eyebrow mb-3 font-bold text-white">
              Tienda
            </h2>
            <ul className="space-y-1.5">
              {/* La key va por `label`, no por `href`: mientras las páginas de
                  categoría no existan, varios ítems comparten `/productos`. */}
              {NAV_PRINCIPAL.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-ayuda">
            <h2 id="footer-ayuda" className="eyebrow mb-3 font-bold text-white">
              Ayuda
            </h2>
            <ul className="space-y-1.5">
              {AYUDA.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-9 border-t border-white/15 pt-7">
          <MediosDePago />
        </div>

        <p className="mt-8 border-t border-white/15 pt-5 text-xs text-white/60">
          © {new Date().getFullYear()} {SITE.nombre}. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  )
}
