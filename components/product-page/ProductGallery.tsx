"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

interface GalleryImage {
  id: string
  image_url: string
  position?: number | null
}

interface ProductGalleryProps {
  image?: string | null
  name: string
  images?: GalleryImage[]
}

export default function ProductGallery({
  image,
  name,
  images = [],
}: ProductGalleryProps) {
  // =========================================================
  // CONSTRUIR LISTA DE IMAGENS
  // =========================================================

  const galleryImages = [
    ...(image
      ? [
          {
            id: "main-image",
            image_url: image,
            position: -1,
          },
        ]
      : []),

    ...images,
  ]

  // =========================================================
  // REMOVER IMAGENS REPETIDAS
  // =========================================================

  const uniqueImages = Array.from(
    new Map(
      galleryImages
        .filter((item) => item?.image_url)
        .map((item) => [item.image_url, item])
    ).values()
  )

  // =========================================================
  // IMAGEM PRINCIPAL
  // =========================================================

  const [activeImage, setActiveImage] = useState(
    uniqueImages[0]?.image_url || "/placeholder.svg"
  )

  // =========================================================
  // QUANDO AS IMAGENS VIEREM DO SUPABASE
  // =========================================================

  useEffect(() => {
    if (uniqueImages.length > 0) {
      setActiveImage(uniqueImages[0].image_url)
    }
  }, [image, images])

  // =========================================================
  // SEM IMAGEM
  // =========================================================

  if (uniqueImages.length === 0) {
    return (
      <div className="w-full">
        <div
          className="
            relative
            aspect-square
            w-full
            overflow-hidden
            rounded-lg
            border
            border-gray-200
            bg-white
          "
        >
          <Image
            src="/placeholder.svg"
            alt={name}
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>
    )
  }

  // =========================================================
  // GALERIA
  // =========================================================

  return (
    <div className="w-full">

      {/* =====================================================
          DESKTOP
      ===================================================== */}

      <div className="hidden lg:flex lg:gap-3">

        {/* MINIATURAS */}

        <div
          className="
            flex
            w-[68px]
            flex-col
            gap-2
          "
        >
          {uniqueImages.map((item, index) => {
            const selected =
              activeImage === item.image_url

            return (
              <button
                key={`${item.id}-${index}`}
                type="button"
                onClick={() =>
                  setActiveImage(item.image_url)
                }
                aria-label={`Selecionar imagem ${index + 1}`}
                className={`
                  relative
                  h-[68px]
                  w-[68px]
                  flex-shrink-0
                  overflow-hidden
                  rounded-md
                  border
                  bg-white
                  transition-all
                  duration-150

                  ${
                    selected
                      ? "border-black ring-1 ring-black"
                      : "border-gray-200 hover:border-gray-400"
                  }
                `}
              >
                <Image
                  src={item.image_url}
                  alt={`${name} - imagem ${index + 1}`}
                  fill
                  sizes="68px"
                  className="object-contain"
                />
              </button>
            )
          })}
        </div>

        {/* IMAGEM PRINCIPAL */}

        <div
          className="
            relative
            aspect-square
            min-w-0
            flex-1
            overflow-hidden
            rounded-lg
            border
            border-gray-200
            bg-white
          "
        >
          <Image
            src={activeImage}
            alt={name}
            fill
            priority
            sizes="
              (min-width: 1280px) 540px,
              48vw
            "
            className="
              object-contain
              p-2
              transition-transform
              duration-300
            "
          />
        </div>

      </div>

      {/* =====================================================
          MOBILE / TABLET
      ===================================================== */}

      <div className="lg:hidden">

        {/* IMAGEM PRINCIPAL */}

        <div
          className="
            relative
            aspect-square
            w-full
            overflow-hidden
            rounded-lg
            border
            border-gray-200
            bg-white
          "
        >
          <Image
            src={activeImage}
            alt={name}
            fill
            priority
            sizes="100vw"
            className="
              object-contain
              p-2
            "
          />
        </div>

        {/* MINIATURAS */}

        <div
          className="
            mt-3
            flex
            gap-2
            overflow-x-auto
            pb-1
          "
        >
          {uniqueImages.map((item, index) => {
            const selected =
              activeImage === item.image_url

            return (
              <button
                key={`${item.id}-${index}`}
                type="button"
                onClick={() =>
                  setActiveImage(item.image_url)
                }
                aria-label={`Selecionar imagem ${index + 1}`}
                className={`
                  relative
                  h-[64px]
                  w-[64px]
                  flex-shrink-0
                  overflow-hidden
                  rounded-md
                  border
                  bg-white

                  ${
                    selected
                      ? "border-black ring-1 ring-black"
                      : "border-gray-200"
                  }
                `}
              >
                <Image
                  src={item.image_url}
                  alt={`${name} - imagem ${index + 1}`}
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </button>
            )
          })}
        </div>

      </div>

      {/* =====================================================
          CONTADOR
      ===================================================== */}

      {uniqueImages.length > 1 && (
        <div
          className="
            mt-2
            text-xs
            text-gray-400
          "
        >
          {uniqueImages.length} imagens
        </div>
      )}

    </div>
  )
}