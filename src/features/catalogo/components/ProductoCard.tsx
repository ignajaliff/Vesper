import Image from "next/image"
import Link from "next/link"

import { formatCurrency } from "@/lib/format-currency"
import {
  CUOTAS_SIN_INTERES,
  calcularPorcentajeOff,
  calcularPrecioTransferencia,
  calcularValorCuota,
} from "@/lib/precios"
import { placeholderProducto } from "../placeholder"
import { type ProductoCardProps } from "../types"

export function ProductoCard({ producto, prioridad = false }: ProductoCardProps) {
  const sinStock = producto.stock <= 0
  const porcentajeOff = calcularPorcentajeOff(producto.precio, producto.precio_lista)
  const precioTransferencia = calcularPrecioTransferencia(producto.precio)
  const valorCuota = calcularValorCuota(producto.precio)
  const imagen = producto.imagen_url ?? placeholderProducto(producto.slug)

  return (
    <article className="group relative flex flex-col">
      <Link
        href={`/productos/${producto.slug}`}
        className="focus-visible:ring-ring rounded-sm focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
      >
        <div className="bg-secondary relative aspect-[4/5] overflow-hidden rounded-sm">
          <Image
            src={imagen}
            alt={producto.nombre}
            fill
            priority={prioridad}
            unoptimized={!producto.imagen_url}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />

          {/* Etiquetas sin fondo sólido: pisan menos la foto que un badge. */}
          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
            {porcentajeOff !== null && !sinStock && (
              <span className="bg-destructive text-background eyebrow px-2 py-1">
                {porcentajeOff}% off
              </span>
            )}
            {producto.envio_gratis && !sinStock && (
              <span className="bg-background/85 text-foreground eyebrow px-2 py-1 backdrop-blur-sm">
                Envío gratis
              </span>
            )}
          </div>

          {sinStock && (
            <div className="bg-background/65 absolute inset-0 grid place-items-center backdrop-blur-[1px]">
              <span className="border-foreground/25 text-foreground eyebrow border px-3 py-1.5">
                Sin stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="eyebrow text-muted-foreground mb-1.5">{producto.marca}</p>

        <Link
          href={`/productos/${producto.slug}`}
          className="focus-visible:ring-ring rounded-sm focus-visible:ring-2 focus-visible:outline-none"
        >
          {/* `nombre` ya trae la marca adelante; se recorta para no repetirla
              bajo el rótulo de marca. */}
          <h3 className="font-heading group-hover:text-primary line-clamp-2 text-[0.9375rem] leading-snug font-normal text-balance transition-colors">
            {producto.nombre.startsWith(`${producto.marca} `)
              ? producto.nombre.slice(producto.marca.length + 1)
              : producto.nombre}
          </h3>
        </Link>

        <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p className="text-lg font-medium tracking-tight">
            {formatCurrency(producto.precio)}
          </p>
          {/* Se reserva el renglón aunque no haya precio tachado: sin esto el
              filete de abajo queda a distinta altura en cada card de la grilla. */}
          <p
            className="text-muted-foreground text-sm line-through"
            aria-hidden={producto.precio_lista === null || porcentajeOff === null}
          >
            {producto.precio_lista !== null && porcentajeOff !== null
              ? formatCurrency(producto.precio_lista)
              : " "}
          </p>
        </div>

        {/* El bloque de financiación se separa con un filete finito. */}
        <div className="border-border/70 mt-3 space-y-1 border-t pt-3">
          <p className="text-xs leading-relaxed">
            <span className="text-destructive font-medium">
              {formatCurrency(precioTransferencia)}
            </span>{" "}
            <span className="text-muted-foreground">con transferencia</span>
          </p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            {CUOTAS_SIN_INTERES} cuotas sin interés de {formatCurrency(valorCuota)}
          </p>
        </div>
      </div>
    </article>
  )
}
