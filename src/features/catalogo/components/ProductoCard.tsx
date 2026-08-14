import Image from "next/image"
import Link from "next/link"

import { BotonAgregar } from "@/features/carrito/components/BotonAgregar"
import { BotonFavorito } from "@/features/favoritos/components/BotonFavorito"
import { formatCurrency } from "@/lib/format-currency"
import {
  CUOTAS_SIN_INTERES,
  calcularPorcentajeOff,
  calcularValorCuota,
} from "@/lib/precios"
import { aSlug } from "@/lib/slug"
import { cn } from "@/lib/utils"
import { placeholderProducto } from "../placeholder"
import { type ProductoCardProps } from "../types"
import { SelectorMl } from "./SelectorMl"

/**
 * Tarjeta de producto.
 *
 * Orden definido por el cliente: % de descuento arriba a la izquierda, corazón
 * arriba a la derecha, foto ocupando de extremo a extremo, y debajo marca →
 * nombre → precio con descuento + precio tachado → cuotas.
 *
 * El botón de compra NO está siempre visible: aparece sobre la foto al pasar el
 * cursor. En táctil no hay hover, así que ahí se entra a la ficha y se compra
 * desde adentro.
 */
export function ProductoCard({ producto, prioridad = false }: ProductoCardProps) {
  const sinStock = producto.stock <= 0
  const porcentajeOff = calcularPorcentajeOff(producto.precio, producto.precio_lista)
  const valorCuota = calcularValorCuota(producto.precio)
  const imagen = producto.imagen_url ?? placeholderProducto(producto.slug)
  // Solo hay cambio si el producto trae segunda foto: sin ella, el hover
  // mantiene el zoom de siempre sobre la principal.
  const imagenHover = producto.imagen_hover_url

  return (
    /* Tarjeta enmarcada con un filete de 1px que se oscurece al pasar el
       cursor: el borde fino sostiene la grilla sin agregar peso visual. */
    <article className="group border-border/70 hover:border-foreground/25 relative flex w-full flex-col border transition-colors">
      {/* Fondo blanco: las fotos de producto vienen sobre blanco de estudio,
          así el `object-contain` no deja franjas de otro color a los costados. */}
      <div className="bg-background relative aspect-square overflow-hidden">
        <Link
          href={`/productos/${producto.slug}`}
          className="focus-visible:ring-ring absolute inset-0 z-[1] focus-visible:ring-2 focus-visible:ring-inset focus-visible:outline-none"
          aria-label={producto.nombre}
        >
          <Image
            src={imagen}
            alt={producto.nombre}
            fill
            priority={prioridad}
            unoptimized={!producto.imagen_url}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            /* `object-contain`, NO `cover`: las fotos vienen en proporciones
               distintas (cuadradas y verticales) y `cover` recorta arriba y
               abajo las verticales, que se ve como si estuvieran cortadas.
               Con `contain` entran enteras y el encuadre lo decide la foto. */
            className={cn(
              "object-contain transition-all duration-500 ease-out",
              // Con segunda foto el zoom lo hace la de hover; sin ella, ésta.
              imagenHover
                ? "group-hover:opacity-0"
                : "group-hover:scale-[1.04]"
            )}
          />

          {/* Segunda foto: entra cruzando opacidad al pasar el cursor. Va con
              `alt=""` porque muestra el mismo producto que la principal — un
              lector de pantalla leería el nombre dos veces. */}
          {imagenHover && (
            <Image
              src={imagenHover}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="scale-[1.04] object-contain opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
            />
          )}
        </Link>

        {porcentajeOff !== null && !sinStock && (
          <span className="bg-destructive text-background eyebrow absolute top-3 left-3 z-[2] px-2 py-1">
            -{porcentajeOff}%
          </span>
        )}

        {/* z-[2]: por encima del Link que cubre la foto, si no el corazón no
            recibe el clic y el usuario termina navegando a la ficha. */}
        <BotonFavorito
          productoId={producto.id}
          nombre={producto.nombre}
          className="absolute top-3 right-3 z-[2]"
        />

        {sinStock && (
          <div className="bg-background/65 absolute inset-0 z-[2] grid place-items-center backdrop-blur-[1px]">
            <span className="border-foreground/25 text-foreground eyebrow border px-3 py-1.5">
              Sin stock
            </span>
          </div>
        )}
      </div>

      {/* Filete que separa la foto del texto, del mismo peso que el marco. */}
      <div className="border-border/70 flex flex-1 flex-col border-t p-4">
        <Link
          href={`/marcas/${aSlug(producto.marca)}`}
          className="eyebrow text-muted-foreground hover:text-primary focus-visible:ring-ring mb-1.5 w-fit rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          {producto.marca}
        </Link>

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

        {/* Renglón del selector, reservado SIEMPRE (`min-h`): sin esto los
            carruseles cuyos productos no tienen presentaciones quedan 18px más
            bajos que los que sí, y las secciones se ven escalonadas entre sí
            aunque dentro de cada fila estén parejas. */}
        <div className="mt-3 min-h-[1.625rem]">
          <SelectorMl
            presentaciones={producto.presentaciones}
            nombre={producto.nombre}
          />
        </div>

        {/* `mt-auto` empuja el precio al pie de la card: el nombre ocupa una o
            dos líneas, así que sin esto el precio queda a distinta altura. */}
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-1 pt-3">
          <p className="text-lg font-bold tracking-tight">
            {formatCurrency(producto.precio)}
          </p>
          {/* Se reserva el renglón aunque no haya precio tachado: sin esto la
              línea de cuotas queda a distinta altura en cada card. */}
          <p
            className="text-muted-foreground text-sm line-through"
            aria-hidden={producto.precio_lista === null || porcentajeOff === null}
          >
            {producto.precio_lista !== null && porcentajeOff !== null
              ? formatCurrency(producto.precio_lista)
              : " "}
          </p>
        </div>

        {/* El resaltador va en el `<span>`, no en el `<p>`: sobre el bloque
            pintaría todo el ancho de la card aunque el texto no llegue. */}
        <p className="mt-2 text-xs leading-relaxed">
          <span className="resaltador font-medium">
            {CUOTAS_SIN_INTERES} cuotas sin interés de{" "}
            {formatCurrency(valorCuota)}
          </span>
        </p>

        {/* Comprar al pie de la tarjeta, no sobre la foto. Aparece al pasar el
            cursor y va con `inert` porque en táctil no hay hover: ahí el camino
            es entrar a la ficha y comprar desde adentro.
            El renglón se reserva siempre (`min-h`) para que las cards midan lo
            mismo con y sin el botón visible. */}
        {!sinStock && (
          <div className="mt-3 min-h-9">
            <div
              inert
              className="translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            >
              <BotonAgregar
                producto={producto}
                variante="oscuro"
                className="h-9 w-full rounded-none text-xs"
              />
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
