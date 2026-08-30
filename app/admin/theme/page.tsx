"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface Banner {
  id: string
  image_url: string
  position: number
  active: boolean
  created_at: string
}

interface StoreLogo {
  id: string
  logo_url: string
  updated_at: string
}

export default function ThemePage() {
  // =====================================================
  // LOGOTIPO
  // =====================================================

  const [logo, setLogo] = useState<StoreLogo | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState("")
  const [logoLoading, setLogoLoading] = useState(true)
  const [logoSaving, setLogoSaving] = useState(false)
  const [logoDeleting, setLogoDeleting] = useState(false)

  // =====================================================
  // BANNERS
  // =====================================================

  const [banners, setBanners] = useState<Banner[]>([])
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState("")
  const [bannersLoading, setBannersLoading] = useState(true)
  const [bannerSaving, setBannerSaving] = useState(false)

  // =====================================================
  // MENSAGENS
  // =====================================================

  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // =====================================================
  // CARREGAR LOGOTIPO
  // =====================================================

  async function loadLogo() {
    try {
      setLogoLoading(true)

      const { data, error } = await supabase
        .from("store_logo")
        .select("id, logo_url, updated_at")
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error("Erro ao carregar logotipo:", error)
        setError(`Erro ao carregar logotipo: ${error.message}`)
        return
      }

      setLogo(data || null)
    } catch (error) {
      console.error(error)
      setError("Ocorreu um erro ao carregar o logotipo.")
    } finally {
      setLogoLoading(false)
    }
  }

  // =====================================================
  // CARREGAR BANNERS
  // =====================================================

  async function loadBanners() {
    try {
      setBannersLoading(true)

      const { data, error } = await supabase
        .from("store_banners")
        .select("id, image_url, position, active, created_at")
        .order("position", {
          ascending: true,
        })
        .order("created_at", {
          ascending: true,
        })

      if (error) {
        console.error("Erro ao carregar banners:", error)
        setError(`Erro ao carregar banners: ${error.message}`)
        return
      }

      setBanners(data || [])
    } catch (error) {
      console.error(error)
      setError("Ocorreu um erro ao carregar os banners.")
    } finally {
      setBannersLoading(false)
    }
  }

  // =====================================================
  // CARREGAR TUDO
  // =====================================================

  useEffect(() => {
    loadLogo()
    loadBanners()
  }, [])

  // =====================================================
  // ESCOLHER LOGOTIPO
  // =====================================================

  function handleLogoImage(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) {
      return
    }

    if (!selectedFile.type.startsWith("image/")) {
      setError("Escolha uma imagem válida para o logotipo.")
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("O logotipo não pode ter mais de 5 MB.")
      return
    }

    setError("")
    setMessage("")
    setLogoFile(selectedFile)

    const previewUrl = URL.createObjectURL(selectedFile)
    setLogoPreview(previewUrl)
  }

  // =====================================================
  // ESCOLHER BANNER
  // =====================================================

  function handleBannerImage(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) {
      return
    }

    if (!selectedFile.type.startsWith("image/")) {
      setError("Escolha uma imagem válida para o banner.")
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("O banner não pode ter mais de 10 MB.")
      return
    }

    setError("")
    setMessage("")
    setBannerFile(selectedFile)

    const previewUrl = URL.createObjectURL(selectedFile)
    setBannerPreview(previewUrl)
  }

  // =====================================================
  // CAMINHO DO LOGOTIPO NO STORAGE
  // =====================================================

  function getLogoStoragePath(url: string) {
    if (!url) {
      return null
    }

    try {
      const marker =
        "/storage/v1/object/public/store-logo/"

      if (!url.includes(marker)) {
        return null
      }

      return decodeURIComponent(
        url.split(marker)[1]
      )
    } catch {
      return null
    }
  }

  // =====================================================
  // CAMINHO DO BANNER NO STORAGE
  // =====================================================

  function getBannerStoragePath(url: string) {
    if (!url) {
      return null
    }

    try {
      const marker =
        "/storage/v1/object/public/banners/"

      if (!url.includes(marker)) {
        return null
      }

      return decodeURIComponent(
        url.split(marker)[1]
      )
    } catch {
      return null
    }
  }

  // =====================================================
  // APAGAR ARQUIVO DO LOGOTIPO
  // =====================================================

  async function removeLogoFile(url: string) {
    const path = getLogoStoragePath(url)

    if (!path) {
      return
    }

    const { error } = await supabase.storage
      .from("store-logo")
      .remove([path])

    if (error) {
      console.warn(
        "Erro ao apagar arquivo antigo:",
        error
      )
    }
  }

  // =====================================================
  // APAGAR ARQUIVO DO BANNER
  // =====================================================

  async function removeBannerFile(url: string) {
    const path = getBannerStoragePath(url)

    if (!path) {
      return
    }

    const { error } = await supabase.storage
      .from("banners")
      .remove([path])

    if (error) {
      console.warn(
        "Erro ao apagar banner do Storage:",
        error
      )
    }
  }

  // =====================================================
  // GUARDAR LOGOTIPO
  // =====================================================

  async function handleSaveLogo() {
    if (!logoFile) {
      setError("Escolha uma imagem para o logotipo.")
      return
    }

    try {
      setLogoSaving(true)
      setError("")
      setMessage("")

      const extension =
        logoFile.name
          .split(".")
          .pop()
          ?.toLowerCase() || "png"

      const fileName =
        `logo-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}.${extension}`

      // Upload
      const { error: uploadError } =
        await supabase.storage
          .from("store-logo")
          .upload(fileName, logoFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: logoFile.type,
          })

      if (uploadError) {
        throw new Error(
          `Erro ao enviar logotipo: ${uploadError.message}`
        )
      }

      // URL pública
      const { data } =
        supabase.storage
          .from("store-logo")
          .getPublicUrl(fileName)

      const publicUrl = data.publicUrl

      if (!publicUrl) {
        await supabase.storage
          .from("store-logo")
          .remove([fileName])

        throw new Error(
          "Não foi possível obter a URL do logotipo."
        )
      }

      // Atualizar logotipo existente
      if (logo) {
        const oldUrl = logo.logo_url

        const {
          data: updatedLogo,
          error: updateError,
        } = await supabase
          .from("store_logo")
          .update({
            logo_url: publicUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", logo.id)
          .select(
            "id, logo_url, updated_at"
          )
          .single()

        if (updateError) {
          await supabase.storage
            .from("store-logo")
            .remove([fileName])

          throw new Error(
            `Erro ao atualizar logotipo: ${updateError.message}`
          )
        }

        setLogo(updatedLogo)

        if (oldUrl) {
          await removeLogoFile(oldUrl)
        }
      }

      // Criar logotipo
      else {
        const {
          data: newLogo,
          error: insertError,
        } = await supabase
          .from("store_logo")
          .insert({
            logo_url: publicUrl,
          })
          .select(
            "id, logo_url, updated_at"
          )
          .single()

        if (insertError) {
          await supabase.storage
            .from("store-logo")
            .remove([fileName])

          throw new Error(
            `Erro ao guardar logotipo: ${insertError.message}`
          )
        }

        setLogo(newLogo)
      }

      setLogoFile(null)
      setLogoPreview("")

      const input =
        document.getElementById(
          "logo-upload"
        ) as HTMLInputElement | null

      if (input) {
        input.value = ""
      }

      setMessage(
        "Logotipo guardado com sucesso!"
      )
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível guardar o logotipo."
      )
    } finally {
      setLogoSaving(false)
    }
  }

  // =====================================================
  // APAGAR LOGOTIPO
  // =====================================================

  async function handleDeleteLogo() {
    if (!logo) {
      return
    }

    const confirmed = window.confirm(
      "Tem certeza que deseja apagar o logotipo?"
    )

    if (!confirmed) {
      return
    }

    try {
      setLogoDeleting(true)
      setError("")
      setMessage("")

      const { error: deleteError } =
        await supabase
          .from("store_logo")
          .delete()
          .eq("id", logo.id)

      if (deleteError) {
        throw new Error(
          `Erro ao apagar logotipo: ${deleteError.message}`
        )
      }

      await removeLogoFile(logo.logo_url)

      setLogo(null)

      setMessage(
        "Logotipo apagado com sucesso!"
      )
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível apagar o logotipo."
      )
    } finally {
      setLogoDeleting(false)
    }
  }

  // =====================================================
  // GUARDAR BANNER
  // =====================================================

  async function handleSaveBanner() {
    if (!bannerFile) {
      setError("Escolha uma imagem para o banner.")
      return
    }

    try {
      setBannerSaving(true)
      setError("")
      setMessage("")

      const extension =
        bannerFile.name
          .split(".")
          .pop()
          ?.toLowerCase() || "jpg"

      const fileName =
        `banner-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}.${extension}`

      // Upload
      const { error: uploadError } =
        await supabase.storage
          .from("banners")
          .upload(fileName, bannerFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: bannerFile.type,
          })

      if (uploadError) {
        throw new Error(
          `Erro ao enviar banner: ${uploadError.message}`
        )
      }

      // URL pública
      const {
        data: publicUrlData,
      } = supabase.storage
        .from("banners")
        .getPublicUrl(fileName)

      const publicUrl =
        publicUrlData.publicUrl

      if (!publicUrl) {
        await supabase.storage
          .from("banners")
          .remove([fileName])

        throw new Error(
          "Não foi possível obter a URL do banner."
        )
      }

      // Posição
      const nextPosition =
        banners.length === 0
          ? 0
          : Math.max(
              ...banners.map(
                (banner) =>
                  Number(banner.position) || 0
              )
            ) + 1

      // Banco de dados
      const {
        data: newBanner,
        error: insertError,
      } = await supabase
        .from("store_banners")
        .insert({
          image_url: publicUrl,
          position: nextPosition,
          active: true,
        })
        .select(
          "id, image_url, position, active, created_at"
        )
        .single()

      if (insertError) {
        await supabase.storage
          .from("banners")
          .remove([fileName])

        throw new Error(
          `Erro ao guardar banner: ${insertError.message}`
        )
      }

      if (newBanner) {
        setBanners((current) =>
          [
            ...current,
            newBanner,
          ].sort(
            (a, b) =>
              a.position - b.position
          )
        )
      }

      setBannerFile(null)
      setBannerPreview("")

      const input =
        document.getElementById(
          "banner-upload"
        ) as HTMLInputElement | null

      if (input) {
        input.value = ""
      }

      setMessage(
        "Banner adicionado com sucesso!"
      )
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível guardar o banner."
      )
    } finally {
      setBannerSaving(false)
    }
  }

  // =====================================================
  // APAGAR BANNER
  // =====================================================

  async function handleDeleteBanner(
    banner: Banner
  ) {
    const confirmed = window.confirm(
      "Tem certeza que deseja apagar este banner?"
    )

    if (!confirmed) {
      return
    }

    try {
      setError("")
      setMessage("")

      const {
        error: deleteError,
      } = await supabase
        .from("store_banners")
        .delete()
        .eq("id", banner.id)

      if (deleteError) {
        throw new Error(
          `Erro ao apagar banner: ${deleteError.message}`
        )
      }

      await removeBannerFile(
        banner.image_url
      )

      setBanners((current) =>
        current.filter(
          (item) =>
            item.id !== banner.id
        )
      )

      setMessage(
        "Banner removido com sucesso!"
      )
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível apagar o banner."
      )
    }
  }

  // =====================================================
  // ATIVAR / DESATIVAR BANNER
  // =====================================================

  async function toggleBanner(
    banner: Banner
  ) {
    try {
      setError("")
      setMessage("")

      const newActive =
        !banner.active

      const {
        error: updateError,
      } = await supabase
        .from("store_banners")
        .update({
          active: newActive,
        })
        .eq("id", banner.id)

      if (updateError) {
        throw new Error(
          `Erro ao atualizar banner: ${updateError.message}`
        )
      }

      setBanners((current) =>
        current.map((item) =>
          item.id === banner.id
            ? {
                ...item,
                active: newActive,
              }
            : item
        )
      )

      setMessage(
        newActive
          ? "Banner ativado."
          : "Banner desativado."
      )
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o banner."
      )
    }
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto w-full max-w-6xl">

        {/* CABEÇALHO */}

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Tema da Loja
          </h1>

          <p className="mt-2 text-slate-600">
            Gerencie o logotipo e os banners.
          </p>
        </div>

        {/* MENSAGEM */}

        {message && (
          <div className="mb-5 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
          </div>
        )}

        {/* ERRO */}

        {error && (
          <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* =====================================================
            LOGOTIPO
        ===================================================== */}

        <section className="bg-white p-5 shadow-lg md:p-6">

          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Logotipo da loja
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              O logotipo será usado no Header.
            </p>
          </div>

          {/* LOGOTIPO ATUAL */}

          {logoLoading ? (
            <div className="flex min-h-[180px] items-center justify-center border border-slate-200 bg-slate-50">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
            </div>
          ) : logo ? (
            <div>

              <div className="flex min-h-[180px] items-center justify-center border border-slate-200 bg-white p-6">
                <img
                  src={logo.logo_url}
                  alt="Logotipo"
                  className="max-h-[120px] max-w-full object-contain"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-3">

                <label
                  htmlFor="logo-upload"
                  className="cursor-pointer bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
                >
                  Trocar logotipo
                </label>

                <button
                  type="button"
                  onClick={handleDeleteLogo}
                  disabled={logoDeleting}
                  className="bg-red-100 px-5 py-3 text-sm font-bold text-red-700 hover:bg-red-200 disabled:opacity-50"
                >
                  {logoDeleting
                    ? "A apagar..."
                    : "Apagar logotipo"}
                </button>

              </div>

            </div>
          ) : (
            <div className="flex min-h-[180px] items-center justify-center border border-dashed border-slate-300 bg-slate-50 text-center">
              <div>
                <div className="text-5xl">
                  🏪
                </div>

                <p className="mt-3 font-bold text-slate-800">
                  Nenhum logotipo cadastrado
                </p>
              </div>
            </div>
          )}

          {/* ESCOLHER LOGOTIPO */}

          <div className="mt-6">

            <label
              htmlFor="logo-upload"
              className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center hover:border-emerald-500 hover:bg-emerald-50"
            >

              <div className="mb-3 text-4xl">
                🖼️
              </div>

              <span className="text-lg font-bold text-slate-800">
                Escolher imagem do logotipo
              </span>

              <span className="mt-2 text-sm text-slate-500">
                PNG, JPG, JPEG ou WEBP • Máximo 5 MB
              </span>

              <input
                id="logo-upload"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleLogoImage}
                className="hidden"
              />

            </label>

          </div>

          {/* PREVIEW LOGO */}

          {logoPreview && (
            <div className="mt-6">

              <h3 className="mb-3 font-bold text-slate-800">
                Pré-visualização do logotipo
              </h3>

              <div className="flex min-h-[180px] items-center justify-center border border-slate-200 bg-white p-8">

                <img
                  src={logoPreview}
                  alt="Pré-visualização"
                  className="max-h-[130px] max-w-full object-contain"
                />

              </div>

              <button
                type="button"
                onClick={handleSaveLogo}
                disabled={
                  logoSaving || !logoFile
                }
                className="mt-5 w-full bg-emerald-500 px-6 py-4 font-bold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {logoSaving
                  ? "A guardar logotipo..."
                  : "Guardar logotipo"}
              </button>

            </div>
          )}

        </section>

        {/* =====================================================
            BANNERS
        ===================================================== */}

        <section className="mt-8">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-slate-900">
              Banners da Loja
            </h2>

            <p className="mt-2 text-slate-600">
              Adicione vários banners.
              Os banners ativos aparecerão
              no carrossel da loja.
            </p>

          </div>

          {/* ADICIONAR BANNER */}

          <div className="bg-white p-5 shadow-lg md:p-6">

            <h3 className="mb-5 text-xl font-bold text-slate-900">
              Adicionar Banner
            </h3>

            <label
              htmlFor="banner-upload"
              className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center hover:border-emerald-500 hover:bg-emerald-50"
            >

              <div className="mb-4 text-4xl">
                🖼️
              </div>

              <span className="text-lg font-bold text-slate-800">
                Escolher imagem do banner
              </span>

              <span className="mt-2 text-sm text-slate-500">
                PNG, JPG, JPEG ou WEBP • Máximo 10 MB
              </span>

              <input
                id="banner-upload"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleBannerImage}
                className="hidden"
              />

            </label>

            {/* PREVIEW BANNER */}

            {bannerPreview && (
              <div className="mt-6">

                <h3 className="mb-3 font-bold text-slate-800">
                  Pré-visualização
                </h3>

                <div className="aspect-[3.5/1] w-full overflow-hidden border border-slate-200 bg-slate-100">

                  <img
                    src={bannerPreview}
                    alt="Pré-visualização do banner"
                    className="h-full w-full object-cover"
                  />

                </div>

                <button
                  type="button"
                  onClick={handleSaveBanner}
                  disabled={
                    bannerSaving || !bannerFile
                  }
                  className="mt-5 w-full bg-emerald-500 px-6 py-4 font-bold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {bannerSaving
                    ? "A guardar banner..."
                    : "Adicionar Banner"}
                </button>

              </div>
            )}

          </div>

          {/* BANNERS CADASTRADOS */}

          <div className="mt-8">

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

              <h3 className="text-xl font-bold text-slate-900">
                Banners cadastrados
              </h3>

              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                {banners.length}{" "}
                {banners.length === 1
                  ? "banner"
                  : "banners"}
              </span>

            </div>

            {/* LOADING */}

            {bannersLoading && (
              <div className="bg-white p-10 text-center shadow">

                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />

                <p className="text-sm text-slate-500">
                  Carregando banners...
                </p>

              </div>
            )}

            {/* SEM BANNERS */}

            {!bannersLoading &&
              banners.length === 0 && (
                <div className="border border-dashed border-slate-300 bg-white p-10 text-center shadow">

                  <p className="font-semibold text-slate-700">
                    Nenhum banner cadastrado.
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Adicione o primeiro banner acima.
                  </p>

                </div>
              )}

            {/* LISTA */}

            {!bannersLoading &&
              banners.length > 0 && (
                <div className="space-y-5">

                  {banners.map(
                    (banner, index) => (
                      <div
                        key={banner.id}
                        className="overflow-hidden border border-slate-200 bg-white shadow-sm"
                      >

                        {/* IMAGEM */}

                        <div className="aspect-[3.5/1] w-full overflow-hidden bg-slate-100">

                          <img
                            src={banner.image_url}
                            alt={`Banner ${index + 1}`}
                            className="h-full w-full object-cover"
                          />

                        </div>

                        {/* CONTROLES */}

                        <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">

                          <div>

                            <p className="font-bold text-slate-800">
                              Banner {index + 1}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Posição:{" "}
                              {banner.position}
                            </p>

                            <p
                              className={`mt-1 text-xs font-semibold ${
                                banner.active
                                  ? "text-emerald-600"
                                  : "text-slate-400"
                              }`}
                            >
                              {banner.active
                                ? "Visível na loja"
                                : "Oculto na loja"}
                            </p>

                          </div>

                          <div className="flex flex-wrap gap-2">

                            {/* ATIVAR / DESATIVAR */}

                            <button
                              type="button"
                              onClick={() =>
                                toggleBanner(
                                  banner
                                )
                              }
                              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                                banner.active
                                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }`}
                            >
                              {banner.active
                                ? "Ativo"
                                : "Inativo"}
                            </button>

                            {/* APAGAR */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteBanner(
                                  banner
                                )
                              }
                              className="rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
                            >
                              Apagar
                            </button>

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}

          </div>

        </section>

      </div>
    </div>
  )
}