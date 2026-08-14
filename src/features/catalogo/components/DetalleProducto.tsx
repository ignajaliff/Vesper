import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { BotonFavorito } from "@/features/favoritos/components/BotonFavorito"
import { formatCurrency } from "@/lib/format-currency"
import {
  CUOTAS_SIN_INTERES,
  calcularPorcentajeOff,
  calcularPrecioTransferencia,
  calcularValorCuota,
} from "@/lib/precios"
import { aSlug } from "@/lib/slug"
import { placeholderProducto } from "../placeholder"
import { type Producto } from "../types"
import { CaracteristicasProducto } from "./CaracteristicasProducto"
import { CompraProducto } from "./CompraProducto"
import { NotasOlfativas } from "./NotasOlfativas"
import { SelectorMl } from "./SelectorMl"

/**
 * Ficha de producto.
 *
 * Orden definido por el cliente: foto a la izquierda; a la derecha marca →
 * nombre → precio → cuotas → cantidad → comprar. Debajo, la pirámide olfativa
 * y las cuatro características. La página cierra con otros perfumes y las
 * reseñas, que arma `page.tsx`.
 */
export function DetalleProducto({ producto }: { producto: Producto }) {
  const sinStock = producto.stock <= 0
  const porcentajeOff = calcularPorcentajeOff(producto.precio, producto.precio_lista)
  const precioTransferencia = calcularPrecioTransferencia(producto.precio)
  const valorCuota = calcularValorCuota(producto.precio)
  const imagen = producto.imagen_url ?? placeholderProducto(producto.slug)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <nav aria-label="Miga de pan" className="mb-8">
        <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-xs">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden />
          <li>
            <Link
              href="/productos"
              className="hover:text-foreground transition-colors"
            >
              Catálogo
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden />
          <li>
            <Link
              href={`/marcas/${aSlug(producto.marca)}`}
              className="hover:text-foreground transition-colors"
            >
              {producto.marca}
            </Link>
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Fondo neutro, igual que en la tarjeta. */}
        <div className="bg-background border-border/70 relative aspect-square overflow-hidden rounded-sm border">
          <Image
            src={imagen}
            alt={producto.nombre}
            fill
            priority
            unoptimized={!producto.imagen_url}
            sizes="(max-width: 1024px) 100vw, 50vw"
            /* `contain` igual que en la tarjeta: la foto entra entera. */
            className="object-contain"
          />

          {porcentajeOff !== null && !sinStock && (
            <span className="bg-destructive text-background eyebrow absolute top-4 left-4 px-2.5 py-1.5">
              -{porcentajeOff}%
            </span>
          )}

          <BotonFavorito
            productoId={producto.id}
            nombre={producto.nombre}
            className="absolute top-4 right-4 size-10"
          />
        </div>

        <div className="flex flex-col">
          <Link
            href={`/marcas/${aSlug(producto.marca)}`}
            className="eyebrow text-muted-foreground hover:text-primary focus-visible:ring-ring w-fit rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {producto.marca}
          </Link>

          <h1 className="font-heading mt-3 text-3xl leading-tight font-normal tracking-tight text-balance sm:text-4xl">
            {/* `nombre` ya trae la marca adelante; se recorta para no repetirla
                bajo el rótulo de marca. */}
            {producto.nombre.startsWith(`${producto.marca} `)
              ? producto.nombre.slice(producto.marca.length + 1)
              : producto.nombre}
          </h1>

          <span aria-hidden className="filete mt-6" />

          <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-3xl font-bold tracking-tight">
              {formatCurrency(producto.precio)}
            </p>
            {producto.precio_lista !== null && porcentajeOff !== null && (
              <p className="text-muted-foreground text-lg line-through">
                {formatCurrency(producto.precio_lista)}
              </p>
            )}
          </div>

          <div className="mt-5 space-y-2">
            {/* El resaltador va en el `<span>`, no en el `<p>`: sobre el
                bloque pintaría todo el ancho de la columna. */}
            <p className="text-sm leading-relaxed">
              <span className="resaltador font-medium">
                {CUOTAS_SIN_INTERES} cuotas sin interés de{" "}
                {formatCurrency(valorCuota)}
              </span>
            </p>
            <p className="text-sm leading-relaxed">
              <span className="text-destructive font-medium">
                {formatCurrency(precioTransferencia)}
              </span>{" "}
              <span className="text-muted-foreground">
                pagando por transferencia
              </span>
            </p>
          </div>

          {producto.presentaciones.length > 1 && (
            <div className="mt-8">
              <p className="eyebrow text-muted-foreground mb-3">Tamaño</p>
              <SelectorMl
                presentaciones={producto.presentaciones}
                nombre={producto.nombre}
                tamano="lg"
              />
            </div>
          )}

          <CompraProducto producto={producto} />

          {producto.descripcion && (
            <div className="border-border/70 mt-8 border-t pt-8">
              <p className="text-sm leading-relaxed text-pretty">
                {producto.descripcion}
              </p>
            </div>
          )}
        </div>
      </div>

      {producto.notas && <NotasOlfativas notas={producto.notas} />}

      {producto.caracteristicas && (
        <CaracteristicasProducto caracteristicas={producto.caracteristicas} />
      )}
    </div>
  )
}
