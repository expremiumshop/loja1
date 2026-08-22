"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function PromotionBanner() {
  const supabase = createClient()

  const [bannerUrl, setBannerUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    async function loadBanner() {
      try {
        setLoading(true)
        setImageError(false)

        const { data, error } = await supabase
          .from("store_theme_settings")
          .select("banner_url")
          .eq("id", 1)
          .single()

        if (error) {
          console.error("Erro ao carregar banner:", error)
          setBannerUrl("")
          return
        }

        console.log("URL do banner:", data?.banner_url)

        if (data?.banner_url) {
          setBannerUrl(data.banner_url)
        } else {
          setBannerUrl("")
        }
      } catch (error) {
        console.error("Erro ao carregar banner:", error)
        setBannerUrl("")
      } finally {
        setLoading(false)
      }
    }

    loadBanner()
  }, [supabase])

  // =========================================================
  // CARREGANDO
  // =========================================================

  if (loading) {
    return (
      <section className="w-full">
        <div className="h-[300px] w-full animate-pulse bg-slate-200 sm:h-[400px] md:h-[500px] lg:h-[560px]" />
      </section>
    )
  }

  // =========================================================
  // SEM BANNER
  // =========================================================

  if (!bannerUrl) {
    return null
  }

  // =========================================================
  // ERRO AO CARREGAR IMAGEM
  // =========================================================

  if (imageError) {
    return (
      <section className="w-full">
        <div className="flex h-[300px] w-full items-center justify-center bg-slate-100 text-center sm:h-[400px] md:h-[500px] lg:h-[560px]">
          <div>
            <p className="font-semibold text-red-600">
              Não foi possível carregar o banner.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Verifique o bucket banners no Supabase.
            </p>
          </div>
        </div>
      </section>
    )
  }

  // =========================================================
  // BANNER
  // =========================================================

  return (
    <section className="w-full overflow-hidden">
      <div
        className="
          relative
          h-[300px]
          w-full
          sm:h-[400px]
          md:h-[500px]
          lg:h-[560px]
          xl:h-[600px]
        "
      >
        <img
          src={bannerUrl}
          alt="Banner da loja"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            object-center
          "
          onLoad={() => {
            console.log("Banner carregado com sucesso:", bannerUrl)
            setImageError(false)
          }}
          onError={(event) => {
            console.error(
              "ERRO AO CARREGAR BANNER:",
              bannerUrl,
              event
            )

            setImageError(true)
          }}
        />
      </div>
    </section>
  )
}