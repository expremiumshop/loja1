import Link from "next/link"
import { supabase } from "@/lib/supabase"
import {
  Folder,
  Package,
  Edit,
  Eye,
  Plus,
} from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
  // =====================================================
  // CARREGAR CATEGORIAS
  // =====================================================

  const {
    data: categories,
    error: categoriesError,
  } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", {
      ascending: false,
    })

  // =====================================================
  // CARREGAR PRODUTOS
  // =====================================================

  const {
    data: products,
    error: productsError,
  } = await supabase
    .from("products")
    .select(
      "id, name, category, price, stock, active"
    )
    .order("created_at", {
      ascending: false,
    })

  // =====================================================
  // FUNÇÃO PARA CONTAR PRODUTOS
  // =====================================================

  function getProductCount(categoryName: string) {
    return (
      products?.filter(
        (product) =>
          product.category === categoryName
      ).length || 0
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* =================================================
            CABEÇALHO
        ================================================= */}

        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              Categorias
            </h1>

            <p className="mt-1 text-sm text-gray-600 sm:text-base">
              Gerencie categorias e veja os produtos
              de cada categoria.
            </p>
          </div>

          <Link
            href="/admin/categories/new"
            className="
              inline-flex
              min-h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-5
              py-3
              text-sm
              font-bold
              text-white
              transition
              hover:bg-blue-700
              sm:w-auto
            "
          >
            <Plus size={18} />
            Adicionar Categoria
          </Link>
        </div>

        {/* =================================================
            ERRO
        ================================================= */}

        {categoriesError && (
          <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-bold">
              Erro ao carregar categorias
            </p>

            <p className="mt-1 break-words">
              {categoriesError.message}
            </p>
          </div>
        )}

        {productsError && (
          <div className="mb-6 rounded-xl border border-orange-300 bg-orange-50 p-4 text-sm text-orange-700">
            <p className="font-bold">
              Não foi possível carregar os produtos.
            </p>

            <p className="mt-1 break-words">
              {productsError.message}
            </p>
          </div>
        )}

        {/* =================================================
            RESUMO
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Folder size={22} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Total de categorias
                </p>

                <p className="text-2xl font-bold text-gray-900">
                  {categories?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <Package size={22} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Total de produtos
                </p>

                <p className="text-2xl font-bold text-gray-900">
                  {products?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            PC — TABELA
        ================================================= */}

        <div className="hidden overflow-hidden rounded-xl border bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="p-4 text-left">
                    Categoria
                  </th>

                  <th className="p-4 text-left">
                    Slug
                  </th>

                  <th className="p-4 text-center">
                    Produtos
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
                {!categoriesError &&
                  categories?.map((category) => {
                    const productCount =
                      getProductCount(
                        category.name
                      )

                    return (
                      <tr
                        key={category.id}
                        className="border-b transition hover:bg-gray-50"
                      >
                        {/* CATEGORIA */}

                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                              <Folder size={20} />
                            </div>

                            <span className="font-bold text-gray-900">
                              {category.name}
                            </span>
                          </div>
                        </td>

                        {/* SLUG */}

                        <td className="p-4 text-sm text-gray-500">
                          {category.slug}
                        </td>

                        {/* PRODUTOS */}

                        <td className="p-4 text-center">
                          <Link
                            href={`/admin/categories/${category.id}`}
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-lg
                              bg-blue-100
                              px-3
                              py-2
                              text-sm
                              font-bold
                              text-blue-700
                              hover:bg-blue-200
                            "
                          >
                            <Package size={16} />

                            {productCount}
                          </Link>
                        </td>

                        {/* ESTADO */}

                        <td className="p-4 text-center">
                          {category.active ? (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                              Ativa
                            </span>
                          ) : (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                              Inativa
                            </span>
                          )}
                        </td>

                        {/* AÇÕES */}

                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/admin/categories/${category.id}`}
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
                                hover:bg-blue-700
                              "
                            >
                              <Eye size={16} />
                              Produtos
                            </Link>

                            <Link
                              href={`/admin/categories/${category.id}`}
                              className="
                                inline-flex
                                min-h-10
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                bg-yellow-500
                                px-4
                                py-2
                                text-sm
                                font-bold
                                text-white
                                hover:bg-yellow-600
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

          {!categoriesError &&
            (!categories ||
              categories.length === 0) && (
              <div className="p-10 text-center text-gray-500">
                Nenhuma categoria encontrada.
              </div>
            )}
        </div>

        {/* =================================================
            CELULAR — CARTÕES
        ================================================= */}

        <div className="space-y-4 md:hidden">
          {!categoriesError &&
            categories?.map((category) => {
              const productCount =
                getProductCount(category.name)

              return (
                <div
                  key={category.id}
                  className="rounded-xl border bg-white p-4 shadow-sm"
                >
                  {/* CABEÇALHO */}

                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                      <Folder size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="break-words font-bold text-gray-900">
                        {category.name}
                      </h2>

                      <p className="mt-1 break-all text-xs text-gray-500">
                        {category.slug}
                      </p>
                    </div>

                    {category.active ? (
                      <span className="shrink-0 rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700">
                        Ativa
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-700">
                        Inativa
                      </span>
                    )}
                  </div>

                  {/* PRODUTOS */}

                  <div className="mt-4 rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package
                          size={19}
                          className="text-blue-600"
                        />

                        <span className="text-sm font-semibold text-gray-700">
                          Produtos
                        </span>
                      </div>

                      <span className="text-xl font-bold text-gray-900">
                        {productCount}
                      </span>
                    </div>
                  </div>

                  {/* BOTÕES */}

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="
                        inline-flex
                        min-h-11
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-blue-600
                        px-3
                        py-2
                        text-xs
                        font-bold
                        text-white
                        hover:bg-blue-700
                      "
                    >
                      <Eye size={16} />
                      Ver Produtos
                    </Link>

                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="
                        inline-flex
                        min-h-11
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-yellow-500
                        px-3
                        py-2
                        text-xs
                        font-bold
                        text-white
                        hover:bg-yellow-600
                      "
                    >
                      <Edit size={16} />
                      Editar
                    </Link>
                  </div>
                </div>
              )
            })}

          {!categoriesError &&
            (!categories ||
              categories.length === 0) && (
              <div className="rounded-xl bg-white p-10 text-center text-gray-500">
                Nenhuma categoria encontrada.
              </div>
            )}
        </div>
      </div>
    </main>
  )
}