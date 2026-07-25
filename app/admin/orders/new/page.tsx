"use client";

import Link from "next/link";
import { ArrowLeft, Plus, User, Package } from "lucide-react";

export default function NewOrderPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">

          <Link
            href="/admin/orders"
            className="flex items-center gap-2 text-blue-600 font-medium mb-5"
          >
            <ArrowLeft size={18} />
            Voltar para pedidos
          </Link>


          <h1 className="text-3xl font-bold text-gray-900">
            Criar Pedido
          </h1>


          <p className="text-gray-600 mt-2">
            Crie um pedido manualmente para um cliente.
          </p>

        </div>



        <div className="grid lg:grid-cols-3 gap-8">


          {/* INFORMAÇÕES */}

          <div className="lg:col-span-2 space-y-6">


            <div className="bg-white rounded-xl shadow p-6">


              <div className="flex items-center gap-3 mb-6">

                <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                  <User size={22}/>
                </div>


                <h2 className="text-xl font-bold text-gray-900">
                  Cliente
                </h2>

              </div>



              <label className="text-gray-700 font-medium">
                Nome do Cliente
              </label>


              <input
                className="mt-2 w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white"
                placeholder="Digite o nome"
              />



              <label className="block mt-5 text-gray-700 font-medium">
                Email
              </label>


              <input
                className="mt-2 w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white"
                placeholder="cliente@email.com"
              />



              <label className="block mt-5 text-gray-700 font-medium">
                Telefone
              </label>


              <input
                className="mt-2 w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white"
                placeholder="+258..."
              />



              <label className="block mt-5 text-gray-700 font-medium">
                Endereço
              </label>


              <textarea

                rows={4}

                className="mt-2 w-full border border-gray-300 rounded-lg p-3 text-gray-900 bg-white"

                placeholder="Endereço de entrega"

              />



            </div>




            <div className="bg-white rounded-xl shadow p-6">


              <div className="flex items-center gap-3 mb-6">

                <div className="bg-green-100 text-green-600 p-3 rounded-lg">

                  <Package size={22}/>

                </div>


                <h2 className="text-xl font-bold text-gray-900">
                  Produtos
                </h2>


              </div>



              <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg">

                <Plus size={18}/>

                Adicionar Produto

              </button>



              <div className="mt-6 text-gray-600">

                Nenhum produto adicionado.

              </div>



            </div>


          </div>





          {/* RESUMO */}

          <div>


            <div className="bg-white rounded-xl shadow p-6">


              <h2 className="text-xl font-bold text-gray-900 mb-6">

                Resumo do Pedido

              </h2>



              <div className="space-y-4">


                <div className="flex justify-between">

                  <span className="text-gray-700">
                    Subtotal
                  </span>


                  <span className="text-gray-900 font-medium">
                    0 MZN
                  </span>

                </div>



                <div className="flex justify-between">

                  <span className="text-gray-700">
                    Entrega
                  </span>


                  <span className="text-gray-900 font-medium">
                    0 MZN
                  </span>

                </div>



                <hr/>



                <div className="flex justify-between">

                  <span className="font-bold text-gray-900">
                    Total
                  </span>


                  <span className="font-bold text-gray-900">
                    0 MZN
                  </span>

                </div>



              </div>



              <button className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl">

                Criar Pedido

              </button>



            </div>


          </div>


        </div>


      </div>


    </main>
  );
}