"use client"

import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  slug: string
  name: string
  description?: string | null
  image?: string | null
  price: number | string
  compare_at_price?: number | string | null
  featured?: boolean
}

export function ProductCard({
  slug,
  name,
  description,
  image,
  price,
  compare_at_price,
  featured = false,
}: ProductCardProps) {
  const currentPrice = Number(price)

  const previousPrice =
    compare_at_price == null
      ? null
      : Number(compare_at_price)

  const hasDiscount =
    previousPrice !== null &&
    previousPrice > currentPrice

  return (
    <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md">

      {/* ================================
          IMAGEM DO PRODUTO
      ================================= */}

      <Link href={`/products/${slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">

          <Image
            src={image?.trim() || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="
              (max-width: 640px) 50vw,
              (max-width: 1024px) 25vw,
              (max-width: 1280px) 16.66vw,
              12.5vw
            "
          />

          {/* OFERTA */}
          <span className="absolute left-1.5 top-1.5 rounded-sm bg-red-600 px-1.5 py-0.5 text-[9px] font-bold text-white sm:text-[10px]">
            OFERTA
          </span>

          {/* DESTAQUE */}
          {featured && (
            <span className="absolute right-1.5 top-1.5 rounded-sm bg-black/80 px-1.5 py-0.5 text-[9px] font-medium text-white sm:text-[10px]">
              Destaque
            </span>
          )}

        </div>
      </Link>

      {/* ================================
          INFORMAÇÕES DO PRODUTO
      ================================= */}

      <div
        className="
          border-t
          border-gray-200
          bg-[#fffdf7]
          px-2
          py-1.5
          sm:px-2.5
          sm:py-2
        "
      >

        {/* NOME DO PRODUTO */}

        <Link href={`/products/${slug}`}>
          <h3
            className="
              line-clamp-2
              text-[11px]
              font-medium
              leading-[14px]
              text-gray-800
              hover:text-emerald-600
              sm:text-xs
            "
          >
            {name}
          </h3>
        </Link>

        {/* DESCRIÇÃO - UMA LINHA */}

        {description && (
          <p
            className="
              mt-0
              truncate
              text-[10px]
              leading-[13px]
              text-gray-500
              sm:text-[11px]
            "
          >
            {description}
          </p>
        )}

        {/* LOJA + VERIFICAÇÃO */}

        <div className="mt-0 flex items-center gap-1 leading-[13px]">

          <span className="text-[10px] font-medium text-gray-600 sm:text-[11px]">
            EXPREMIUM SHOP
          </span>

          {/* SELO DE VERIFICAÇÃO */}

          <span
            title="Loja verificada"
            className="
              flex
              h-[13px]
              w-[13px]
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-blue-500
              text-[8px]
              font-bold
              leading-none
              text-white
            "
          >
            ✓
          </span>

        </div>

        {/* PREÇO */}

        <div className="mt-0 flex items-baseline gap-1 leading-[16px]">

          <span className="text-sm font-bold text-black sm:text-base">
            {currentPrice.toFixed(2)} MZN
          </span>

          {hasDiscount && (
            <span className="text-[9px] text-gray-400 line-through sm:text-[10px]">
              {previousPrice!.toFixed(2)} MZN
            </span>
          )}

        </div>

      </div>
    </div>
  )
}