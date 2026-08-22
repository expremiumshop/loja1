"use client"

import {
  useEffect,
  useState,
} from "react"

import Link from "next/link"

import { createClient } from "@/lib/supabase/client"

interface Banner {
  id: string
  image_url: string
  position: number
}

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  // =====================================================
  // CARREGAR BANNERS
  // =====================================================

  useEffect(() => {
    let mounted = true

    async function loadBanners() {
      try {
        const {
          data,
          error,
        } = await supabase
          .from("store_banners")
          .select(
            "id, image_url, position"
          )
          .eq("active", true)
          .order("position", {
            ascending: true,
          })

        if (error) {
          console.error(
            "Erro ao carregar banners:",
            error
          )

          return
        }

        if (mounted) {
          setBanners(data || [])
          setCurrent(0)
        }
      } catch (error) {
        console.error(
          "Erro ao carregar banners:",
          error
        )
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadBanners()

    return () => {
      mounted = false
    }
  }, [])

  // =====================================================
  // TROCA AUTOMÁTICA
  // =====================================================

  useEffect(() => {
    if (banners.length <= 1) {
      return
    }

    const timer =
      window.setInterval(() => {
        setCurrent(
          (value) =>
            (value + 1) %
            banners.length
        )
      }, 5000)

    return () => {
      window.clearInterval(timer)
    }
  }, [banners.length])

  // =====================================================
  // CARREGANDO
  // =====================================================

  if (loading) {
    return (
      <section className="w-full">
        <div
          className="
            aspect-[3.5/1]
            w-full
            animate-pulse
            bg-gray-200
          "
        />
      </section>
    )
  }

  // =====================================================
  // SEM BANNERS
  // =====================================================

  if (banners.length === 0) {
    return null
  }

  return (
    <section className="w-full overflow-hidden">
      <div className="relative w-full bg-gray-100">

        {/* =================================================
            ÁREA DO BANNER
        ================================================= */}

        <div
          className="
            relative
            aspect-[3.5/1]
            w-full
            overflow-hidden
          "
        >
          {banners.map(
            (banner, index) => (
              <div
                key={banner.id}
                className={`
                  absolute
                  inset-0
                  transition-opacity
                  duration-700
                  ease-in-out
                  ${
                    index === current
                      ? "z-10 opacity-100"
                      : "z-0 opacity-0"
                  }
                `}
              >
                <Link
                  href="#"
                  className="block h-full w-full"
                >
                  <img
                    src={banner.image_url}
                    alt={`Banner ${
                      index + 1
                    }`}
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />
                </Link>
              </div>
            )
          )}
        </div>

        {/* =================================================
            INDICADORES
        ================================================= */}

        {banners.length > 1 && (
          <div
            className="
              absolute
              bottom-3
              left-1/2
              z-20
              flex
              -translate-x-1/2
              items-center
              gap-2
              rounded-full
              bg-black/20
              px-3
              py-1.5
              backdrop-blur-sm
            "
          >
            {banners.map(
              (banner, index) => (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() =>
                    setCurrent(index)
                  }
                  aria-label={`Ir para banner ${
                    index + 1
                  }`}
                  className={`
                    h-2
                    rounded-full
                    transition-all
                    ${
                      index === current
                        ? "w-6 bg-white"
                        : "w-2 bg-white/60"
                    }
                  `}
                />
              )
            )}
          </div>
        )}

      </div>
    </section>
  )
}