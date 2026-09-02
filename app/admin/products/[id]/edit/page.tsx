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
  Zap,
  Palette,
  Ruler,
  HardDrive,
  Droplets,
  Footprints,
  Settings2,
} from "lucide-react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

type Category = {
  id: string
  name: string
}

type ExistingImage = {
  id: string
  image_url: string
  position: number
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

type QuickOption = {
  id: string
  name: string
  icon: React.ReactNode
  values: string[]
}

const QUICK_OPTIONS: QuickOption[] = [
  {
    id: "tamanho-camiseta",
    name: "Tamanho de roupa",
    icon: <Ruler size={18} />,
    values: [
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "3XL",
      "4XL",
      "5XL",
    ],
  },
  {
    id: "cor",
    name: "Cor",
    icon: <Palette size={18} />,
    values: [
      "Preto",
      "Branco",
      "Vermelho",
      "Azul",
      "Verde",
      "Amarelo",
      "Rosa",
      "Laranja",
      "Roxo",
      "Castanho",
      "Cinza",
      "Bege",
    ],
  },
  {
    id: "calcado",
    name: "Calçado",
    icon: <Footprints size={18} />,
    values: [
      "35",
      "36",
      "37",
      "38",
      "39",
      "40",
      "41",
      "42",
      "43",
      "44",
      "45",
      "46",
      "47",
      "48",
    ],
  },
  {
    id: "armazenamento",
    name: "Armazenamento",
    icon: <HardDrive size={18} />,
    values: [
      "32 GB",
      "64 GB",
      "128 GB",
      "256 GB",
      "512 GB",
      "1 TB",
      "2 TB",
    ],
  },
  {
    id: "volume",
    name: "Volume",
    icon: <Droplets size={18} />,
    values: [
      "100 ml",
      "250 ml",
      "500 ml",
      "750 ml",
      "1 L",
      "1,5 L",
      "2 L",
      "5 L",
    ],
  },
]

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

export default function EditProductPage() {
  const params = useParams()
  const productId = String(params.id)

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

  const [existingImages, setExistingImages] = useState<
    ExistingImage[]
  >([])

  const [newImages, setNewImages] = useState<NewImage[]>([])

  const [mainImageId, setMainImageId] = useState<string | null>(
    null
  )

  const [mainExistingImageId, setMainExistingImageId] =
    useState<string | null>(null)

  const [productOptions, setProductOptions] = useState<
    ProductOption[]
  >([])

  const [quickType, setQuickType] = useState("")
  const [quickSelectedValues, setQuickSelectedValues] =
    useState<string[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError("")

      try {
        const categoriesResult = await supabase
          .from("categories")
          .select("id, name")
          .order("name", {
            ascending: true,
          })

        if (categoriesResult.error) {
          throw new Error(
            "Erro ao carregar categorias: " +
              categoriesResult.error.message
          )
        }

        setCategories(categoriesResult.data || [])

        const productResult = await supabase
          .from("products")
          .select(
            `
              id,
              name,
              slug,
              description,
              price,
              compare_at_price,
              category_id,
              category,
              brand,
              sku,
              stock,
              image,
              active,
              featured
            `
          )
          .eq("id", productId)
          .single()

        if (productResult.error) {
          throw new Error(
            "Erro ao carregar produto: " +
              productResult.error.message
          )
        }

        const product = productResult.data

        setName(product.name || "")
        setDescription(product.description || "")

        setPrice(
          product.price !== null &&
            product.price !== undefined
            ? String(product.price)
            : ""
        )

        setCompareAtPrice(
          product.compare_at_price !== null &&
            product.compare_at_price !== undefined
            ? String(product.compare_at_price)
            : ""
        )

        setCategoryId(product.category_id || "")
        setBrand(product.brand || "")
        setSku(product.sku || "")

        setStock(
          product.stock !== null &&
            product.stock !== undefined
            ? String(product.stock)
            : "0"
        )

        setStatus(product.active ? "active" : "draft")
        setFeatured(Boolean(product.featured))

        const imagesResult = await supabase
          .from("product_images")
          .select("id, image_url, position")
          .eq("product_id", productId)
          .order("position", {
            ascending: true,
          })

        if (imagesResult.error) {
          throw new Error(
            "Erro ao carregar imagens: " +
              imagesResult.error.message
          )
        }

        let loadedImages: ExistingImage[] =
          imagesResult.data || []

        if (
          loadedImages.length === 0 &&
          product.image
        ) {
          loadedImages = [
            {
              id: "product-main-image",
              image_url: product.image,
              position: 0,
            },
          ]
        }

        setExistingImages(loadedImages)

        if (loadedImages.length > 0) {
          const mainImage = product.image
            ? loadedImages.find(
                (image) =>
                  image.image_url === product.image
              )
            : loadedImages[0]

          if (mainImage) {
            setMainExistingImageId(mainImage.id)
          }
        }

        const optionsResult = await supabase
          .from("product_options")
          .select("id, name, values, position")
          .eq("product_id", productId)
          .order("position", {
            ascending: true,
          })

        if (optionsResult.error) {
          throw new Error(
            "Erro ao carregar opções: " +
              optionsResult.error.message
          )
        }

        const loadedOptions: ProductOption[] = (
          optionsResult.data || []
        ).map((option) => ({
          name: option.name || "",
          values: Array.isArray(option.values)
            ? option.values.map(String)
            : [],
        }))

        setProductOptions(loadedOptions)
      } catch (loadError) {
        setError(getErrorMessage(loadError))
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      loadData()
    }
  }, [productId])

  useEffect(() => {
    return () => {
      newImages.forEach((image) => {
        URL.revokeObjectURL(image.preview)
      })
    }
  }, [newImages])

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

      if (file.size > 1 * 1024 * 1024) {
        setError(
          "Uma das imagens ultrapassa o limite de 1 MB."
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

  async function removeExistingImage(
    imageId: string
  ) {
    const image = existingImages.find(
      (item) => item.id === imageId
    )

    if (!image) {
      return
    }

    const confirmed = window.confirm(
      "Tem certeza que deseja remover esta imagem?"
    )

    if (!confirmed) {
      return
    }

    setError("")
    setMessage("")

    try {
      if (imageId !== "product-main-image") {
        const deleteResult = await supabase
          .from("product_images")
          .delete()
          .eq("id", imageId)

        if (deleteResult.error) {
          throw deleteResult.error
        }
      }

      setExistingImages((current) =>
        current.filter(
          (item) => item.id !== imageId
        )
      )

      if (mainExistingImageId === imageId) {
        setMainExistingImageId(null)
      }

      setMessage("Imagem removida.")
    } catch (removeError) {
      setError(
        "Erro ao remover imagem: " +
          getErrorMessage(removeError)
      )
    }
  }

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

  function setExistingAsMainImage(
    imageId: string
  ) {
    setMainExistingImageId(imageId)
    setMainImageId(null)
  }

  function setAsMainImage(imageId: string) {
    setMainImageId(imageId)
    setMainExistingImageId(null)
  }

  function addOption() {
    setProductOptions((current) => [
      ...current,
      {
        name: "",
        values: [""],
      },
    ])
  }

  function removeOption(index: number) {
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

  function addOptionValue(
    optionIndex: number
  ) {
    setProductOptions((current) =>
      current.map((option, index) => {
        if (index !== optionIndex) {
          return option
        }

        return {
          ...option,
          values: [
            ...option.values,
            "",
          ],
        }
      })
    )
  }

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

  function removeOptionValue(
    optionIndex: number,
    valueIndex: number
  ) {
    setProductOptions((current) =>
      current.map((option, index) => {
        if (index !== optionIndex) {
          return option
        }

        const newValues =
          option.values.filter(
            (_, itemIndex) =>
              itemIndex !== valueIndex
          )

        return {
          ...option,
          values:
            newValues.length > 0
              ? newValues
              : [""],
        }
      })
    )
  }

  const selectedQuickOption =
    QUICK_OPTIONS.find(
      (option) =>
        option.id === quickType
    )

  function changeQuickType(
    value: string
  ) {
    setQuickType(value)
    setQuickSelectedValues([])
  }

  function toggleQuickValue(
    value: string
  ) {
    setQuickSelectedValues((current) => {
      if (current.includes(value)) {
        return current.filter(
          (item) => item !== value
        )
      }

      return [
        ...current,
        value,
      ]
    })
  }

  function selectAllQuickValues() {
    if (!selectedQuickOption) {
      return
    }

    setQuickSelectedValues([
      ...selectedQuickOption.values,
    ])
  }

  function clearQuickValues() {
    setQuickSelectedValues([])
  }

  function addQuickOption() {
    if (
      !selectedQuickOption ||
      quickSelectedValues.length === 0
    ) {
      setError(
        "Escolha um tipo de opção e pelo menos um valor."
      )
      return
    }

    setError("")

    const existingIndex =
      productOptions.findIndex(
        (option) =>
          option.name.toLowerCase() ===
          selectedQuickOption.name.toLowerCase()
      )

    if (existingIndex >= 0) {
      setProductOptions((current) =>
        current.map((option, index) => {
          if (index !== existingIndex) {
            return option
          }

          const mergedValues =
            Array.from(
              new Set([
                ...option.values.filter(
                  Boolean
                ),
                ...quickSelectedValues,
              ])
            )

          return {
            ...option,
            values: mergedValues,
          }
        })
      )
    } else {
      setProductOptions((current) => [
        ...current,
        {
          name: selectedQuickOption.name,
          values: [
            ...quickSelectedValues,
          ],
        },
      ])
    }

    setMessage(
      `${selectedQuickOption.name} adicionado com sucesso.`
    )

    setQuickSelectedValues([])
  }

  const selectedCategory =
    categories.find(
      (category) =>
        category.id === categoryId
    )

  function generateVariantCombinations(
    options: ProductOption[]
  ) {
    const cleaned = options
      .map((option) => ({
        name: option.name.trim(),
        values: Array.from(
          new Set(
            option.values
              .map((value) =>
                value.trim()
              )
              .filter(Boolean)
          )
        ),
      }))
      .filter(
        (option) =>
          option.name.length > 0 &&
          option.values.length > 0
      )

    if (cleaned.length === 0) {
      return []
    }

    let combinations: Record<
      string,
      string
    >[] = [{}]

    for (const option of cleaned) {
      const next: Record<
        string,
        string
      >[] = []

      for (const combination of combinations) {
        for (const value of option.values) {
          next.push({
            ...combination,
            [option.name]: value,
          })
        }
      }

      combinations = next
    }

    return combinations
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")
    setMessage("")
    setSaving(true)

    const numericPrice = Number(price)

    if (!name.trim()) {
      setError(
        "Digite o nome do produto."
      )
      setSaving(false)
      return
    }

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      setError(
        "Digite um preço válido."
      )
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
      Number.parseInt(
        stock || "0",
        10
      ) || 0

    try {
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

        if (uploadResult.error) {
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
          image_url:
            publicUrlResult.data
              .publicUrl,
          position:
            existingImages.length +
            index,
          localId: item.id,
        })
      }

      let mainImageUrl: string | null =
        null

      if (mainImageId) {
        const newMainImage =
          uploadedImages.find(
            (image) =>
              image.localId ===
              mainImageId
          )

        if (newMainImage) {
          mainImageUrl =
            newMainImage.image_url
        }
      }

      if (
        !mainImageUrl &&
        mainExistingImageId
      ) {
        const existingMainImage =
          existingImages.find(
            (image) =>
              image.id ===
              mainExistingImageId
          )

        if (existingMainImage) {
          mainImageUrl =
            existingMainImage.image_url
        }
      }

      if (
        !mainImageUrl &&
        existingImages.length > 0
      ) {
        mainImageUrl =
          existingImages[0].image_url
      }

      if (
        !mainImageUrl &&
        uploadedImages.length > 0
      ) {
        mainImageUrl =
          uploadedImages[0].image_url
      }

      const baseSlug =
        slugify(name) ||
        `produto-${Date.now()}`

      let generatedSlug =
        baseSlug

      const existingSlugsResult =
        await supabase
          .from("products")
          .select("id, slug")
          .like(
            "slug",
            `${baseSlug}%`
          )
          .neq(
            "id",
            productId
          )

      if (
        existingSlugsResult.error
      ) {
        throw existingSlugsResult.error
      }

      const existingSlugs =
        existingSlugsResult.data

      if (
        existingSlugs &&
        existingSlugs.length > 0
      ) {
        const usedSlugs =
          new Set(
            existingSlugs.map(
              (item) =>
                item.slug
            )
          )

        let counter = 2

        while (
          usedSlugs.has(
            `${baseSlug}-${counter}`
          )
        ) {
          counter++
        }

        generatedSlug =
          `${baseSlug}-${counter}`
      }

      const productResult =
        await supabase
          .from("products")
          .update({
            name: name.trim(),
            slug: generatedSlug,
            description:
              description.trim() ||
              null,
            price: numericPrice,
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
              brand.trim() || null,
            sku:
              sku.trim() || null,
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
          .eq("id", productId)

      if (productResult.error) {
        throw productResult.error
      }

      if (
        uploadedImages.length > 0
      ) {
        const startPosition =
          existingImages.length

        const imageRows =
          uploadedImages.map(
            (
              image,
              index
            ) => ({
              product_id:
                productId,
              image_url:
                image.image_url,
              position:
                startPosition +
                index,
            })
          )

        const imagesResult =
          await supabase
            .from("product_images")
            .insert(
              imageRows
            )

        if (imagesResult.error) {
          throw imagesResult.error
        }
      }

      const refreshedImagesResult =
        await supabase
          .from("product_images")
          .select(
            "id, image_url, position"
          )
          .eq(
            "product_id",
            productId
          )
          .order("position", {
            ascending: true,
          })

      if (
        refreshedImagesResult.error
      ) {
        throw refreshedImagesResult.error
      }

      const refreshedImages =
        refreshedImagesResult.data ||
        []

      if (
        refreshedImages.length > 0 &&
        mainImageUrl
      ) {
        const orderedImages = [
          ...refreshedImages,
        ].sort((a, b) => {
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
        })

        for (
          let index = 0;
          index < orderedImages.length;
          index++
        ) {
          await supabase
            .from("product_images")
            .update({
              position: index,
            })
            .eq(
              "id",
              orderedImages[index].id
            )
        }
      }

      const cleanedOptions =
        productOptions
          .map((option) => ({
            name:
              option.name.trim(),
            values: Array.from(
              new Set(
                option.values
                  .map((value) =>
                    value.trim()
                  )
                  .filter(Boolean)
              )
            ),
          }))
          .filter(
            (option) =>
              option.name.length > 0 &&
              option.values.length > 0
          )

      const deleteOptionsResult =
        await supabase
          .from("product_options")
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

      const deleteVariantsResult =
        await supabase
          .from("product_variants")
          .delete()
          .eq(
            "product_id",
            productId
          )

      if (
        deleteVariantsResult.error
      ) {
        throw deleteVariantsResult.error
      }

      if (
        cleanedOptions.length > 0
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

        const optionsResult =
          await supabase
            .from("product_options")
            .insert(
              optionRows
            )

        if (
          optionsResult.error
        ) {
          throw optionsResult.error
        }

        const combinations =
          generateVariantCombinations(
            cleanedOptions
          )

        if (
          combinations.length > 0
        ) {
          const variantRows =
            combinations.map(
              (
                combination,
                index
              ) => ({
                product_id:
                  productId,
                options:
                  combination,
                name: Object.entries(
                  combination
                )
                  .map(
                    ([
                      key,
                      value,
                    ]) =>
                      `${key}: ${value}`
                  )
                  .join(
                    " / "
                  ),
                sku: null,
                price:
                  numericPrice,
                stock:
                  numericStock,
                active: true,
                position:
                  index,
              })
            )

          const variantsResult =
            await supabase
              .from(
                "product_variants"
              )
              .insert(
                variantRows
              )

          if (
            variantsResult.error
          ) {
            throw variantsResult.error
          }
        }
      }

      setMessage(
        "Produto atualizado com sucesso."
      )

      setNewImages([])

      setTimeout(() => {
        window.location.href =
          "/admin/products"
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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="font-semibold text-gray-700">
              Carregando produto...
            </p>
          </div>
        </div>
      </main>
    )
  }

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
              Atualize as informações deste produto.
            </p>
          </div>
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
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-3"
        >
          <div className="space-y-8 lg:col-span-2">

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
                  placeholder="Ex: Camiseta Nike"
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
                    Gerencie as imagens existentes ou adicione novas imagens.
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

              {existingImages.length === 0 &&
                newImages.length === 0 && (
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

              {(existingImages.length > 0 ||
                newImages.length > 0) && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">

                  {/* IMAGENS EXISTENTES */}
                  {existingImages.map(
                    (image) => (
                      <div
                        key={image.id}
                        className="group relative overflow-hidden rounded-xl border bg-gray-50"
                      >
                        <img
                          src={image.image_url}
                          alt={
                            name ||
                            "Imagem do produto"
                          }
                          className="aspect-square w-full object-cover"
                        />

                        {mainExistingImageId ===
                          image.id && (
                          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-blue-600 px-2 py-1 text-xs font-bold text-white">
                            <Star
                              size={12}
                              fill="currentColor"
                            />

                            Principal
                          </div>
                        )}

                        {/* CORREÇÃO MOBILE:
                            opacity-100 = sempre visível no celular
                            sm:opacity-0 = escondido no desktop
                            sm:group-hover:opacity-100 = aparece no hover no desktop
                        */}
                        <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-black/60 p-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">

                          {mainExistingImageId !==
                            image.id && (
                            <button
                              type="button"
                              onClick={() =>
                                setExistingAsMainImage(
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
                              size={16}
                            />
                          </button>
                        </div>
                      </div>
                    )
                  )}

                  {/* NOVAS IMAGENS */}
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
                            "Nova imagem"
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

                        {/* CORREÇÃO MOBILE:
                            controles sempre visíveis no celular
                        */}
                        <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-black/60 p-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">

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
                      Cada imagem pode ter até 1 MB.
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
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <Zap
                    size={22}
                    className="text-blue-600"
                  />

                  <h2 className="text-xl font-bold">
                    Variantes do Produto
                  </h2>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  Adicione rapidamente tamanhos, cores,
                  capacidades, volumes e outras opções.
                </p>
              </div>

              <div className="rounded-xl border-2 border-blue-100 bg-blue-50 p-5">
                <div className="mb-5 flex items-center gap-2">
                  <Zap
                    size={20}
                    className="text-blue-600"
                  />

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Adicionar rapidamente
                    </h3>

                    <p className="text-sm text-gray-600">
                      Escolha uma categoria pronta.
                    </p>
                  </div>
                </div>

                <label className="block font-semibold">
                  Tipo de opção

                  <select
                    value={quickType}
                    onChange={(event) =>
                      changeQuickType(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-lg border bg-white p-3 outline-none focus:border-blue-500"
                  >
                    <option value="">
                      Selecionar tipo...
                    </option>

                    {QUICK_OPTIONS.map(
                      (option) => (
                        <option
                          key={option.id}
                          value={option.id}
                        >
                          {option.name}
                        </option>
                      )
                    )}

                    <option value="custom">
                      Personalizado
                    </option>
                  </select>
                </label>

                {selectedQuickOption && (
                  <div className="mt-5">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-semibold">
                        Selecione os valores
                      </p>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={
                            selectAllQuickValues
                          }
                          className="text-xs font-semibold text-blue-600 hover:underline"
                        >
                          Selecionar todos
                        </button>

                        <button
                          type="button"
                          onClick={
                            clearQuickValues
                          }
                          className="text-xs font-semibold text-gray-600 hover:underline"
                        >
                          Limpar
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                      {selectedQuickOption.values.map(
                        (value) => {
                          const selected =
                            quickSelectedValues.includes(
                              value
                            )

                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() =>
                                toggleQuickValue(
                                  value
                                )
                              }
                              className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${
                                selected
                                  ? "border-blue-600 bg-blue-600 text-white"
                                  : "border-gray-300 bg-white text-gray-700 hover:border-blue-400"
                              }`}
                            >
                              {selected &&
                                "✓ "}

                              {value}
                            </button>
                          )
                        }
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={
                        addQuickOption
                      }
                      disabled={
                        quickSelectedValues.length ===
                        0
                      }
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus
                        size={18}
                      />

                      Adicionar opção selecionada
                    </button>
                  </div>
                )}

                {quickType ===
                  "custom" && (
                  <div className="mt-5 rounded-lg bg-white p-4">
                    <div className="flex items-start gap-3">
                      <Settings2
                        size={20}
                        className="mt-1 text-gray-600"
                      />

                      <div>
                        <p className="font-semibold">
                          Opção personalizada
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Use a área abaixo para criar qualquer opção que não exista nas listas rápidas.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">
                      Opções adicionadas
                    </h3>

                    <p className="text-sm text-gray-500">
                      Estas serão usadas para gerar as variantes.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      addOption
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                  >
                    <Plus
                      size={17}
                    />

                    Personalizar
                  </button>
                </div>

                {productOptions.length ===
                  0 && (
                  <div className="rounded-lg border border-dashed p-6 text-center text-gray-500">
                    Nenhuma opção adicionada.
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
              </div>

              {productOptions.length >
                0 && (
                <div className="mt-8 rounded-xl border bg-gray-50 p-5">
                  <h3 className="font-bold">
                    Resumo das variantes
                  </h3>

                  <div className="mt-4 space-y-3">
                    {productOptions.map(
                      (
                        option,
                        index
                      ) => (
                        <div
                          key={index}
                          className="flex flex-wrap items-center gap-2"
                        >
                          <span className="font-semibold">
                            {
                              option.name
                            }:
                          </span>

                          {option.values
                            .filter(
                              Boolean
                            )
                            .map(
                              (
                                value
                              ) => (
                                <span
                                  key={
                                    value
                                  }
                                  className="rounded-full bg-white px-3 py-1 text-sm text-gray-700 shadow-sm"
                                >
                                  {
                                    value
                                  }
                                </span>
                              )
                            )}
                        </div>
                      )
                    )}
                  </div>

                  {generateVariantCombinations(
                    productOptions
                  ).length > 0 && (
                    <p className="mt-4 text-sm font-semibold text-blue-700">
                      O sistema irá gerar{" "}
                      {
                        generateVariantCombinations(
                          productOptions
                        ).length
                      }{" "}
                      combinação(ões) de variantes.
                    </p>
                  )}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-8">

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
                  className="mt-2 w-full rounded-lg border bg-white p-3 outline-none focus:border-blue-500"
                >
                  <option value="">
                    Sem categoria
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

                <span className="mt-1 block text-xs font-normal text-gray-500">
                  Para produtos com variantes, este valor será aplicado às combinações geradas.
                </span>
              </label>
            </section>

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
                    Mostrar este produto nas áreas de destaque da loja.
                  </p>
                </div>
              </label>
            </section>

            <section className="rounded-xl bg-white p-6 shadow">
              <button
                type="submit"
                disabled={saving}
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
            </section>
          </aside>
        </form>
      </div>
    </main>
  )
}