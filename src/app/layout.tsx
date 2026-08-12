import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { SITE } from "@/lib/site"
import { Toaster } from "@/shared/components/ui/sonner"
import { Providers } from "./providers"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.nombre} — ${SITE.descripcionCorta}`,
    template: `%s | ${SITE.nombre}`,
  },
  description: SITE.descripcion,
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: SITE.nombre,
    title: `${SITE.nombre} — ${SITE.descripcionCorta}`,
    description: SITE.descripcion,
  },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
