"use client"

import Link from "next/link"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ImagePlus, Upload, X } from "lucide-react"

import { supabase } from "@/lib/supabase"

import ProductVariantsAdmin, {
  ProductOptionInput,
} from "@/components/admin/ProductVariantsAdmin"

type Category = {
  id: string
  name: string
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function errorMessage(error: unknown) {
  if (error && typeof error === "object") {
    const details = error as {
      message?: string
      details?: string
      hint?: string
      code?: string
    }

    return [
      details.message,
      details.details,
      details.hint,
      details.code,
    ]
      .filter(Boolean)
      .join(" — ")
  }

  return error instanceof Error
    ? error.message
    : "Não foi possível criar o produto."
}

export default function NewProductPage() {
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [compareAtPrice, setCompareAtPrice] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [brand, setBrand] = useState("")
  const [sku, setSku] = useState("")
  const [stock, setStock] = useState("0")
  const [status, setStatus] = useState("active")

  // MÚLTIPLAS IMAGENS
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [mainImageIndex, setMainImageIndex] = useState(0)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  // VARIAÇÕES
  const [productOptions, setProductOptions] = useState<
    ProductOptionInput[]
  >([])

  // ============================================================
  // CARREGAR CATEGORIAS
  // ============================================================

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name")

      if (error) {
        setMessage(
          `Erro ao carregar categorias: ${error.message}`
        )
        return
      }

      setCategories(data ?? [])
    }

    loadCategories()
  }, [])

  // ============================================================
  // LIMPAR URLS DAS PRÉ-VISUALIZAÇÕES
  // ============================================================

  useEffect(() => {
    return () => {
      previews.forEach((url) => {
        URL.revokeObjectURL(url)
      })
    }
  }, [previews])

  // ============================================================
  // ADICIONAR VÁRIAS IMAGENS
  // ============================================================

  function chooseImages(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles = Array.from(
      event.target.files || []
    )

    if (selectedFiles.length === 0) {
      return
    }

    const validFiles: File[] = []

    for (const file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        setMessage(
          `Erro: "${file.name}" não é uma imagem válida.`
        )
        continue
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage(
          `Erro: "${file.name}" ultrapassa o limite de 5 MB.`
        )
        continue
      }

      validFiles.push(file)
    }

    if (validFiles.length === 0) {
      event.target.value = ""
      return
    }

    const newPreviews = validFiles.map((file) =>
      URL.createObjectURL(file)
    )

    setImages((current) => [
      ...current,
      ...validFiles,
    ])

    setPreviews((current) => [
      ...current,
      ...newPreviews,
    ])

    setMessage("")

    // Permite selecionar novamente o mesmo arquivo
    event.target.value = ""
  }

  // ============================================================
  // REMOVER IMAGEM
  // ============================================================

  function removeImage(index: number) {
    const previewToRemove = previews[index]

    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove)
    }

    setImages((current) =>
      current.filter(
        (_, imageIndex) => imageIndex !== index
      )
    )

    setPreviews((current) =>
      current.filter(
        (_, imageIndex) => imageIndex !== index
      )
    )

    setMainImageIndex((current) => {
      if (images.length <= 1) {
        return 0
      }

      if (index < current) {
        return current - 1
      }

      if (index === current) {
        return Math.max(0, current - 1)
      }

      return current
    })
  }

  // ============================================================
  // DEFINIR IMAGEM PRINCIPAL
  // ============================================================

  function selectMainImage(index: number) {
    setMainImageIndex(index)
  }

  // ============================================================
  // PUBLICAR PRODUTO
  // ============================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const numericPrice = Number(price)

    // ----------------------------------------------------------
    // VALIDAÇÕES
    // ----------------------------------------------------------

    if (!name.trim()) {
      setMessage("Erro: digite o nome do produto.")
      return
    }

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      setMessage("Erro: digite um preço válido.")
      return
    }

    if (
      compareAtPrice &&
      Number(compareAtPrice) <= numericPrice
    ) {
      setMessage(
        "Erro: o preço antigo deve ser superior ao preço actual."
      )
      return
    }

    if (images.length === 0) {
      setMessage(
        "Erro: adicione pelo menos uma imagem."
      )
      return
    }

    setLoading(true)
    setMessage("")

    try {
      // ========================================================
      // 1. UPLOAD DE TODAS AS IMAGENS
      // ========================================================

      const uploadedImages: string[] = []

      for (const image of images) {
        const safeFileName = image.name.replace(
          /[^a-zA-Z0-9._-]/g,
          "-"
        )

        const fileName = `${crypto.randomUUID()}-${safeFileName}`

        const { error: uploadError } =
          await supabase.storage
            .from("products")
            .upload(fileName, image, {
              upsert: false,
            })

        if (uploadError) {
          throw new Error(
            `Não foi possível enviar a imagem "${image.name}": ${uploadError.message}`
          )
        }

        const { data: publicUrlData } =
          supabase.storage
            .from("products")
            .getPublicUrl(fileName)

        const publicUrl =
          publicUrlData.publicUrl

        if (!publicUrl) {
          throw new Error(
            `Não foi possível obter a URL da imagem "${image.name}".`
          )
        }

        uploadedImages.push(publicUrl)
      }

      // ========================================================
      // 2. IMAGEM PRINCIPAL
      // ========================================================

      const mainImage =
        uploadedImages[mainImageIndex] ||
        uploadedImages[0] ||
        null

      // ========================================================
      // 3. CATEGORIA
      // ========================================================

      const selectedCategory = categories.find(
        (item) => item.id === categoryId
      )

      const baseSlug =
        slugify(name) || "produto"

      // ========================================================
      // 4. CRIAR PRODUTO
      // ========================================================

      const { data: product, error } =
        await supabase
          .from("products")
          .insert({
            name: name.trim(),

            slug: `${baseSlug}-${crypto
              .randomUUID()
              .slice(0, 8)}`,

            description:
              description.trim() || null,

            price: numericPrice,

            compare_at_price:
              compareAtPrice
                ? Number(compareAtPrice)
                : null,

            category_id:
              categoryId || null,

            category:
              selectedCategory?.name || null,

            brand:
              brand.trim() || null,

            sku:
              sku.trim() || null,

            stock: Math.max(
              0,
              Number.parseInt(
                stock || "0",
                10
              ) || 0
            ),

            // IMAGEM PRINCIPAL
            image: mainImage,

            active:
              status === "active",

            featured: false,
          })
          .select("id")
          .single()

      if (error) {
        throw error
      }

      if (!product) {
        throw new Error(
          "O produto foi criado, mas não foi possível obter o ID."
        )
      }

      // ========================================================
      // 5. SALVAR TODAS AS IMAGENS
      // ========================================================

      const imageRows =
        uploadedImages.map(
          (imageUrl, index) => ({
            product_id: product.id,
            image_url: imageUrl,

            // posição da imagem
            position: index,
          })
        )

      if (imageRows.length > 0) {
        const { error: imagesError } =
          await supabase
            .from("product_images")
            .insert(imageRows)

        if (imagesError) {
          throw new Error(
            `Produto criado, mas ocorreu um erro ao salvar as imagens: ${imagesError.message}`
          )
        }
      }

      // ========================================================
      // 6. SALVAR VARIAÇÕES
      // ========================================================
      //
      // IMPORTANTE:
      // A tabela product_options possui:
      //
      // id
      // product_id
      // name
      // values
      // created_at
      // position
      //
      // Por isso enviamos position aqui.
      // ========================================================

      const optionRows = productOptions
        .map((option, index) => {
          const cleanName =
            option.name.trim()

          const cleanValues =
            option.values
              .map((value) => value.trim())
              .filter(Boolean)

          return {
            product_id: product.id,

            name: cleanName,

            values: cleanValues,

            // POSIÇÃO DA OPÇÃO
            position: index,
          }
        })
        .filter(
          (option) =>
            option.name.length > 0 &&
            option.values.length > 0
        )

      if (optionRows.length > 0) {
        const {
          error: optionsError,
        } = await supabase
          .from("product_options")
          .insert(optionRows)

        if (optionsError) {
          throw new Error(
            `Produto criado, mas ocorreu um erro ao salvar as variações: ${optionsError.message}`
          )
        }
      }

      // ========================================================
      // 7. SUCESSO
      // ========================================================

      setMessage(
        `Produto criado com sucesso com ${uploadedImages.length} imagem${
          uploadedImages.length > 1
            ? "ns"
            : ""
        }.`
      )

      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      console.error(
        "Erro ao criar produto:",
        error
      )

      setMessage(
        `Erro: ${errorMessage(error)}`
      )
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // INTERFACE
  // ============================================================

  return (
    <main className="min-h-screen bg-gray-200 p-4 text-gray-900 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Adicionar Produto
            </h1>

            <p className="mt-2 text-gray-700">
              Criar novo produto para a loja
            </p>
          </div>

          <Link
            href="/admin/products"
            className="rounded-lg border bg-white px-5 py-3 text-center font-semibold hover:bg-gray-100"
          >
            Voltar
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-3"
        >

          {/* ================================================== */}
          {/* LADO ESQUERDO */}
          {/* ================================================== */}

          <div className="space-y-8 lg:col-span-2">

            {/* INFORMAÇÕES */}

            <section className="rounded-xl bg-white p-6 shadow">

              <h2 className="mb-6 text-xl font-bold">
                Informações do Produto
              </h2>

              <label className="font-semibold">
                Nome do produto

                <input
                  required
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="Ex: Smartphone Samsung"
                  className="mt-2 w-full rounded-lg border p-3"
                />
              </label>

              <label className="mt-5 block font-semibold">
                Descrição

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  rows={6}
                  placeholder="Descrição do produto"
                  className="mt-2 w-full rounded-lg border p-3"
                />
              </label>

            </section>

            {/* ================================================== */}
            {/* IMAGENS */}
            {/* ================================================== */}

            <section className="rounded-xl bg-white p-6 shadow">

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold">
                    Imagens do Produto
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Adicione quantas imagens quiser.
                  </p>
                </div>

                <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                  {images.length}{" "}
                  {images.length === 1
                    ? "imagem"
                    : "imagens"}
                </div>

              </div>

              {/* UPLOAD */}

              <div className="rounded-xl border-2 border-dashed bg-gray-50 p-8 text-center">

                <ImagePlus
                  size={48}
                  className="mx-auto mb-4"
                />

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">

                  <Upload size={20} />

                  Adicionar imagens

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={chooseImages}
                    className="hidden"
                  />

                </label>

                <p className="mt-3 text-sm text-gray-500">
                  JPG, PNG ou WebP até 5 MB por imagem.
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Pode selecionar várias imagens ao mesmo tempo.
                </p>

              </div>

              {/* GALERIA */}

              {previews.length > 0 && (
                <div className="mt-6">

                  <div className="mb-4 flex items-center justify-between">

                    <h3 className="font-semibold">
                      Galeria do produto
                    </h3>

                    <span className="text-sm text-gray-500">
                      Clique numa imagem para defini-la como principal
                    </span>

                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">

                    {previews.map(
                      (preview, index) => (
                        <div
                          key={`${preview}-${index}`}
                          className={`relative overflow-hidden rounded-xl border-2 bg-white ${
                            mainImageIndex === index
                              ? "border-blue-600 ring-2 ring-blue-200"
                              : "border-gray-200"
                          }`}
                        >

                          <button
                            type="button"
                            onClick={() =>
                              selectMainImage(
                                index
                              )
                            }
                            className="block w-full"
                          >
                            <img
                              src={preview}
                              alt={`Imagem ${
                                index + 1
                              }`}
                              className="h-40 w-full object-cover"
                            />
                          </button>

                          {/* PRINCIPAL */}

                          {mainImageIndex ===
                            index && (
                            <div className="absolute left-2 top-2 rounded-md bg-blue-600 px-2 py-1 text-xs font-bold text-white">
                              Principal
                            </div>
                          )}

                          {/* REMOVER */}

                          <button
                            type="button"
                            onClick={() =>
                              removeImage(
                                index
                              )
                            }
                            className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-white shadow transition hover:bg-red-700"
                            aria-label={`Remover imagem ${
                              index + 1
                            }`}
                          >
                            <X size={16} />
                          </button>

                          <div className="p-2 text-center text-xs text-gray-500">
                            Imagem{" "}
                            {index + 1}
                          </div>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

            </section>

            {/* ================================================== */}
            {/* PREÇO */}
            {/* ================================================== */}

            <section className="rounded-xl bg-white p-6 shadow">

              <h2 className="mb-5 text-xl font-bold">
                Preço
              </h2>

              <div className="grid gap-5 md:grid-cols-2">

                <label className="font-semibold">
                  Preço actual

                  <input
                    required
                    min="0.01"
                    step="0.01"
                    type="number"
                    value={price}
                    onChange={(event) =>
                      setPrice(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-lg border p-3"
                  />
                </label>

                <label className="font-semibold">
                  Preço antigo (opcional)

                  <input
                    min="0"
                    step="0.01"
                    type="number"
                    value={compareAtPrice}
                    onChange={(event) =>
                      setCompareAtPrice(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-lg border p-3"
                  />
                </label>

              </div>

            </section>

            {/* ================================================== */}
            {/* VARIAÇÕES */}
            {/* ================================================== */}

            <ProductVariantsAdmin
              options={productOptions}
              onChange={setProductOptions}
            />

          </div>

          {/* ================================================== */}
          {/* LADO DIREITO */}
          {/* ================================================== */}

          <aside className="space-y-8">

            {/* ORGANIZAÇÃO */}

            <section className="rounded-xl bg-white p-6 shadow">

              <h2 className="mb-5 text-xl font-bold">
                Organização
              </h2>

              <label className="font-semibold">
                Categoria

                <select
                  value={categoryId}
                  onChange={(event) =>
                    setCategoryId(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-lg border p-3"
                >

                  <option value="">
                    Sem categoria
                  </option>

                  {categories.map(
                    (item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                      </option>
                    )
                  )}

                </select>
              </label>

              <label className="mt-5 block font-semibold">
                Marca

                <input
                  value={brand}
                  onChange={(event) =>
                    setBrand(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-lg border p-3"
                />
              </label>

            </section>

            {/* INVENTÁRIO */}

            <section className="rounded-xl bg-white p-6 shadow">

              <h2 className="mb-5 text-xl font-bold">
                Inventário
              </h2>

              <label className="font-semibold">
                SKU

                <input
                  value={sku}
                  onChange={(event) =>
                    setSku(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-lg border p-3"
                />
              </label>

              <label className="mt-5 block font-semibold">
                Quantidade

                <input
                  min="0"
                  type="number"
                  value={stock}
                  onChange={(event) =>
                    setStock(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-lg border p-3"
                />
              </label>

            </section>

            {/* ESTADO */}

            <section className="rounded-xl bg-white p-6 shadow">

              <h2 className="mb-5 text-xl font-bold">
                Estado
              </h2>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border p-3"
              >

                <option value="active">
                  Ativo
                </option>

                <option value="draft">
                  Rascunho
                </option>

              </select>

            </section>

            {/* MENSAGEM */}

            {message && (
              <div
                className={`rounded-lg p-4 font-semibold ${
                  message.startsWith("Erro")
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {message}
              </div>
            )}

            {/* PUBLICAR */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-8 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? `A publicar ${images.length} imagem${
                    images.length > 1
                      ? "ns"
                      : ""
                  }...`
                : "Publicar Produto"}
            </button>

          </aside>

        </form>

      </div>
    </main>
  )
}