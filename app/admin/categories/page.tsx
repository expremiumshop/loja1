import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default async function CategoriesPage() {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Categorias</h1>

        <Link
          href="/admin/categories/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
        >
          + Adicionar Categoria
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden border">
        <table className="w-full">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-4 text-left">Nome</th>
              <th className="p-4 text-left">Slug</th>
              <th className="p-4 text-left">Estado</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>

          <tbody>
            {error && (
              <tr>
                <td colSpan={4} className="p-6 text-red-600">
                  Erro ao carregar categorias.
                </td>
              </tr>
            )}

            {!error && (!categories || categories.length === 0) && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  Nenhuma categoria encontrada.
                </td>
              </tr>
            )}

            {categories?.map((category) => (
              <tr key={category.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{category.name}</td>
                <td className="p-4">{category.slug}</td>
                <td className="p-4">
                  {category.active ? "Ativa" : "Inativa"}
                </td>
                <td className="p-4 text-center">
                  <Link
                    href={`/admin/categories/${category.id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg mr-2"
                  >
                    Editar
                  </Link>

                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    disabled
                  >
                    Apagar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
