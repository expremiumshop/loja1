"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Trash2, Package } from "lucide-react"
import { supabase } from "@/lib/supabase"

type Product = {
  id: string
  name: string
  price: number | null
  image?: string | null
  active?: boolean | null
  category?: string | null
}

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()

  const id = params.id as string

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")

  const [products, setProducts] = useState<Product[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // =====================================================
  // CARREGAR CATEGORIA
  // =====================================================

  useEffect(() => {
    async function loadCategory() {
      if (!id) return

      setLoading(true)
      setError("")

      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setName(data.name || "")
      setSlug(data.slug || "")

      // Buscar produtos desta categoria
      const { data: productData, error: productError } =
        await supabase
          .from("products")
          .select("*")
          .eq("category", data.name)
          .order("created_at", {
            ascending: false,
          })

      if (productError) {
        console.error(
          "Erro ao carregar produtos:",
          productError
        )
      }

      setProducts(productData || [])
      setLoading(false)
    }

    loadCategory()
  }, [id])

  // =====================================================
  // GERAR SLUG
  // =====================================================

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  // =====================================================
  // ALTERAR NOME
  // =====================================================

  function handleNameChange(value: string) {
    setName(value)
    setSlug(generateSlug(value))
  }

  // =====================================================
  // GUARDAR
  // =====================================================

  async function handleUpdate(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    if (!name.trim()) {
      setError("Digite o nome da categoria.")
      return
    }

    setSaving(true)
    setError("")
    setSuccess("")

    const { error } = await supabase
      .from("categories")
      .update({
        name: name.trim(),
        slug: slug.trim(),
      })
      .eq("id", id)

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    setSuccess("Categoria atualizada com sucesso.")

    setSaving(false)

    router.refresh()
  }

  // =====================================================
  // APAGAR
  // =====================================================

  async function handleDelete() {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja apagar esta categoria?"
    )

    if (!confirmDelete) return

    // Verificar se existem produtos
    if (products.length > 0) {
      const confirmProducts = window.confirm(
        `Esta categoria possui ${products.length} produto(s).\n\nOs produtos não serão apagados, mas ficarão sem categoria.\n\nDeseja continuar?`
      )

      if (!confirmProducts) return

      // Remover categoria dos produtos
      const { error: productsError } = await supabase
        .from("products")
        .update({
          category: null,
        })
        .eq("category", name)

      if (productsError) {
        setError(
          "Não foi possível remover a categoria dos produtos: " +
            productsError.message
        )

        return
      }
    }

    setDeleting(true)
    setError("")

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)

    if (error) {
      setError(error.message)
      setDeleting(false)
      return
    }

    router.push("/admin/categories")
    router.refresh()
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-gray-600">
            A carregar categoria...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto w-full max-w-5xl">

        {/* =================================================
            TOPO
        ================================================= */}

        <div className="mb-6">
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />

            Voltar para categorias
          </Link>
        </div>

        {/* =================================================
            CABEÇALHO
        ================================================= */}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 md:text-4xl">
            Editar Categoria
          </h1>

          <p className="mt-1 text-sm text-gray-500 md:text-base">
            Edite as informações da categoria e gerencie os
            produtos associados.
          </p>
        </div>

        {/* =================================================
            FORMULÁRIO
        ================================================= */}

        <form
          onSubmit={handleUpdate}
          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6"
        >
          {/* ERRO */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* SUCESSO */}

          {success && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
              {success}
            </div>
          )}

          {/* NOME */}

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Nome da categoria
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                handleNameChange(e.target.value)
              }
              placeholder="Ex: Moda Feminina"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* SLUG */}

          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Slug
            </label>

            <input
              type="text"
              value={slug}
              onChange={(e) =>
                setSlug(e.target.value)
              }
              placeholder="moda-feminina"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-2 text-xs text-gray-500">
              O slug é utilizado internamente para identificar
              a categoria.
            </p>
          </div>

          {/* BOTÕES */}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Trash2 className="h-5 w-5" />

              {deleting
                ? "A apagar..."
                : "Apagar categoria"}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Save className="h-5 w-5" />

              {saving
                ? "A guardar..."
                : "Guardar alterações"}
            </button>

          </div>
        </form>

        {/* =================================================
            PRODUTOS
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="flex flex-col gap-3 border-b border-gray-200 p-5 md:flex-row md:items-center md:justify-between md:p-6">

            <div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-700" />

                <h2 className="text-xl font-bold text-gray-900">
                  Produtos da categoria
                </h2>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                {products.length} produto(s) associado(s)
              </p>
            </div>

            <Link
              href={`/admin/categories/${id}/products`}
              className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 md:w-auto"
            >
              Gerenciar produtos
            </Link>

          </div>

          {products.length === 0 ? (

            <div className="p-8 text-center md:p-12">

              <Package className="mx-auto h-12 w-12 text-gray-300" />

              <h3 className="mt-4 font-semibold text-gray-800">
                Nenhum produto
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Esta categoria ainda não possui produtos.
              </p>

              <Link
                href={`/admin/categories/${id}/products`}
                className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Adicionar produtos existentes
              </Link>

            </div>

          ) : (

            <div className="divide-y divide-gray-100">

              {products.slice(0, 5).map((product) => (

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

                  {/* INFORMAÇÕES */}

                  <div className="min-w-0 flex-1">

                    <p className="truncate font-semibold text-gray-900">
                      {product.name}
                    </p>

                    <p className="mt-1 text-sm font-bold text-green-600">
                      {product.price ?? 0} MT
                    </p>

                  </div>

                </div>

              ))}

              {products.length > 5 && (
                <div className="p-4 text-center">

                  <Link
                    href={`/admin/categories/${id}/products`}
                    className="text-sm font-semibold text-blue-600 hover:underline"
                  >
                    Ver todos os {products.length} produtos
                  </Link>

                </div>
              )}

            </div>

          )}

        </section>

      </div>
    </main>
  )
}