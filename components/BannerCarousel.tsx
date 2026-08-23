"use client"

import { useEffect, useState } from "react"
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

  useEffect(() => {
    let mounted = true

    async function loadBanners() {
      try {
        const { data, error } = await supabase
          .from("store_banners")
          .select("id, image_url, position")
          .eq("active", true)
          .order("position", {
            ascending: true,
          })

        if (error) {
          console.error("Erro ao carregar banners:", error)
          return
        }

        if (mounted) {
          setBanners(data || [])
          setCurrent(0)
        }
      } catch (error) {
        console.error("Erro ao carregar banners:", error)
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

  useEffect(() => {
    if (banners.length <= 1) {
      return
    }

    const timer = window.setInterval(() => {
      setCurrent((value) => (value + 1) % banners.length)
    }, 5000)

    return () => {
      window.clearInterval(timer)
    }
  }, [banners.length])

  if (loading) {
    return (
      <section className="w-full px-3 py-3 md:px-6 md:py-5">
        <div
          className="
            mx-auto
            w-full
            max-w-[1440px]
            overflow-hidden
            rounded-2xl
            bg-gray-200
            animate-pulse
            aspect-[16/7]
            sm:aspect-[16/7]
            md:aspect-[16/6]
            lg:aspect-[16/5.5]
          "
        />
      </section>
    )
  }

  if (banners.length === 0) {
    return null
  }

  return (
    <section className="w-full px-3 py-3 md:px-6 md:py-5">
      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1440px]
          overflow-hidden
          rounded-2xl
          md:rounded-3xl
          bg-gray-100
        "
      >
        <div
          className="
            relative
            w-full
            aspect-[16/7]
            sm:aspect-[16/7]
            md:aspect-[16/6]
            lg:aspect-[16/5.5]
          "
        >
          {banners.map((banner, index) => (
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
                  alt={`Banner ${index + 1}`}
                  className="
                    block
                    h-full
                    w-full
                    object-cover
                  "
                />
              </Link>
            </div>
          ))}
        </div>

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
              bg-black/30
              px-3
              py-1.5
              backdrop-blur-sm
              md:bottom-4
            "
          >
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Ir para banner ${index + 1}`}
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
            ))}
          </div>
        )}
      </div>
    </section>
  )
}