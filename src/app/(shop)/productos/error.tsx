"use client"

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-20 text-center sm:px-6">
      <p className="text-destructive text-sm">
        No se pudieron cargar los productos.
        <button onClick={reset} className="ml-2 underline">
          Reintentar
        </button>
      </p>
    </div>
  )
}
