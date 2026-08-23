"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Check,
  Edit,
  Package,
  Trash2,
  X,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

interface Product {
  id: string
  name: string
  category?: string | null
  price?: number | null
  stock?: number | null
  active?: boolean | null
  created_at?: string
}

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [deleting, setDeleting] = useState(false)

  // =====================================================
  // CARREGAR PRODUTOS
  // =====================================================

  async function loadProducts() {
    try {
      setLoading(true)
      setErrorMessage("")

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", {
          ascending: false,
        })

      if (error) {
        console.error("Erro ao carregar produtos:", error)
        setErrorMessage(error.message)
        return
      }

      setProducts(data || [])
    } catch (error) {
      console.error(error)

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao carregar produtos."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  // =====================================================
  // SELECIONAR / DESSELECIONAR PRODUTO
  // =====================================================

  function toggleProduct(id: string) {
    setSelectedProducts((current) => {
      if (current.includes(id)) {
        return current.filter(
          (productId) => productId !== id
        )
      }

      return [...current, id]
    })
  }

  // =====================================================
  // SELECIONAR TODOS
  // =====================================================

  function toggleAllProducts() {
    if (
      selectedProducts.length === products.length
    ) {
      setSelectedProducts([])
      return
    }

    setSelectedProducts(
      products.map((product) => product.id)
    )
  }

  // =====================================================
  // ELIMINAR PRODUTOS SELECIONADOS
  // =====================================================

  async function deleteSelectedProducts() {
    if (selectedProducts.length === 0) {
      return
    }

    const confirmed = window.confirm(
      `Tem certeza que deseja eliminar ${selectedProducts.length} produto(s)?\n\nEsta ação não pode ser desfeita.`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeleting(true)

      const { error } = await supabase
        .from("products")
        .delete()
        .in("id", selectedProducts)

      if (error) {
        console.error(
          "Erro ao eliminar produtos:",
          error
        )

        window.alert(
          `Erro ao eliminar produtos: ${error.message}`
        )

        return
      }

      setProducts((current) =>
        current.filter(
          (product) =>
            !selectedProducts.includes(product.id)
        )
      )

      setSelectedProducts([])

      window.alert(
        "Produtos eliminados com sucesso."
      )
    } catch (error) {
      console.error(error)

      window.alert(
        error instanceof Error
          ? error.message
          : "Erro ao eliminar produtos."
      )
    } finally {
      setDeleting(false)
    }
  }

  // =====================================================
  // ESTATÍSTICAS
  // =====================================================

  const totalProducts = products.length

  const activeProducts = products.filter(
    (product) => product.active
  ).length

  const selectedCount = selectedProducts.length

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Gestão de Produtos
          </h1>

          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Controle produtos, categorias, estoque e
            vendas da loja.
          </p>
        </div>

        {/* BOTÕES */}

        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 lg:w-auto">
        <Link
  href="/admin/categories"
  className="
    inline-flex
    min-h-11
    items-center
    justify-center
    gap-2
    rounded-lg
    bg-gray-900
    px-4
    py-3
    text-sm
    font-semibold
    text-white
    transition
    hover:bg-gray-800
  "
>
  <span className="text-white">📂</span>

  <span className="text-white">
    Categorias
  </span>
</Link>

          <Link
            href="/admin/categories/new"
            className="
              inline-flex
              min-h-11
              items-center
              justify-center
              rounded-lg
              bg-green-600
              px-4
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-green-700
            "
          >
            + Nova Categoria
          </Link>

          <Link
            href="/admin/products/new"
            className="
              inline-flex
              min-h-11
              items-center
              justify-center
              rounded-lg
              bg-blue-600
              px-4
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-blue-700
            "
          >
            + Novo Produto
          </Link>
        </div>
      </div>

      {/* =====================================================
          ERRO
      ===================================================== */}

      {errorMessage && (
        <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">
            Erro ao carregar produtos:
          </p>

          <p className="mt-1 break-words">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={loadProducts}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* =====================================================
          ESTATÍSTICAS
      ===================================================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {/* TOTAL */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Package size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total Produtos
              </p>

              <h2 className="text-2xl font-bold text-gray-900">
                {totalProducts}
              </h2>
            </div>
          </div>
        </div>

        {/* ATIVOS */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Produtos Ativos
          </p>

          <h2 className="mt-1 text-2xl font-bold text-green-600">
            {activeProducts}
          </h2>
        </div>

        {/* SELECIONADOS */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Selecionados
          </p>

          <h2 className="mt-1 text-2xl font-bold text-red-600">
            {selectedCount}
          </h2>
        </div>
      </div>

      {/* =====================================================
          AÇÕES EM MASSA
      ===================================================== */}

      {selectedCount > 0 && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-red-700">
                {selectedCount} produto(s) selecionado(s)
              </p>

              <p className="text-sm text-red-600">
                Escolha uma ação para os produtos selecionados.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setSelectedProducts([])}
                className="
                  inline-flex
                  min-h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-gray-700
                  hover:bg-gray-50
                "
              >
                <X size={17} />
                Cancelar seleção
              </button>

              <button
                type="button"
                onClick={deleteSelectedProducts}
                disabled={deleting}
                className="
                  inline-flex
                  min-h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-red-600
                  px-4
                  py-2
                  text-sm
                  font-bold
                  text-white
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <Trash2 size={17} />

                {deleting
                  ? "Eliminando..."
                  : "Eliminar selecionados"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          PRODUTOS
      ===================================================== */}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        {/* CABEÇALHO DA LISTA */}

        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-gray-900">
              Produtos
            </h2>

            <p className="text-sm text-gray-500">
              Gerencie os produtos da sua loja.
            </p>
          </div>

          {products.length > 0 && (
            <button
              type="button"
              onClick={toggleAllProducts}
              className="
                inline-flex
                min-h-10
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-gray-300
                px-4
                py-2
                text-sm
                font-semibold
                text-gray-700
                hover:bg-gray-50
              "
            >
              <Check size={17} />

              {selectedProducts.length ===
              products.length
                ? "Desmarcar todos"
                : "Selecionar todos"}
            </button>
          )}
        </div>

        {/* =================================================
            DESKTOP
        ================================================= */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="w-12 p-4 text-center">
                  <input
                    type="checkbox"
                    checked={
                      products.length > 0 &&
                      selectedProducts.length ===
                        products.length
                    }
                    onChange={toggleAllProducts}
                    className="h-4 w-4"
                  />
                </th>

                <th className="p-4 text-left">
                  Produto
                </th>

                <th className="p-4 text-left">
                  Categoria
                </th>

                <th className="p-4 text-left">
                  Preço
                </th>

                <th className="p-4 text-left">
                  Estoque
                </th>

                <th className="p-4 text-center">
                  Estado
                </th>

                <th className="p-4 text-center">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const selected =
                  selectedProducts.includes(
                    product.id
                  )

                return (
                  <tr
                    key={product.id}
                    className={`
                      border-b
                      transition
                      ${
                        selected
                          ? "bg-red-50"
                          : "hover:bg-gray-50"
                      }
                    `}
                  >
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() =>
                          toggleProduct(product.id)
                        }
                        className="h-4 w-4"
                      />
                    </td>

                    <td className="p-4 font-semibold">
                      {product.name}
                    </td>

                    <td className="p-4">
                      {product.category ||
                        "Sem categoria"}
                    </td>

                    <td className="p-4 font-bold text-green-600">
                      {product.price ?? 0} MT
                    </td>

                    <td className="p-4">
                      {product.stock ?? 0}
                    </td>

                    <td className="p-4 text-center">
                      {product.active ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                          Ativo
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                          Inativo
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="
                            inline-flex
                            min-h-10
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            bg-blue-600
                            px-4
                            py-2
                            text-sm
                            font-bold
                            text-white
                            transition
                            hover:bg-blue-700
                          "
                        >
                          <Edit size={16} />
                          Editar
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* =================================================
            MOBILE
        ================================================= */}

        <div className="block md:hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Carregando produtos...
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhum produto encontrado.
            </div>
          ) : (
            <div className="divide-y">
              {products.map((product) => {
                const selected =
                  selectedProducts.includes(
                    product.id
                  )

                return (
                  <div
                    key={product.id}
                    className={`
                      p-4
                      transition
                      ${
                        selected
                          ? "bg-red-50"
                          : "bg-white"
                      }
                    `}
                  >
                    {/* TOPO */}

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() =>
                          toggleProduct(product.id)
                        }
                        className="mt-1 h-5 w-5 shrink-0"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="break-words font-bold text-gray-900">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {product.category ||
                            "Sem categoria"}
                        </p>
                      </div>

                      {product.active ? (
                        <span className="shrink-0 rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700">
                          Ativo
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-700">
                          Inativo
                        </span>
                      )}
                    </div>

                    {/* INFORMAÇÕES */}

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">
                          Preço
                        </p>

                        <p className="mt-1 font-bold text-green-600">
                          {product.price ?? 0} MT
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">
                          Estoque
                        </p>

                        <p className="mt-1 font-bold text-gray-900">
                          {product.stock ?? 0}
                        </p>
                      </div>
                    </div>

                    {/* BOTÃO EDITAR */}

                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="
                        mt-4
                        flex
                        min-h-12
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-blue-600
                        px-4
                        py-3
                        text-sm
                        font-bold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-blue-700
                        active:scale-[0.98]
                      "
                    >
                      <Edit size={18} />
                      Editar Produto
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* DESKTOP EMPTY */}

        {!loading &&
          products.length === 0 && (
            <div className="hidden p-10 text-center text-gray-500 md:block">
              Nenhum produto encontrado.
            </div>
          )}
      </div>
    </div>
  )
}