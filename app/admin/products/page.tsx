import Link from "next/link"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export default async function ProductsAdminPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="mx-auto max-w-7xl">
      {/* HEADER */}
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Gestão de Produtos
          </h1>

          <p className="mt-2 text-gray-600">
            Controle produtos, categorias, estoque e vendas da loja.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* CATEGORIAS */}
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            <span className="text-white">📂</span>
            <span className="text-white">Categorias</span>
          </Link>

          {/* NOVA CATEGORIA */}
          <Link
            href="/admin/categories/new"
            className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            + Nova Categoria
          </Link>

          {/* NOVO PRODUTO */}
          <Link
            href="/admin/products/new"
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            + Novo Produto
          </Link>
        </div>
      </div>

      {/* ERRO */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-100 p-4 text-red-700">
          <p className="font-semibold">Erro ao carregar produtos:</p>

          <br />

          {error.message.includes("fetch failed")
            ? "Não foi possível ligar ao Supabase. Verifique o URL e a chave API no ficheiro .env.local."
            : error.message}
        </div>
      )}

      {/* ESTATÍSTICAS */}
      <div className="mb-8 grid gap-5 md:grid-cols-3">
        {/* TOTAL PRODUTOS */}
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">Total Produtos</p>

          <h2 className="text-3xl font-bold">
            {products?.length || 0}
          </h2>
        </div>

        {/* PRODUTOS ATIVOS */}
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">Produtos Ativos</p>

          <h2 className="text-3xl font-bold text-green-600">
            {products?.filter((item) => item.active).length || 0}
          </h2>
        </div>

        {/* CATEGORIAS */}
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">Categorias</p>

          <Link
            href="/admin/categories"
            className="text-3xl font-bold text-blue-600 hover:text-blue-700"
          >
            Ver
          </Link>
        </div>
      </div>

      {/* TABELA */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 text-white">
              <tr>
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
              {products?.map((product) => (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50"
                >
                  {/* PRODUTO */}
                  <td className="p-4 font-semibold">
                    {product.name}
                  </td>

                  {/* CATEGORIA */}
                  <td className="p-4">
                    {product.category || "Sem categoria"}
                  </td>

                  {/* PREÇO */}
                  <td className="p-4 font-bold text-green-600">
                    {product.price} MT
                  </td>

                  {/* ESTOQUE */}
                  <td className="p-4">
                    {product.stock || 0}
                  </td>

                  {/* ESTADO */}
                  <td className="p-4 text-center">
                    {product.active ? (
                      <span className="font-semibold text-green-600">
                        Ativo
                      </span>
                    ) : (
                      <span className="font-semibold text-red-600">
                        Inativo
                      </span>
                    )}
                  </td>

                  {/* AÇÕES */}
                  <td className="p-4 text-center">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Editar Produto
                    </Link>
                  </td>
                </tr>
              ))}

              {/* NENHUM PRODUTO */}
              {!products?.length && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-gray-500"
                  >
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}