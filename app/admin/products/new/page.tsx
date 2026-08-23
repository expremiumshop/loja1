"use client"

import Link from "next/link"
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react"
import {
  ImagePlus,
  Upload,
  X,
  Trash2,
  Plus,
  Star,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

type Category = {
  id: string
  name: string
}

type NewImage = {
  id: string
  file: File
  preview: string
}

type ProductOption = {
  name: string
  values: string[]
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error
  ) {
    return String(
      (error as { message?: unknown }).message ||
        "Ocorreu um erro."
    )
  }

  return "Ocorreu um erro."
}

export default function NewProductPage() {
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
  const [featured, setFeatured] = useState(false)

  const [newImages, setNewImages] = useState<NewImage[]>([])
  const [mainImageId, setMainImageId] = useState<string | null>(
    null
  )

  const [productOptions, setProductOptions] = useState<
    ProductOption[]
  >([])

  const [loadingCategories, setLoadingCategories] = useState(true)
  const [saving, setSaving] = useState(false)

  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  /*
   * =====================================================
   * CARREGAR CATEGORIAS
   * =====================================================
   */

  useEffect(() => {
    async function loadCategories() {
      setLoadingCategories(true)

      const result = await supabase
        .from("categories")
        .select("id, name")
        .order("name", {
          ascending: true,
        })

      if (result.error) {
        setError(
          "Erro ao carregar categorias: " +
            result.error.message
        )
        setLoadingCategories(false)
        return
      }

      setCategories(result.data || [])
      setLoadingCategories(false)
    }

    loadCategories()
  }, [])

  /*
   * =====================================================
   * LIMPAR URLS DAS IMAGENS
   * =====================================================
   */

  useEffect(() => {
    return () => {
      newImages.forEach((image) => {
        URL.revokeObjectURL(image.preview)
      })
    }
  }, [newImages])

  /*
   * =====================================================
   * ESCOLHER IMAGENS
   * =====================================================
   */

  function chooseImages(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files || [])

    if (files.length === 0) {
      return
    }

    setError("")
    setMessage("")

    const validImages: NewImage[] = []

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError(
          "Um dos arquivos selecionados não é uma imagem válida."
        )
        continue
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(
          "Uma das imagens ultrapassa o limite de 5 MB."
        )
        continue
      }

      const preview = URL.createObjectURL(file)

      validImages.push({
        id: crypto.randomUUID(),
        file,
        preview,
      })
    }

    setNewImages((current) => [
      ...current,
      ...validImages,
    ])

    event.target.value = ""
  }

  /*
   * =====================================================
   * REMOVER IMAGEM
   * =====================================================
   */

  function removeNewImage(imageId: string) {
    setNewImages((current) => {
      const image = current.find(
        (item) => item.id === imageId
      )

      if (image) {
        URL.revokeObjectURL(image.preview)
      }

      return current.filter(
        (item) => item.id !== imageId
      )
    })

    if (mainImageId === imageId) {
      setMainImageId(null)
    }
  }

  /*
   * =====================================================
   * DEFINIR IMAGEM PRINCIPAL
   * =====================================================
   */

  function setAsMainImage(imageId: string) {
    setMainImageId(imageId)
  }

  /*
   * =====================================================
   * ADICIONAR VARIANTE
   * =====================================================
   */

  function addOption() {
    setProductOptions((current) => [
      ...current,
      {
        name: "",
        values: [""],
      },
    ])
  }

  /*
   * =====================================================
   * REMOVER VARIANTE
   * =====================================================
   */

  function removeOption(index: number) {
    setProductOptions((current) =>
      current.filter(
        (_, optionIndex) => optionIndex !== index
      )
    )
  }

  /*
   * =====================================================
   * ALTERAR NOME DA VARIANTE
   * =====================================================
   */

  function updateOptionName(
    index: number,
    value: string
  ) {
    setProductOptions((current) =>
      current.map((option, optionIndex) => {
        if (optionIndex !== index) {
          return option
        }

        return {
          ...option,
          name: value,
        }
      })
    )
  }

  /*
   * =====================================================
   * ADICIONAR VALOR DA VARIANTE
   * =====================================================
   */

  function addOptionValue(optionIndex: number) {
    setProductOptions((current) =>
      current.map((option, index) => {
        if (index !== optionIndex) {
          return option
        }

        return {
          ...option,
          values: [...option.values, ""],
        }
      })
    )
  }

  /*
   * =====================================================
   * ALTERAR VALOR DA VARIANTE
   * =====================================================
   */

  function updateOptionValue(
    optionIndex: number,
    valueIndex: number,
    value: string
  ) {
    setProductOptions((current) =>
      current.map((option, index) => {
        if (index !== optionIndex) {
          return option
        }

        return {
          ...option,
          values: option.values.map(
            (item, itemIndex) =>
              itemIndex === valueIndex
                ? value
                : item
          ),
        }
      })
    )
  }

  /*
   * =====================================================
   * REMOVER VALOR DA VARIANTE
   * =====================================================
   */

  function removeOptionValue(
    optionIndex: number,
    valueIndex: number
  ) {
    setProductOptions((current) =>
      current.map((option, index) => {
        if (index !== optionIndex) {
          return option
        }

        return {
          ...option,
          values: option.values.filter(
            (_, itemIndex) =>
              itemIndex !== valueIndex
          ),
        }
      })
    )
  }

  /*
   * =====================================================
   * SALVAR PRODUTO
   * =====================================================
   */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")
    setMessage("")
    setSaving(true)

    const numericPrice = Number(price)

    if (!name.trim()) {
      setError("Digite o nome do produto.")
      setSaving(false)
      return
    }

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      setError("Digite um preço válido.")
      setSaving(false)
      return
    }

    if (
      compareAtPrice &&
      Number(compareAtPrice) <= numericPrice
    ) {
      setError(
        "O preço antigo deve ser superior ao preço actual."
      )
      setSaving(false)
      return
    }

    const numericStock =
      Number.parseInt(stock || "0", 10) || 0

    try {
      /*
       * =================================================
       * 1. UPLOAD DAS IMAGENS
       * =================================================
       */

      const uploadedImages: {
        image_url: string
        position: number
        localId: string
      }[] = []

      for (
        let index = 0;
        index < newImages.length;
        index++
      ) {
        const item = newImages[index]

        const safeFileName =
          item.file.name.replace(
            /[^a-zA-Z0-9._-]/g,
            "-"
          )

        const fileName =
          crypto.randomUUID() +
          "-" +
          safeFileName

        const uploadResult =
          await supabase.storage
            .from("products")
            .upload(
              fileName,
              item.file,
              {
                upsert: false,
                contentType: item.file.type,
              }
            )

        if (uploadResult.error) {
          throw new Error(
            "Não foi possível enviar a imagem: " +
              uploadResult.error.message
          )
        }

        const publicUrlResult =
          supabase.storage
            .from("products")
            .getPublicUrl(fileName)

        uploadedImages.push({
          image_url:
            publicUrlResult.data.publicUrl,
          position: index,
          localId: item.id,
        })
      }

      /*
       * =================================================
       * 2. DEFINIR IMAGEM PRINCIPAL
       * =================================================
       */

      let mainImageUrl: string | null = null

      if (mainImageId) {
        const mainImage = uploadedImages.find(
          (image) =>
            image.localId === mainImageId
        )

        if (mainImage) {
          mainImageUrl = mainImage.image_url
        }
      }

      if (
        !mainImageUrl &&
        uploadedImages.length > 0
      ) {
        mainImageUrl =
          uploadedImages[0].image_url
      }

      /*
       * =================================================
       * 3. CATEGORIA
       * =================================================
       */

      const selectedCategory =
        categories.find(
          (category) =>
            category.id === categoryId
        )

      /*
       * =================================================
       * 4. GERAR SLUG
       * =================================================
       */

      const generatedSlug =
        slugify(name) ||
        `produto-${Date.now()}`

      /*
       * =================================================
       * 5. INSERIR PRODUTO
       * =================================================
       */

      const productResult = await supabase
        .from("products")
        .insert({
          name: name.trim(),

          slug: generatedSlug,

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
            numericStock
          ),

          image: mainImageUrl,

          active:
            status === "active",

          featured,

          updated_at:
            new Date().toISOString(),
        })
        .select("id")
        .single()

      if (productResult.error) {
        throw productResult.error
      }

      const productId =
        productResult.data.id

      /*
       * =================================================
       * 6. GUARDAR IMAGENS NA TABELA
       * =================================================
       */

      if (uploadedImages.length > 0) {
        const orderedImages = [
          ...uploadedImages,
        ]

        if (mainImageId) {
          orderedImages.sort(
            (a, b) => {
              if (
                a.localId ===
                mainImageId
              ) {
                return -1
              }

              if (
                b.localId ===
                mainImageId
              ) {
                return 1
              }

              return (
                a.position -
                b.position
              )
            }
          )
        }

        const imageRows =
          orderedImages.map(
            (image, index) => ({
              product_id: productId,

              image_url:
                image.image_url,

              position: index,
            })
          )

        const imagesResult =
          await supabase
            .from("product_images")
            .insert(imageRows)

        if (imagesResult.error) {
          throw imagesResult.error
        }
      }

      /*
       * =================================================
       * 7. GUARDAR VARIANTES
       * =================================================
       */

      const cleanedOptions =
        productOptions
          .map((option) => ({
            name: option.name.trim(),

            values:
              option.values
                .map((value) =>
                  value.trim()
                )
                .filter(Boolean),
          }))
          .filter(
            (option) =>
              option.name.length > 0 &&
              option.values.length > 0
          )

      if (cleanedOptions.length > 0) {
        const optionRows =
          cleanedOptions.map(
            (option, index) => ({
              product_id: productId,

              name: option.name,

              values: option.values,

              position: index,
            })
          )

        const optionsResult =
          await supabase
            .from("product_options")
            .insert(optionRows)

        if (optionsResult.error) {
          throw optionsResult.error
        }
      }

      /*
       * =================================================
       * 8. FINALIZAR
       * =================================================
       */

      setMessage(
        "Produto criado com sucesso."
      )

      setTimeout(() => {
        window.location.href =
          "/admin/products"
      }, 1000)
    } catch (submitError) {
      setError(
        "Erro ao criar produto: " +
          getErrorMessage(
            submitError
          )
      )
    } finally {
      setSaving(false)
    }
  }

  /*
   * =====================================================
   * INTERFACE
   * =====================================================
   */

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* CABEÇALHO */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/admin/products"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Voltar para produtos
            </Link>

            <h1 className="mt-3 text-3xl font-bold">
              Novo Produto
            </h1>

            <p className="mt-2 text-gray-700">
              Adicione um novo produto à sua loja.
            </p>
          </div>
        </div>

        {/* MENSAGEM */}

        {message && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-100 p-4 font-semibold text-green-700">
            {message}
          </div>
        )}

        {/* ERRO */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-100 p-4 font-semibold text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-3"
        >

          {/* =================================================
              COLUNA PRINCIPAL
          ================================================= */}

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
                  placeholder="Ex: Smartphone Samsung Galaxy"
                  className="mt-2 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
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
                  rows={7}
                  placeholder="Descrição do produto"
                  className="mt-2 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </label>

              <div className="mt-5 rounded-lg bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-700">
                  Slug do produto
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {slugify(name) ||
                    "o-slug-sera-gerado-automaticamente"}
                </p>
              </div>
            </section>

            {/* GALERIA */}

            <section className="rounded-xl bg-white p-6 shadow">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-bold">
                    Imagens do Produto
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Adicione várias imagens.
                    Escolha uma como imagem principal.
                  </p>
                </div>

                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
                  <ImagePlus size={20} />

                  Adicionar imagens

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={chooseImages}
                    className="hidden"
                  />
                </label>
              </div>

              {newImages.length === 0 && (
                <div className="rounded-xl border-2 border-dashed bg-gray-50 p-10 text-center">
                  <ImagePlus
                    size={50}
                    className="mx-auto mb-4 text-gray-400"
                  />

                  <p className="font-semibold text-gray-600">
                    Nenhuma imagem adicionada
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Você pode selecionar várias imagens ao mesmo tempo.
                  </p>
                </div>
              )}

              {newImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {newImages.map(
                    (image) => (
                      <div
                        key={image.id}
                        className="group relative overflow-hidden rounded-xl border bg-gray-50"
                      >
                        <img
                          src={image.preview}
                          alt={
                            name ||
                            "Imagem do produto"
                          }
                          className="aspect-square w-full object-cover"
                        />

                        {mainImageId ===
                          image.id && (
                          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-blue-600 px-2 py-1 text-xs font-bold text-white">
                            <Star
                              size={12}
                              fill="currentColor"
                            />

                            Principal
                          </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-black/60 p-2 opacity-0 transition group-hover:opacity-100">
                          {mainImageId !==
                            image.id && (
                            <button
                              type="button"
                              onClick={() =>
                                setAsMainImage(
                                  image.id
                                )
                              }
                              className="flex-1 rounded-lg bg-white px-2 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-100"
                            >
                              Principal
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              removeNewImage(
                                image.id
                              )
                            }
                            className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
                            aria-label="Remover imagem"
                          >
                            <Trash2
                              size={16}
                            />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <Upload
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="font-semibold">
                      Upload de imagens
                    </p>

                    <p className="mt-1">
                      JPG, PNG ou WebP.
                      Cada imagem pode ter até 5 MB.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* PREÇO */}

            <section className="rounded-xl bg-white p-6 shadow">
              <h2 className="mb-6 text-xl font-bold">
                Preço
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="font-semibold">
                  Preço actual (MZN)

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
                    placeholder="Ex: 15000"
                    className="mt-2 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                  />
                </label>

                <label className="font-semibold">
                  Preço antigo

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
                    placeholder="Ex: 18000"
                    className="mt-2 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                  />

                  <span className="mt-1 block text-xs font-normal text-gray-500">
                    Deve ser superior ao preço actual.
                  </span>
                </label>
              </div>
            </section>

            {/* VARIANTES */}

            <section className="rounded-xl bg-white p-6 shadow">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">
                    Variantes do Produto
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Adicione opções como cor, tamanho,
                    capacidade, etc.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addOption}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 font-semibold text-white hover:bg-gray-800"
                >
                  <Plus size={18} />

                  Adicionar
                </button>
              </div>

              {productOptions.length ===
                0 && (
                <div className="rounded-lg border border-dashed p-6 text-center text-gray-500">
                  Nenhuma variante adicionada.
                </div>
              )}

              <div className="space-y-5">
                {productOptions.map(
                  (
                    option,
                    optionIndex
                  ) => (
                    <div
                      key={
                        "option-" +
                        optionIndex
                      }
                      className="rounded-xl border bg-gray-50 p-5"
                    >
                      <div className="mb-4 flex gap-3">
                        <input
                          value={
                            option.name
                          }
                          onChange={(
                            event
                          ) =>
                            updateOptionName(
                              optionIndex,
                              event
                                .target
                                .value
                            )
                          }
                          placeholder="Nome da opção: Cor"
                          className="flex-1 rounded-lg border bg-white p-3 outline-none focus:border-blue-500"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeOption(
                              optionIndex
                            )
                          }
                          className="rounded-lg bg-red-100 p-3 text-red-600 hover:bg-red-200"
                        >
                          <Trash2
                            size={18}
                          />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {option.values.map(
                          (
                            value,
                            valueIndex
                          ) => (
                            <div
                              key={
                                "value-" +
                                optionIndex +
                                "-" +
                                valueIndex
                              }
                              className="flex gap-3"
                            >
                              <input
                                value={value}
                                onChange={(
                                  event
                                ) =>
                                  updateOptionValue(
                                    optionIndex,
                                    valueIndex,
                                    event
                                      .target
                                      .value
                                  )
                                }
                                placeholder="Valor: Preto"
                                className="flex-1 rounded-lg border bg-white p-3 outline-none focus:border-blue-500"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  removeOptionValue(
                                    optionIndex,
                                    valueIndex
                                  )
                                }
                                className="rounded-lg border bg-white px-3 text-red-600 hover:bg-red-50"
                              >
                                <X
                                  size={18}
                                />
                              </button>
                            </div>
                          )
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          addOptionValue(
                            optionIndex
                          )
                        }
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
                      >
                        <Plus size={16} />

                        Adicionar valor
                      </button>
                    </div>
                  )
                )}
              </div>
            </section>
          </div>

          {/* =================================================
              COLUNA LATERAL
          ================================================= */}

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
                  disabled={
                    loadingCategories
                  }
                  className="mt-2 w-full rounded-lg border bg-white p-3 outline-none focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">
                    {loadingCategories
                      ? "Carregando..."
                      : "Sem categoria"}
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={
                          category.id
                        }
                        value={
                          category.id
                        }
                      >
                        {
                          category.name
                        }
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
                  placeholder="Ex: Samsung"
                  className="mt-2 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
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
                  placeholder="SKU do produto"
                  className="mt-2 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />
              </label>

              <label className="mt-5 block font-semibold">
                Quantidade em estoque

                <input
                  min="0"
                  type="number"
                  value={stock}
                  onChange={(event) =>
                    setStock(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
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
                className="w-full rounded-lg border bg-white p-3 outline-none focus:border-blue-500"
              >
                <option value="active">
                  Ativo
                </option>

                <option value="draft">
                  Rascunho
                </option>
              </select>
            </section>

            {/* VISIBILIDADE */}

            <section className="rounded-xl bg-white p-6 shadow">
              <h2 className="mb-5 text-xl font-bold">
                Visibilidade
              </h2>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(event) =>
                    setFeatured(
                      event.target.checked
                    )
                  }
                  className="mt-1 h-5 w-5"
                />

                <div>
                  <p className="font-semibold">
                    Produto em destaque
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Mostrar este produto nas áreas
                    de destaque da loja.
                  </p>
                </div>
              </label>
            </section>

            {/* AÇÕES */}

            <section className="rounded-xl bg-white p-6 shadow">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-blue-600 px-8 py-4 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "A guardar produto..."
                  : "Guardar Produto"}
              </button>

              <Link
                href="/admin/products"
                className="mt-3 block w-full rounded-xl border border-gray-300 bg-white px-8 py-4 text-center font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Link>
            </section>
          </aside>
        </form>
      </div>
    </main>
  )
}