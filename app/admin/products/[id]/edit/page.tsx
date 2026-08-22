"use client"

import Link from "next/link"
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ImagePlus,
  Upload,
  X,
  Trash2,
  Plus,
  Star,
  GripVertical,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

type Category = {
  id: string
  name: string
}

type ProductOption = {
  id?: string
  name: string
  values: string[]
}

type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_at_price: number | null
  category_id: string | null
  category: string | null
  brand: string | null
  sku: string | null
  stock: number
  image: string | null
  active: boolean
  featured: boolean
}

type ProductImage = {
  id: string
  product_id: string
  image_url: string
  position: number
}

type NewImage = {
  id: string
  file: File
  preview: string
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function getErrorMessage(error: unknown): string {
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

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()

  const rawId = params.id

  const productId =
    typeof rawId === "string"
      ? rawId
      : Array.isArray(rawId)
        ? rawId[0]
        : ""

  const [categories, setCategories] = useState<Category[]>([])
  const [product, setProduct] = useState<Product | null>(null)

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

  const [productImages, setProductImages] = useState<
    ProductImage[]
  >([])

  const [newImages, setNewImages] = useState<NewImage[]>([])

  const [mainImageId, setMainImageId] = useState<string | null>(
    null
  )

  const [productOptions, setProductOptions] =
    useState<ProductOption[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  /*
   * =====================================================
   * CARREGAR CATEGORIAS
   * =====================================================
   */

  useEffect(() => {
    async function loadCategories() {
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
        return
      }

      setCategories(result.data || [])
    }

    loadCategories()
  }, [])

  /*
   * =====================================================
   * CARREGAR PRODUTO
   * =====================================================
   */

  useEffect(() => {
    async function loadProduct() {
      if (!productId) {
        setError("ID do produto não encontrado.")
        setLoading(false)
        return
      }

      setLoading(true)
      setError("")

      const productResult = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single()

      if (productResult.error) {
        setError(
          "Erro ao carregar produto: " +
            productResult.error.message
        )
        setLoading(false)
        return
      }

      if (!productResult.data) {
        setError("Produto não encontrado.")
        setLoading(false)
        return
      }

      const data = productResult.data as Product

      setProduct(data)

      setName(data.name || "")
      setDescription(data.description || "")

      setPrice(
        data.price !== null &&
          data.price !== undefined
          ? String(data.price)
          : ""
      )

      setCompareAtPrice(
        data.compare_at_price !== null &&
          data.compare_at_price !== undefined
          ? String(data.compare_at_price)
          : ""
      )

      setCategoryId(data.category_id || "")
      setBrand(data.brand || "")
      setSku(data.sku || "")

      setStock(
        data.stock !== null &&
          data.stock !== undefined
          ? String(data.stock)
          : "0"
      )

      setFeatured(Boolean(data.featured))

      setStatus(
        data.active
          ? "active"
          : "draft"
      )

      /*
       * =================================================
       * CARREGAR IMAGENS
       * =================================================
       */

      const imagesResult = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", productId)
        .order("position", {
          ascending: true,
        })

      if (
        !imagesResult.error &&
        imagesResult.data
      ) {
        const images =
          imagesResult.data as ProductImage[]

        setProductImages(images)

        if (images.length > 0) {
          setMainImageId(images[0].id)
        }
      } else {
        /*
         * Se não existirem imagens na tabela
         * product_images, usamos a imagem antiga
         * da tabela products como fallback.
         */

        if (data.image) {
          setProductImages([
            {
              id: "legacy-main-image",
              product_id: productId,
              image_url: data.image,
              position: 0,
            },
          ])

          setMainImageId(
            "legacy-main-image"
          )
        }
      }

      /*
       * =================================================
       * CARREGAR VARIANTES
       * =================================================
       */

      const optionsResult = await supabase
        .from("product_options")
        .select("*")
        .eq("product_id", productId)
        .order("position", {
          ascending: true,
        })

      if (
        !optionsResult.error &&
        optionsResult.data
      ) {
        const formattedOptions =
          optionsResult.data.map(
            (option: any) => ({
              id: option.id,
              name: option.name || "",
              values: Array.isArray(
                option.values
              )
                ? option.values
                : option.value
                  ? [option.value]
                  : [],
            })
          )

        setProductOptions(
          formattedOptions
        )
      }

      setLoading(false)
    }

    loadProduct()
  }, [productId])

  /*
   * =====================================================
   * LIMPAR URLS DAS NOVAS IMAGENS
   * =====================================================
   */

  useEffect(() => {
    return () => {
      newImages.forEach((item) => {
        URL.revokeObjectURL(
          item.preview
        )
      })
    }
  }, [newImages])

  /*
   * =====================================================
   * ESCOLHER VÁRIAS IMAGENS
   * =====================================================
   */

  function chooseImages(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files || []
    )

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

      if (
        file.size >
        5 * 1024 * 1024
      ) {
        setError(
          "Uma das imagens ultrapassa o limite de 5 MB."
        )
        continue
      }

      const preview =
        URL.createObjectURL(file)

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
   * REMOVER NOVA IMAGEM
   * =====================================================
   */

  function removeNewImage(
    imageId: string
  ) {
    setNewImages((current) => {
      const image = current.find(
        (item) => item.id === imageId
      )

      if (image) {
        URL.revokeObjectURL(
          image.preview
        )
      }

      return current.filter(
        (item) =>
          item.id !== imageId
      )
    })
  }

  /*
   * =====================================================
   * REMOVER IMAGEM EXISTENTE
   * =====================================================
   */

  function removeExistingImage(
    imageId: string
  ) {
    setProductImages((current) =>
      current.filter(
        (image) =>
          image.id !== imageId
      )
    )

    if (mainImageId === imageId) {
      setMainImageId(null)
    }
  }

  /*
   * =====================================================
   * DEFINIR IMAGEM PRINCIPAL
   * =====================================================
   */

  function setAsMainImage(
    imageId: string
  ) {
    setMainImageId(imageId)
  }

  /*
   * =====================================================
   * VARIANTES
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

  function removeOption(
    index: number
  ) {
    setProductOptions((current) =>
      current.filter(
        (_, optionIndex) =>
          optionIndex !== index
      )
    )
  }

  function updateOptionName(
    index: number,
    value: string
  ) {
    setProductOptions((current) =>
      current.map(
        (option, optionIndex) => {
          if (
            optionIndex !== index
          ) {
            return option
          }

          return {
            ...option,
            name: value,
          }
        }
      )
    )
  }

  function addOptionValue(
    optionIndex: number
  ) {
    setProductOptions((current) =>
      current.map(
        (option, index) => {
          if (
            index !== optionIndex
          ) {
            return option
          }

          return {
            ...option,
            values: [
              ...option.values,
              "",
            ],
          }
        }
      )
    )
  }

  function updateOptionValue(
    optionIndex: number,
    valueIndex: number,
    value: string
  ) {
    setProductOptions((current) =>
      current.map(
        (option, index) => {
          if (
            index !== optionIndex
          ) {
            return option
          }

          return {
            ...option,
            values:
              option.values.map(
                (
                  item,
                  itemIndex
                ) =>
                  itemIndex ===
                  valueIndex
                    ? value
                    : item
              ),
          }
        }
      )
    )
  }

  function removeOptionValue(
    optionIndex: number,
    valueIndex: number
  ) {
    setProductOptions((current) =>
      current.map(
        (option, index) => {
          if (
            index !== optionIndex
          ) {
            return option
          }

          return {
            ...option,
            values:
              option.values.filter(
                (
                  _,
                  itemIndex
                ) =>
                  itemIndex !==
                  valueIndex
              ),
          }
        }
      )
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

    const numericPrice =
      Number(price)

    if (!name.trim()) {
      setError(
        "Digite o nome do produto."
      )
      return
    }

    if (
      !Number.isFinite(
        numericPrice
      ) ||
      numericPrice <= 0
    ) {
      setError(
        "Digite um preço válido."
      )
      return
    }

    if (
      compareAtPrice &&
      Number(compareAtPrice) <=
        numericPrice
    ) {
      setError(
        "O preço antigo deve ser superior ao preço actual."
      )
      return
    }

    const numericStock =
      Number.parseInt(
        stock || "0",
        10
      ) || 0

    setSaving(true)

    try {
      /*
       * =================================================
       * 1. FAZER UPLOAD DAS NOVAS IMAGENS
       * =================================================
       */

      const uploadedImages: ProductImage[] =
        []

      for (
        let index = 0;
        index < newImages.length;
        index++
      ) {
        const item =
          newImages[index]

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
                contentType:
                  item.file.type,
              }
            )

        if (
          uploadResult.error
        ) {
          throw new Error(
            "Não foi possível enviar a imagem: " +
              uploadResult.error.message
          )
        }

        const publicUrlResult =
          supabase.storage
            .from("products")
            .getPublicUrl(
              fileName
            )

        uploadedImages.push({
          id: crypto.randomUUID(),
          product_id:
            productId,
          image_url:
            publicUrlResult.data
              .publicUrl,
          position:
            productImages.length +
            index,
        })
      }

      /*
       * =================================================
       * 2. COMBINAR IMAGENS ANTIGAS + NOVAS
       * =================================================
       */

      const allImages = [
        ...productImages,
        ...uploadedImages,
      ]

      /*
       * =================================================
       * 3. DETERMINAR IMAGEM PRINCIPAL
       * =================================================
       */

      let mainImageUrl: string | null =
        null

      if (mainImageId) {
        const mainExistingImage =
          allImages.find(
            (image) =>
              image.id ===
              mainImageId
          )

        if (mainExistingImage) {
          mainImageUrl =
            mainExistingImage.image_url
        }
      }

      if (
        !mainImageUrl &&
        allImages.length > 0
      ) {
        mainImageUrl =
          allImages[0].image_url
      }

      /*
       * =================================================
       * 4. CATEGORIA
       * =================================================
       */

      const selectedCategory =
        categories.find(
          (item) =>
            item.id ===
            categoryId
        )

      /*
       * =================================================
       * 5. SLUG
       * =================================================
       */

      const generatedSlug =
        slugify(name) ||
        product?.slug ||
        "produto"

      let finalSlug =
        generatedSlug

      if (
        product &&
        generatedSlug ===
          product.slug
      ) {
        finalSlug =
          product.slug
      } else {
        finalSlug =
          generatedSlug +
          "-" +
          productId.slice(0, 8)
      }

      /*
       * =================================================
       * 6. ATUALIZAR PRODUTO
       * =================================================
       */

      const updateResult =
        await supabase
          .from("products")
          .update({
            name: name.trim(),

            slug: finalSlug,

            description:
              description.trim() ||
              null,

            price:
              numericPrice,

            compare_at_price:
              compareAtPrice
                ? Number(
                    compareAtPrice
                  )
                : null,

            category_id:
              categoryId || null,

            category:
              selectedCategory?.name ||
              null,

            brand:
              brand.trim() ||
              null,

            sku:
              sku.trim() ||
              null,

            stock: Math.max(
              0,
              numericStock
            ),

            image:
              mainImageUrl,

            active:
              status === "active",

            featured,

            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            productId
          )

      if (updateResult.error) {
        throw updateResult.error
      }

      /*
       * =================================================
       * 7. ATUALIZAR IMAGENS
       * =================================================
       */

      /*
       * Primeiro eliminamos os registros
       * existentes da tabela product_images.
       */

      const deleteImagesResult =
        await supabase
          .from("product_images")
          .delete()
          .eq(
            "product_id",
            productId
          )

      if (
        deleteImagesResult.error
      ) {
        throw deleteImagesResult.error
      }

      /*
       * Reorganizar posições.
       */

      const orderedImages =
        [...allImages]

      if (mainImageUrl) {
        orderedImages.sort(
          (a, b) => {
            if (
              a.image_url ===
              mainImageUrl
            ) {
              return -1
            }

            if (
              b.image_url ===
              mainImageUrl
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

      /*
       * Inserir novamente todas as imagens.
       */

      if (
        orderedImages.length > 0
      ) {
        const imageRows =
          orderedImages.map(
            (
              image,
              index
            ) => ({
              product_id:
                productId,

              image_url:
                image.image_url,

              position:
                index,
            })
          )

        const insertImagesResult =
          await supabase
            .from(
              "product_images"
            )
            .insert(
              imageRows
            )

        if (
          insertImagesResult.error
        ) {
          throw insertImagesResult.error
        }
      }

      /*
       * =================================================
       * 8. ATUALIZAR VARIANTES
       * =================================================
       */

      const cleanedOptions =
        productOptions
          .map(
            (option) => ({
              name:
                option.name.trim(),

              values:
                option.values
                  .map(
                    (value) =>
                      value.trim()
                  )
                  .filter(
                    Boolean
                  ),
            })
          )
          .filter(
            (option) =>
              option.name.length >
                0 &&
              option.values
                .length > 0
          )

      const deleteOptionsResult =
        await supabase
          .from(
            "product_options"
          )
          .delete()
          .eq(
            "product_id",
            productId
          )

      if (
        deleteOptionsResult.error
      ) {
        throw deleteOptionsResult.error
      }

      if (
        cleanedOptions.length >
        0
      ) {
        const optionRows =
          cleanedOptions.map(
            (
              option,
              index
            ) => ({
              product_id:
                productId,

              name:
                option.name,

              values:
                option.values,

              position:
                index,
            })
          )

        const insertOptionsResult =
          await supabase
            .from(
              "product_options"
            )
            .insert(
              optionRows
            )

        if (
          insertOptionsResult.error
        ) {
          throw insertOptionsResult.error
        }
      }

      /*
       * =================================================
       * 9. FINALIZAR
       * =================================================
       */

      setMessage(
        "Produto atualizado com sucesso."
      )

      setNewImages([])

      setTimeout(() => {
        router.push(
          "/admin/products"
        )

        router.refresh()
      }, 1000)
    } catch (submitError) {
      setError(
        "Erro ao atualizar produto: " +
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
   * ELIMINAR PRODUTO
   * =====================================================
   */

  async function handleDelete() {
    const confirmed =
      window.confirm(
        "Tem certeza que deseja eliminar o produto \"" +
          name +
          "\"?\n\nEsta ação não pode ser desfeita."
      )

    if (!confirmed) {
      return
    }

    setDeleting(true)
    setError("")
    setMessage("")

    try {
      /*
       * Eliminar imagens do banco.
       */

      const deleteImagesResult =
        await supabase
          .from("product_images")
          .delete()
          .eq(
            "product_id",
            productId
          )

      if (
        deleteImagesResult.error
      ) {
        throw deleteImagesResult.error
      }

      /*
       * Eliminar variantes.
       */

      const deleteOptionsResult =
        await supabase
          .from(
            "product_options"
          )
          .delete()
          .eq(
            "product_id",
            productId
          )

      if (
        deleteOptionsResult.error
      ) {
        throw deleteOptionsResult.error
      }

      /*
       * Eliminar produto.
       */

      const deleteProductResult =
        await supabase
          .from("products")
          .delete()
          .eq(
            "id",
            productId
          )

      if (
        deleteProductResult.error
      ) {
        throw deleteProductResult.error
      }

      setMessage(
        "Produto eliminado com sucesso."
      )

      setTimeout(() => {
        router.push(
          "/admin/products"
        )

        router.refresh()
      }, 700)
    } catch (deleteError) {
      setError(
        "Erro ao eliminar produto: " +
          getErrorMessage(
            deleteError
          )
      )

      setDeleting(false)
    }
  }

  /*
   * =====================================================
   * LOADING
   * =====================================================
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl bg-white p-10 text-center shadow">
            <p className="text-lg font-semibold">
              Carregando produto...
            </p>
          </div>
        </div>
      </main>
    )
  }

  /*
   * =====================================================
   * PRODUTO NÃO ENCONTRADO
   * =====================================================
   */

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">

          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            <h2 className="mb-2 text-xl font-bold">
              Produto não encontrado
            </h2>

            <p>
              {error ||
                "Não foi possível encontrar este produto."}
            </p>
          </div>

          <Link
            href="/admin/products"
            className="mt-6 inline-block text-blue-600 hover:underline"
          >
            ← Voltar para produtos
          </Link>

        </div>
      </main>
    )
  }

  /*
   * =====================================================
   * INTERFACE
   * =====================================================
   */

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>

            <Link
              href="/admin/products"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Voltar para produtos
            </Link>

            <h1 className="mt-3 text-3xl font-bold">
              Editar Produto
            </h1>

            <p className="mt-2 text-gray-700">
              Atualize todas as informações do produto.
            </p>

          </div>

          <button
            type="button"
            onClick={
              handleDelete
            }
            disabled={
              deleting ||
              saving
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <Trash2 size={18} />

            {deleting
              ? "Eliminando..."
              : "Eliminar Produto"}

          </button>

        </div>

        {message && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-100 p-4 font-semibold text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-100 p-4 font-semibold text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={
            handleSubmit
          }
          className="grid gap-8 lg:grid-cols-3"
        >

          <div className="space-y-8 lg:col-span-2">

            {/* =================================================
                INFORMAÇÕES
            ================================================= */}

            <section className="rounded-xl bg-white p-6 shadow">

              <h2 className="mb-6 text-xl font-bold">
                Informações do Produto
              </h2>

              <label className="font-semibold">
                Nome do produto

                <input
                  required
                  value={name}
                  onChange={(
                    event
                  ) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="Ex: Smartphone Samsung"
                  className="mt-2 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />

              </label>

              <label className="mt-5 block font-semibold">
                Descrição

                <textarea
                  value={
                    description
                  }
                  onChange={(
                    event
                  ) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  rows={7}
                  placeholder="Descrição do produto"
                  className="mt-2 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                />

              </label>

              <label className="mt-5 block font-semibold">
                Slug

                <input
                  value={
                    product.slug
                  }
                  disabled
                  className="mt-2 w-full rounded-lg border bg-gray-100 p-3 text-gray-500"
                />

                <span className="mt-1 block text-xs font-normal text-gray-500">
                  O slug é usado no endereço do produto.
                </span>

              </label>

            </section>

            {/* =================================================
                GALERIA DE IMAGENS
            ================================================= */}

            <section className="rounded-xl bg-white p-6 shadow">

              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>

                  <h2 className="text-xl font-bold">
                    Imagens do Produto
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Adicione quantas imagens quiser.
                    A primeira imagem será usada como principal.
                  </p>

                </div>

                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">

                  <ImagePlus
                    size={20}
                  />

                  Adicionar imagens

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={
                      chooseImages
                    }
                    className="hidden"
                  />

                </label>

              </div>

              {productImages.length ===
                0 &&
                newImages.length ===
                  0 && (
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

              {(productImages.length >
                0 ||
                newImages.length >
                  0) && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">

                  {productImages.map(
                    (
                      image
                    ) => (
                      <div
                        key={
                          image.id
                        }
                        className="group relative overflow-hidden rounded-xl border bg-gray-50"
                      >

                        <img
                          src={
                            image.image_url
                          }
                          alt={
                            name
                          }
                          className="aspect-square w-full object-cover"
                        />

                        {mainImageId ===
                          image.id && (
                          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-blue-600 px-2 py-1 text-xs font-bold text-white">
                            <Star
                              size={
                                12
                              }
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
                              removeExistingImage(
                                image.id
                              )
                            }
                            className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
                            aria-label="Remover imagem"
                          >
                            <Trash2
                              size={
                                16
                              }
                            />
                          </button>

                        </div>

                      </div>
                    )
                  )}

                  {newImages.map(
                    (
                      image
                    ) => (
                      <div
                        key={
                          image.id
                        }
                        className="group relative overflow-hidden rounded-xl border-2 border-dashed border-blue-300 bg-blue-50"
                      >

                        <img
                          src={
                            image.preview
                          }
                          alt="Nova imagem"
                          className="aspect-square w-full object-cover"
                        />

                        <div className="absolute left-2 top-2 rounded-full bg-blue-600 px-2 py-1 text-xs font-bold text-white">
                          Nova
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeNewImage(
                              image.id
                            )
                          }
                          className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-white shadow hover:bg-red-700"
                          aria-label="Remover nova imagem"
                        >
                          <X
                            size={
                              16
                            }
                          />
                        </button>

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
                      Você pode selecionar várias imagens de uma vez.
                    </p>
                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                PREÇO
            ================================================= */}

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
                    onChange={(
                      event
                    ) =>
                      setPrice(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                  />

                </label>

                <label className="font-semibold">

                  Preço antigo

                  <input
                    min="0"
                    step="0.01"
                    type="number"
                    value={
                      compareAtPrice
                    }
                    onChange={(
                      event
                    ) =>
                      setCompareAtPrice(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                  />

                  <span className="mt-1 block text-xs font-normal text-gray-500">
                    Deve ser superior ao preço actual.
                  </span>

                </label>

              </div>

            </section>

            {/* =================================================
                VARIANTES
            ================================================= */}

            <section className="rounded-xl bg-white p-6 shadow">

              <div className="mb-6 flex items-center justify-between gap-4">

                <div>

                  <h2 className="text-xl font-bold">
                    Variantes do Produto
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Adicione opções como cor, tamanho, capacidade, etc.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={
                    addOption
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 font-semibold text-white hover:bg-gray-800"
                >

                  <Plus
                    size={18}
                  />

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
                        option.id ||
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
                            size={
                              18
                            }
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
                                value={
                                  value
                                }
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
                                  size={
                                    18
                                  }
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

                        <Plus
                          size={16}
                        />

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
                  value={
                    categoryId
                  }
                  onChange={(
                    event
                  ) =>
                    setCategoryId(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-lg border bg-white p-3 outline-none focus:border-blue-500"
                >

                  <option value="">
                    Sem categoria
                  </option>

                  {categories.map(
                    (
                      item
                    ) => (
                      <option
                        key={
                          item.id
                        }
                        value={
                          item.id
                        }
                      >
                        {
                          item.name
                        }
                      </option>
                    )
                  )}

                </select>

              </label>

              <label className="mt-5 block font-semibold">

                Marca

                <input
                  value={
                    brand
                  }
                  onChange={(
                    event
                  ) =>
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
                  value={
                    sku
                  }
                  onChange={(
                    event
                  ) =>
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
                  value={
                    stock
                  }
                  onChange={(
                    event
                  ) =>
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
                value={
                  status
                }
                onChange={(
                  event
                ) =>
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
                  checked={
                    featured
                  }
                  onChange={(
                    event
                  ) =>
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
                    Mostrar este produto nas áreas de destaque da loja.
                  </p>

                </div>

              </label>

            </section>

            {/* AÇÕES */}

            <section className="rounded-xl bg-white p-6 shadow">

              <button
                type="submit"
                disabled={
                  saving ||
                  deleting
                }
                className="w-full rounded-xl bg-blue-600 px-8 py-4 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {saving
                  ? "A guardar alterações..."
                  : "Guardar Alterações"}

              </button>

              <Link
                href="/admin/products"
                className="mt-3 block w-full rounded-xl border border-gray-300 bg-white px-8 py-4 text-center font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Link>

              <button
                type="button"
                onClick={
                  handleDelete
                }
                disabled={
                  deleting ||
                  saving
                }
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-8 py-4 font-bold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <Trash2
                  size={18}
                />

                {deleting
                  ? "Eliminando..."
                  : "Eliminar Produto"}

              </button>

            </section>

          </aside>

        </form>

      </div>
    </main>
  )
}