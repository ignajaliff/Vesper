import Link from "next/link"

import { Button } from "@/shared/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="space-y-4 text-center">
        <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase">
          Error 404
        </p>
        <h1 className="text-2xl font-medium">Esta página no existe</h1>
        <p className="text-muted-foreground text-sm">
          Puede que el enlace esté roto o que la página se haya movido.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </main>
  )
}
