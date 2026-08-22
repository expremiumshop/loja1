"use client"

import {
  useEffect,
  useState,
} from "react"

import { supabase } from "@/lib/supabase"

interface Banner {
  id: string
  image_url: string
  position: number
  active: boolean
  created_at: string
}

export default function ThemePage() {
  const [banners, setBanners] = useState<Banner[]>([])

  const [file, setFile] =
    useState<File | null>(null)

  const [preview, setPreview] =
    useState("")

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [message, setMessage] =
    useState("")

  const [error, setError] =
    useState("")

  // =====================================================
  // CARREGAR BANNERS
  // =====================================================

  async function loadBanners() {
    try {
      setLoading(true)
      setError("")

      const {
        data,
        error,
      } = await supabase
        .from("store_banners")
        .select(
          "id, image_url, position, active, created_at"
        )
        .order("position", {
          ascending: true,
        })
        .order("created_at", {
          ascending: true,
        })

      if (error) {
        console.error(
          "Erro ao carregar banners:",
          error
        )

        setError(
          `Não foi possível carregar os banners: ${error.message}`
        )

        return
      }

      setBanners(data || [])
    } catch (error) {
      console.error(
        "Erro ao carregar banners:",
        error
      )

      setError(
        "Ocorreu um erro ao carregar os banners."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBanners()
  }, [])

  // =====================================================
  // ESCOLHER IMAGEM
  // =====================================================

  function handleImage(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile =
      event.target.files?.[0]

    if (!selectedFile) {
      return
    }

    if (
      !selectedFile.type.startsWith("image/")
    ) {
      setError(
        "Escolha um arquivo de imagem válido."
      )

      return
    }

    if (
      selectedFile.size >
      10 * 1024 * 1024
    ) {
      setError(
        "A imagem não pode ter mais de 10 MB."
      )

      return
    }

    setError("")
    setMessage("")

    setFile(selectedFile)

    const previewUrl =
      URL.createObjectURL(selectedFile)

    setPreview(previewUrl)
  }

  // =====================================================
  // GUARDAR BANNER
  // =====================================================

  async function handleSave() {
    if (!file) {
      setError(
        "Escolha uma imagem antes de guardar."
      )

      return
    }

    try {
      setSaving(true)
      setError("")
      setMessage("")

      // =================================================
      // 1. NOME ÚNICO
      // =================================================

      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() || "jpg"

      const fileName =
        `banner-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}.${extension}`

      // =================================================
      // 2. UPLOAD PARA STORAGE
      // =================================================

      const {
        error: uploadError,
      } = await supabase.storage
        .from("banners")
        .upload(
          fileName,
          file,
          {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          }
        )

      if (uploadError) {
        console.error(
          "Erro no upload:",
          uploadError
        )

        throw new Error(
          `Erro ao enviar imagem: ${uploadError.message}`
        )
      }

      // =================================================
      // 3. URL PÚBLICA
      // =================================================

      const {
        data: publicUrlData,
      } = supabase.storage
        .from("banners")
        .getPublicUrl(
          fileName
        )

      const publicUrl =
        publicUrlData.publicUrl

      if (!publicUrl) {
        await supabase.storage
          .from("banners")
          .remove([fileName])

        throw new Error(
          "Não foi possível obter a URL pública do banner."
        )
      }

      // =================================================
      // 4. PRÓXIMA POSIÇÃO
      // =================================================

      const nextPosition =
        banners.length === 0
          ? 0
          : Math.max(
              ...banners.map(
                (banner) =>
                  Number(
                    banner.position
                  ) || 0
              )
            ) + 1

      // =================================================
      // 5. INSERIR NA TABELA
      // =================================================

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
        console.error(
          "Erro ao inserir banner:",
          insertError
        )

        // Apagar arquivo caso o banco falhe
        await supabase.storage
          .from("banners")
          .remove([fileName])

        throw new Error(
          `Erro ao guardar banner: ${insertError.message}`
        )
      }

      // =================================================
      // 6. ATUALIZAR INTERFACE
      // =================================================

      if (newBanner) {
        setBanners((current) =>
          [
            ...current,
            newBanner,
          ].sort(
            (a, b) =>
              a.position -
              b.position
          )
        )
      }

      setFile(null)
      setPreview("")

      setMessage(
        "Banner adicionado com sucesso!"
      )

      const input =
        document.getElementById(
          "banner-upload"
        ) as HTMLInputElement | null

      if (input) {
        input.value = ""
      }
    } catch (error) {
      console.error(
        "Erro ao guardar banner:",
        error
      )

      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(
          "Não foi possível guardar o banner."
        )
      }
    } finally {
      setSaving(false)
    }
  }

  // =====================================================
  // CAMINHO DO STORAGE
  // =====================================================

  function getStoragePath(
    url: string
  ) {
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
  // APAGAR BANNER
  // =====================================================

  async function handleDelete(
    banner: Banner
  ) {
    const confirmed =
      window.confirm(
        "Tem certeza que deseja apagar este banner?"
      )

    if (!confirmed) {
      return
    }

    try {
      setError("")
      setMessage("")

      // =================================================
      // 1. APAGAR DA TABELA
      // =================================================

      const {
        error: deleteDbError,
      } = await supabase
        .from("store_banners")
        .delete()
        .eq(
          "id",
          banner.id
        )

      if (deleteDbError) {
        throw new Error(
          `Erro ao apagar banner: ${deleteDbError.message}`
        )
      }

      // =================================================
      // 2. APAGAR DO STORAGE
      // =================================================

      const storagePath =
        getStoragePath(
          banner.image_url
        )

      if (storagePath) {
        const {
          error: storageError,
        } = await supabase.storage
          .from("banners")
          .remove([
            storagePath,
          ])

        if (storageError) {
          console.warn(
            "Banner removido da tabela, mas não do Storage:",
            storageError
          )
        }
      }

      // =================================================
      // 3. ATUALIZAR LISTA
      // =================================================

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
      console.error(
        "Erro ao apagar banner:",
        error
      )

      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(
          "Não foi possível apagar o banner."
        )
      }
    }
  }

  // =====================================================
  // ATIVAR / DESATIVAR
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
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          banner.id
        )

      if (updateError) {
        throw new Error(
          `Erro ao atualizar banner: ${updateError.message}`
        )
      }

      setBanners((current) =>
        current.map(
          (item) =>
            item.id === banner.id
              ? {
                  ...item,
                  active:
                    newActive,
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
      console.error(
        "Erro ao atualizar banner:",
        error
      )

      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(
          "Não foi possível atualizar o banner."
        )
      }
    }
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className="
        min-h-screen
        bg-slate-100
        p-4
        md:p-6
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-6xl
        "
      >

        {/* =================================================
            CABEÇALHO
        ================================================= */}

        <div className="mb-6">

          <h1
            className="
              text-3xl
              font-bold
              text-slate-900
            "
          >
            Banners da Loja
          </h1>

          <p
            className="
              mt-2
              max-w-3xl
              break-words
              text-slate-600
            "
          >
            Adicione vários banners.
            Todos os banners ativos
            aparecerão automaticamente
            no carrossel da loja.
          </p>

        </div>

        {/* =================================================
            MENSAGEM DE SUCESSO
        ================================================= */}

        {message && (
          <div
            className="
              mb-5
              rounded-xl
              border
              border-emerald-200
              bg-emerald-50
              px-4
              py-3
              text-sm
              font-medium
              text-emerald-700
              break-words
            "
          >
            {message}
          </div>
        )}

        {/* =================================================
            ERRO
        ================================================= */}

        {error && (
          <div
            className="
              mb-5
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              font-medium
              text-red-700
              break-words
            "
          >
            {error}
          </div>
        )}

        {/* =================================================
            ADICIONAR BANNER
        ================================================= */}

        <div
          className="
            rounded-2xl
            bg-white
            p-5
            shadow-lg
            md:p-6
          "
        >

          <h2
            className="
              mb-5
              text-xl
              font-bold
              text-slate-900
            "
          >
            Adicionar Banner
          </h2>

          {/* ESCOLHER IMAGEM */}

          <label
            htmlFor="banner-upload"
            className="
              flex
              min-h-[180px]
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-2xl
              border-2
              border-dashed
              border-slate-300
              bg-slate-50
              px-6
              py-10
              text-center
              transition
              hover:border-emerald-500
              hover:bg-emerald-50
            "
          >

            <div
              className="
                mb-4
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-emerald-100
                text-2xl
              "
            >
              🖼️
            </div>

            <span
              className="
                text-lg
                font-bold
                text-slate-800
              "
            >
              Escolher imagem do banner
            </span>

            <span
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              Adicione outro banner à loja
            </span>

            <span
              className="
                mt-1
                text-xs
                text-slate-400
              "
            >
              PNG, JPG, JPEG ou WEBP • Máximo 10 MB
            </span>

            <input
              id="banner-upload"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImage}
              className="hidden"
            />

          </label>

          {/* =================================================
              PRÉ-VISUALIZAÇÃO
          ================================================= */}

          {preview && (
            <div className="mt-6">

              <div
                className="
                  mb-3
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-3
                "
              >

                <h3
                  className="
                    font-bold
                    text-slate-800
                  "
                >
                  Pré-visualização
                </h3>

                <span
                  className="
                    rounded-full
                    bg-amber-100
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-amber-700
                  "
                >
                  Novo banner
                </span>

              </div>

              <div
                className="
                  aspect-[3.5/1]
                  w-full
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-100
                  shadow-sm
                "
              >
                <img
                  src={preview}
                  alt="Pré-visualização do banner"
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              </div>

            </div>
          )}

          {/* =================================================
              BOTÃO
          ================================================= */}

          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving || !file
            }
            className="
              mt-6
              flex
              w-full
              items-center
              justify-center
              rounded-xl
              bg-emerald-500
              px-6
              py-4
              text-base
              font-bold
              text-white
              shadow-md
              transition
              hover:bg-emerald-600
              disabled:cursor-not-allowed
              disabled:bg-slate-300
            "
          >
            {saving ? (
              <>
                <span
                  className="
                    mr-3
                    h-5
                    w-5
                    animate-spin
                    rounded-full
                    border-2
                    border-white
                    border-t-transparent
                  "
                />

                A guardar banner...
              </>
            ) : (
              "Adicionar Banner"
            )}
          </button>

          <p
            className="
              mt-3
              text-center
              text-xs
              text-slate-400
            "
          >
            O novo banner será adicionado
            aos existentes e não substituirá
            os anteriores.
          </p>

        </div>

        {/* =================================================
            BANNERS CADASTRADOS
        ================================================= */}

        <div className="mt-8">

          <div
            className="
              mb-4
              flex
              flex-wrap
              items-center
              justify-between
              gap-3
            "
          >

            <h2
              className="
                text-xl
                font-bold
                text-slate-900
              "
            >
              Banners cadastrados
            </h2>

            <span
              className="
                rounded-full
                bg-slate-200
                px-3
                py-1
                text-xs
                font-semibold
                text-slate-700
              "
            >
              {banners.length}{" "}
              {banners.length === 1
                ? "banner"
                : "banners"}
            </span>

          </div>

          {/* CARREGANDO */}

          {loading && (
            <div
              className="
                rounded-2xl
                bg-white
                p-10
                text-center
                shadow
              "
            >
              <div
                className="
                  mx-auto
                  mb-3
                  h-8
                  w-8
                  animate-spin
                  rounded-full
                  border-4
                  border-slate-200
                  border-t-emerald-500
                "
              />

              <p
                className="
                  text-sm
                  text-slate-500
                "
              >
                Carregando banners...
              </p>
            </div>
          )}

          {/* SEM BANNERS */}

          {!loading &&
            banners.length === 0 && (
              <div
                className="
                  rounded-2xl
                  border
                  border-dashed
                  border-slate-300
                  bg-white
                  p-10
                  text-center
                  shadow
                "
              >

                <p
                  className="
                    font-semibold
                    text-slate-700
                  "
                >
                  Nenhum banner cadastrado.
                </p>

                <p
                  className="
                    mt-2
                    text-sm
                    text-slate-500
                  "
                >
                  Adicione o primeiro banner
                  acima.
                </p>

              </div>
            )}

          {/* LISTA */}

          {!loading &&
            banners.length > 0 && (
              <div className="space-y-5">

                {banners.map(
                  (
                    banner,
                    index
                  ) => (
                    <div
                      key={banner.id}
                      className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                      "
                    >

                      {/* IMAGEM */}

                      <div
                        className="
                          aspect-[3.5/1]
                          w-full
                          overflow-hidden
                          bg-slate-100
                        "
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
                      </div>

                      {/* CONTROLES */}

                      <div
                        className="
                          flex
                          flex-col
                          gap-4
                          p-4
                          md:flex-row
                          md:items-center
                          md:justify-between
                        "
                      >

                        <div
                          className="
                            min-w-0
                          "
                        >

                          <p
                            className="
                              font-bold
                              text-slate-800
                            "
                          >
                            Banner {index + 1}
                          </p>

                          <p
                            className="
                              mt-1
                              text-xs
                              text-slate-500
                            "
                          >
                            Posição:{" "}
                            {banner.position}
                          </p>

                          <p
                            className={`
                              mt-1
                              text-xs
                              font-semibold
                              ${
                                banner.active
                                  ? "text-emerald-600"
                                  : "text-slate-400"
                              }
                            `}
                          >
                            {banner.active
                              ? "Visível na loja"
                              : "Oculto na loja"}
                          </p>

                        </div>

                        <div
                          className="
                            flex
                            flex-wrap
                            gap-2
                          "
                        >

                          {/* ATIVAR / DESATIVAR */}

                          <button
                            type="button"
                            onClick={() =>
                              toggleBanner(
                                banner
                              )
                            }
                            className={`
                              rounded-lg
                              px-4
                              py-2
                              text-sm
                              font-semibold
                              ${
                                banner.active
                                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }
                            `}
                          >
                            {banner.active
                              ? "Ativo"
                              : "Inativo"}
                          </button>

                          {/* APAGAR */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                banner
                              )
                            }
                            className="
                              rounded-lg
                              bg-red-100
                              px-4
                              py-2
                              text-sm
                              font-semibold
                              text-red-700
                              hover:bg-red-200
                            "
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

      </div>
    </div>
  )
}