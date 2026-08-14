"use client"

import { useId, useState } from "react"

import { cn } from "@/lib/utils"
import { type Presentacion } from "../types"

type SelectorMlProps = {
  presentaciones: Presentacion[]
  /** Nombre del producto, para el rótulo accesible del grupo. */
  nombre: string
  /** Botones más grandes, para la ficha. */
  tamano?: "sm" | "lg"
  className?: string
}

/**
 * Elige el tamaño del frasco.
 *
 * ANDAMIAJE: hoy es solo visual — cambiar de tamaño no cambia el precio ni lo
 * que se agrega a la bolsa. Al conectar Supabase, cada presentación va a ser su
 * propia fila de `productos` y elegir una navegará a ese producto.
 *
 * Se arma con radios reales (no `<button>`) para que las flechas del teclado
 * muevan la selección y los lectores de pantalla lo anuncien como un grupo de
 * opciones, que es lo que es. El input va oculto y el estilo lo lleva el label.
 */
export function SelectorMl({
  presentaciones,
  nombre,
  tamano = "sm",
  className,
}: SelectorMlProps) {
  const inicial =
    presentaciones.find((p) => p.predeterminada)?.ml ?? presentaciones[0]?.ml

  const [elegida, setElegida] = useState(inicial)

  /*
   * El `id` y el `name` NO pueden derivarse del slug del producto: un mismo
   * perfume aparece en más de un carrusel de la home (p. ej. en "Los más
   * elegidos" y en "Ofertas"), así que se renderizarían dos selectores con el
   * mismo `name`. El navegador los trataría como UN grupo de radios y marcar
   * uno desmarcaría el otro — verificado: dos inputs con el mismo id, uno con
   * `checked` en false. `useId` da un prefijo único por instancia.
   */
  const uid = useId()

  // Con una sola presentación no hay nada que elegir.
  if (presentaciones.length < 2) return null

  const grande = tamano === "lg"

  return (
    <fieldset className={cn("flex flex-wrap gap-1.5", className)}>
      <legend className="sr-only">Tamaño de {nombre}</legend>

      {presentaciones.map(({ ml }) => {
        const activa = ml === elegida
        const id = `${uid}-${ml}`

        return (
          <div key={ml}>
            {/*
              `checked` + `onChange` deja el input controlado por React, pero
              la propiedad viva del DOM (`input.checked`) queda en `false` tras
              hidratar: el estilo del label se ve bien y sin embargo
              `querySelector(":checked")` no encuentra nada, y un `<form>` no
              enviaría el valor. Con `defaultChecked` el navegador marca el
              input de verdad y React solo sigue el cambio.
            */}
            <input
              type="radio"
              id={id}
              name={uid}
              value={ml}
              defaultChecked={activa}
              onChange={() => setElegida(ml)}
              className="peer sr-only"
            />
            <label
              htmlFor={id}
              className={cn(
                // Píldora: `rounded-full` en vez del ángulo vivo del resto.
                "block cursor-pointer rounded-full border text-center tracking-tight transition-colors",
                "peer-focus-visible:ring-foreground/30 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2",
                grande ? "px-5 py-2 text-sm" : "px-3 py-1 text-xs",
                activa
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
              )}
            >
              {ml} ml
            </label>
          </div>
        )
      })}
    </fieldset>
  )
}
