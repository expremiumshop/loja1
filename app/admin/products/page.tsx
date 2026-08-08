import Link from "next/link"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export default async function ProductsAdminPage() {

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })


  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-7xl mx-auto">


        {/* HEADER */}

        <div className="flex flex-col lg:flex-row justify-between gap-5 mb-8">


          <div>

            <h1 className="text-4xl font-bold text-gray-900">
              Gestão de Produtos
            </h1>

            <p className="text-gray-600 mt-2">
              Controle produtos, categorias, estoque e vendas da loja.
            </p>

          </div>



          <div className="flex flex-wrap gap-3">


            <Link
              href="/admin/categories"
              className="
              bg-gray-900
              text-white
              px-5
              py-3
              rounded-lg
              font-semibold
              hover:bg-gray-800
              "
            >
              📂 Gerir Categorias
            </Link>



            <Link
              href="/admin/categories/new"
              className="
              bg-green-600
              text-white
              px-5
              py-3
              rounded-lg
              font-semibold
              hover:bg-green-700
              "
            >
              + Nova Categoria
            </Link>



            <Link
              href="/admin/products/new"
              className="
              bg-blue-600
              text-white
              px-5
              py-3
              rounded-lg
              font-semibold
              hover:bg-blue-700
              "
            >
              + Novo Produto
            </Link>


          </div>


        </div>





        {/* ERRO */}

        {error && (
          <div className="
          bg-red-100
          border
          border-red-300
          text-red-700
          p-4
          rounded-lg
          mb-6
          ">
            Erro ao carregar produtos:
            <br />
            {error.message.includes("fetch failed")
              ? "Não foi possível ligar ao Supabase. Verifique o URL e a chave API no ficheiro .env.local."
              : error.message}
          </div>
        )}







        {/* ESTATISTICAS */}


        <div className="
        grid
        md:grid-cols-3
        gap-5
        mb-8
        ">


          <div className="
          bg-white
          rounded-xl
          shadow
          p-6
          ">

            <p className="text-gray-500">
              Total Produtos
            </p>

            <h2 className="text-3xl font-bold">
              {products?.length || 0}
            </h2>

          </div>




          <div className="
          bg-white
          rounded-xl
          shadow
          p-6
          ">

            <p className="text-gray-500">
              Produtos Ativos
            </p>

            <h2 className="text-3xl font-bold text-green-600">

              {
                products?.filter(
                  (item)=>item.active
                ).length || 0
              }

            </h2>

          </div>





          <div className="
          bg-white
          rounded-xl
          shadow
          p-6
          ">

            <p className="text-gray-500">
              Categorias
            </p>

            <Link
              href="/admin/categories"
              className="
              text-3xl
              font-bold
              text-blue-600
              "
            >

              Ver

            </Link>


          </div>



        </div>









        {/* TABELA */}


        <div className="
        bg-white
        rounded-xl
        shadow-lg
        overflow-hidden
        border
        ">


          <table className="w-full">


            <thead className="
            bg-gray-900
            text-white
            ">


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


            {products?.map((product)=>(


              <tr
              key={product.id}
              className="
              border-b
              hover:bg-gray-50
              "
              >



                <td className="
                p-4
                font-semibold
                ">

                  {product.name}

                </td>




                <td className="p-4">

                  {product.category || "Sem categoria"}

                </td>




                <td className="
                p-4
                text-green-600
                font-bold
                ">

                  {product.price} MT

                </td>





                <td className="p-4">

                  {product.stock || 0}

                </td>





                <td className="p-4 text-center">


                  {
                    product.active ? (

                      <span className="
                      text-green-600
                      font-semibold
                      ">

                        Ativo

                      </span>

                    ) : (

                      <span className="
                      text-red-600
                      font-semibold
                      ">

                        Inativo

                      </span>

                    )
                  }


                </td>





                <td className="p-4 text-center">


                  <Link

                  href={`/products/${product.slug}`}

                  className="
                  text-blue-600
                  hover:underline
                  "

                  >

                    Ver produto

                  </Link>


                </td>



              </tr>


            ))}





            {!products?.length && (

              <tr>

                <td
                colSpan={6}
                className="
                p-8
                text-center
                text-gray-500
                "
                >

                  Nenhum produto encontrado.

                </td>


              </tr>

            )}



            </tbody>



          </table>



        </div>


      </div>


    </main>
  )
}
