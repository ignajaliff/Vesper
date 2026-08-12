"use client"

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="es">
      <body className="flex min-h-dvh items-center justify-center p-6">
        <div className="space-y-3 text-center">
          <h1 className="text-lg font-medium">Algo salió mal</h1>
          <p className="text-muted-foreground text-sm">
            Ocurrió un error inesperado. Probá de nuevo.
          </p>
          <button onClick={reset} className="text-sm underline">
            Reintentar
          </button>
        </div>
      </body>
    </html>
  )
}
