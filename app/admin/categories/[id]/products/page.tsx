"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Package,
  Search,
  Check,
  Plus,
  X,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

type Product = {
  id: string
  name: string
  price: number | null
  image?: string | null
  active?: boolean | null
  category?: string | null
  stock?: number | null
}

type Category = {
  id: string
  name: string
  slug: string
}

export default function CategoryProductsPage() {
  const params = useParams()
  const router = useRouter()

  const id = params.id as string

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])

  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const [search, setSearch] = useState("")

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // =====================================================
  // CARREGAR CATEGORIA
  // =====================================================

  useEffect(() => {
    if (!id) return

    async function loadData() {
      setLoading(true)
      setError("")

      // Buscar categoria
      const {
        data: categoryData,
        error: categoryError,
      } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("id", id)
        .single()

      if (categoryError) {
        setError(
          "Erro ao carregar categoria: " +
            categoryError.message
        )

        setLoading(false)
        return
      }

      setCategory(categoryData)

      // Buscar TODOS os produtos
      const {
        data: productData,
        error: productError,
      } = await supabase
        .from("products")
        .select(
          "id, name, price, image, active, category, stock"
        )
        .order("created_at", {
          ascending: false,
        })

      if (productError) {
        setError(
          "Erro ao carregar produtos: " +
            productError.message
        )

        setLoading(false)
        return
      }

      setProducts(productData || [])

      setLoading(false)
    }

    loadData()
  }, [id])

  // =====================================================
  // SELECIONAR / DESSELECIONAR
  // =====================================================

  function toggleProduct(productId: string) {
    setSelectedProducts((current) => {
      if (current.includes(productId)) {
        return current.filter(
          (item) => item !== productId
        )
      }

      return [...current, productId]
    })
  }

  // =====================================================
  // SELECIONAR TODOS
  // =====================================================

  function selectAll() {
    const availableIds = filteredProducts.map(
      (product) => product.id
    )

    setSelectedProducts(availableIds)
  }

  // =====================================================
  // LIMPAR SELEÇÃO
  // =====================================================

  function clearSelection() {
    setSelectedProducts([])
  }

  // =====================================================
  // ADICIONAR PRODUTOS À CATEGORIA
  // =====================================================

  async function handleAddProducts() {
    if (!category) return

    if (selectedProducts.length === 0) {
      setError(
        "Selecione pelo menos um produto."
      )

      return
    }

    const confirmed = window.confirm(
      `Deseja adicionar ${selectedProducts.length} produto(s) à categoria "${category.name}"?`
    )

    if (!confirmed) return

    setSaving(true)
    setError("")
    setSuccess("")

    try {
      // Atualizar os produtos selecionados
      const { error: updateError } =
        await supabase
          .from("products")
          .update({
            category: category.name,
          })
          .in("id", selectedProducts)

      if (updateError) {
        setError(
          "Erro ao adicionar produtos: " +
            updateError.message
        )

        setSaving(false)
        return
      }

      setSuccess(
        `${selectedProducts.length} produto(s) adicionado(s) à categoria com sucesso.`
      )

      // Atualizar estado local
      setProducts((current) =>
        current.map((product) =>
          selectedProducts.includes(product.id)
            ? {
                ...product,
                category: category.name,
              }
            : product
        )
      )

      setSelectedProducts([])

      router.refresh()
    } catch (error) {
      console.error(error)

      setError(
        "Ocorreu um erro ao adicionar os produtos."
      )
    } finally {
      setSaving(false)
    }
  }

  // =====================================================
  // REMOVER PRODUTO DA CATEGORIA
  // =====================================================

  async function handleRemoveProduct(
    productId: string,
    productName: string
  ) {
    if (!category) return

    const confirmed = window.confirm(
      `Deseja remover "${productName}" desta categoria?\n\nO produto NÃO será apagado. Apenas ficará sem esta categoria.`
    )

    if (!confirmed) return

    setSaving(true)
    setError("")
    setSuccess("")

    const { error: updateError } =
      await supabase
        .from("products")
        .update({
          category: null,
        })
        .eq("id", productId)

    if (updateError) {
      setError(
        "Erro ao remover produto: " +
          updateError.message
      )

      setSaving(false)
      return
    }

    setProducts((current) =>
      current.map((product) =>
        product.id === productId
          ? {
              ...product,
              category: null,
            }
          : product
      )
    )

    setSuccess(
      "Produto removido da categoria."
    )

    setSaving(false)
  }

  // =====================================================
  // FILTRAR PRODUTOS
  // =====================================================

  const filteredProducts = products.filter(
    (product) => {
      const text = search.toLowerCase()

      return (
        product.name
          ?.toLowerCase()
          .includes(text) ||
        product.category
          ?.toLowerCase()
          .includes(text)
      )
    }
  )

  // =====================================================
  // PRODUTOS JÁ NESTA CATEGORIA
  // =====================================================

  const categoryProducts = products.filter(
    (product) =>
      product.category === category?.name
  )

  // =====================================================
  // PRODUTOS DE OUTRAS CATEGORIAS
  // =====================================================

  const otherProducts = filteredProducts.filter(
    (product) =>
      product.category !== category?.name
  )

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-gray-600">
            A carregar produtos...
          </p>
        </div>
      </main>
    )
  }

  // =====================================================
  // CATEGORIA NÃO ENCONTRADA
  // =====================================================

  if (!category) {
    return (
      <main className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow">
          <h1 className="text-2xl font-bold text-red-600">
            Categoria não encontrada
          </h1>

          <Link
            href="/admin/categories"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
          >
            Voltar para categorias
          </Link>
        </div>
      </main>
    )
  }

  // =====================================================
  // PÁGINA
  // =====================================================

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* =================================================
            TOPO
        ================================================= */}

        <div className="mb-5">
          <Link
            href={`/admin/categories/${id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />

            Voltar para categoria
          </Link>
        </div>

        {/* =================================================
            CABEÇALHO
        ================================================= */}

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                    Produtos da categoria
                  </h1>

                  <p className="mt-1 text-sm text-gray-500">
                    {category.name}
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/admin/products/new"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 md:w-auto"
            >
              <Plus className="h-5 w-5" />

              Criar novo produto
            </Link>

          </div>
        </div>

        {/* =================================================
            MENSAGENS
        ================================================= */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {/* =================================================
            PRODUTOS ATUAIS
        ================================================= */}

        <section className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 p-5 md:p-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Produtos nesta categoria
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {categoryProducts.length} produto(s)
                </p>
              </div>

            </div>
          </div>

          {categoryProducts.length === 0 ? (
            <div className="p-8 text-center md:p-12">
              <Package className="mx-auto h-12 w-12 text-gray-300" />

              <h3 className="mt-4 font-semibold text-gray-800">
                Nenhum produto nesta categoria
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Selecione produtos abaixo para
                adicioná-los.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {categoryProducts.map(
                (product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-4 md:p-5"
                  >

                    {/* IMAGEM */}

                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border bg-gray-100">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* INFORMAÇÃO */}

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-gray-900">
                        {product.name}
                      </p>

                      <p className="mt-1 text-sm font-bold text-green-600">
                        {product.price ?? 0} MT
                      </p>
                    </div>

                    {/* REMOVER */}

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveProduct(
                          product.id,
                          product.name
                        )
                      }
                      disabled={saving}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />

                      <span className="hidden sm:inline">
                        Remover
                      </span>
                    </button>

                  </div>
                )
              )}
            </div>
          )}

        </section>

        {/* =================================================
            ADICIONAR PRODUTOS EXISTENTES
        ================================================= */}

        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* CABEÇALHO */}

          <div className="border-b border-gray-200 p-5 md:p-6">

            <h2 className="text-xl font-bold text-gray-900">
              Adicionar produtos existentes
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Selecione produtos que já existem na
              loja para adicioná-los a esta categoria.
            </p>

          </div>

          {/* PESQUISA */}

          <div className="border-b border-gray-200 p-4 md:p-6">

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Pesquisar produto..."
                className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

          </div>

          {/* CONTROLES */}

          {otherProducts.length > 0 && (
            <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between md:p-6">

              <p className="text-sm font-medium text-gray-600">
                {selectedProducts.length} produto(s)
                selecionado(s)
              </p>

              <div className="flex flex-wrap gap-2">

                <button
                  type="button"
                  onClick={selectAll}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Selecionar todos
                </button>

                {selectedProducts.length > 0 && (
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Limpar
                  </button>
                )}

              </div>

            </div>
          )}

          {/* LISTA */}

          <div className="divide-y divide-gray-100">

            {otherProducts.map(
              (product) => {
                const selected =
                  selectedProducts.includes(
                    product.id
                  )

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() =>
                      toggleProduct(product.id)
                    }
                    className={`flex w-full items-center gap-3 p-4 text-left transition md:p-5 ${
                      selected
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                  >

                    {/* CHECKBOX */}

                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
                        selected
                          ? "border-blue-600 bg-blue-600"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {selected && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>

                    {/* IMAGEM */}

                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border bg-gray-100">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* INFORMAÇÕES */}

                    <div className="min-w-0 flex-1">

                      <p className="truncate font-semibold text-gray-900">
                        {product.name}
                      </p>

                      <p className="mt-1 text-sm font-bold text-green-600">
                        {product.price ?? 0} MT
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {product.category
                          ? `Categoria atual: ${product.category}`
                          : "Sem categoria"}
                      </p>

                    </div>

                  </button>
                )
              }
            )}

            {otherProducts.length === 0 && (
              <div className="p-8 text-center md:p-12">

                <Package className="mx-auto h-12 w-12 text-gray-300" />

                <h3 className="mt-4 font-semibold text-gray-800">
                  Nenhum produto encontrado
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Tente pesquisar outro produto ou
                  crie um novo produto.
                </p>

              </div>
            )}

          </div>

          {/* BOTÃO ADICIONAR */}

          {selectedProducts.length > 0 && (
            <div className="sticky bottom-0 border-t border-gray-200 bg-white p-4 shadow-lg md:p-5">

              <button
                type="button"
                onClick={handleAddProducts}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <Check className="h-5 w-5" />

                {saving
                  ? "A adicionar..."
                  : `Adicionar ${selectedProducts.length} produto(s)`}
              </button>

            </div>
          )}

        </section>

      </div>
    </main>
  )
}