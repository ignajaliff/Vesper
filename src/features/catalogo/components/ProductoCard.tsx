import Image from "next/image"
import Link from "next/link"

import { formatCurrency } from "@/lib/format-currency"
import {
  CUOTAS_SIN_INTERES,
  calcularPorcentajeOff,
  calcularPrecioTransferencia,
  calcularValorCuota,
} from "@/lib/precios"
import { Badge } from "@/shared/components/ui/badge"
import { type ProductoCardProps } from "../types"

export function ProductoCard({ producto, prioridad = false }: ProductoCardProps) {
  const sinStock = producto.stock <= 0
  const porcentajeOff = calcularPorcentajeOff(producto.precio, producto.precio_lista)
  const precioTransferencia = calcularPrecioTransferencia(producto.precio)
  const valorCuota = calcularValorCuota(producto.precio)

  return (
    <article className="group relative flex flex-col">
      <Link
        href={`/productos/${producto.slug}`}
        className="focus-visible:ring-ring rounded-md focus-visible:ring-2 focus-visible:outline-none"
      >
        <div className="bg-muted relative aspect-square overflow-hidden rounded-md">
          {producto.imagen_url ? (
            <Image
              src={producto.imagen_url}
              alt={producto.nombre}
              fill
              priority={prioridad}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div aria-hidden className="h-full w-full" />
          )}

          {producto.envio_gratis && !sinStock && (
            <Badge variant="secondary" className="absolute top-2 left-2">
              Envío gratis
            </Badge>
          )}

          {sinStock && (
            <div className="bg-background/70 absolute inset-0 grid place-items-center">
              <Badge variant="outline">Sin stock</Badge>
            </div>
          )}
        </div>

        <h3 className="mt-3 line-clamp-2 text-sm font-medium">{producto.nombre}</h3>
      </Link>

      <div className="mt-2 space-y-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <p className="text-base font-semibold">{formatCurrency(producto.precio)}</p>
          {porcentajeOff !== null && (
            <Badge variant="destructive" className="text-xs">
              -{porcentajeOff}% OFF
            </Badge>
          )}
        </div>

        {producto.precio_lista !== null && porcentajeOff !== null && (
          <p className="text-muted-foreground text-xs line-through">
            {formatCurrency(producto.precio_lista)}
          </p>
        )}

        <p className="text-xs">
          <span className="font-medium">{formatCurrency(precioTransferencia)}</span>{" "}
          <span className="text-muted-foreground">
            con Transferencia o depósito bancario
          </span>
        </p>

        <p className="text-muted-foreground text-xs">
          {CUOTAS_SIN_INTERES} x {formatCurrency(valorCuota)} sin interés
        </p>
      </div>
    </article>
  )
}
