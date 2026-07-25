"use client";

import Link from "next/link";
import {
  Users,
  UserPlus,
  ShoppingBag,
  DollarSign,
  Search,
  Eye,
  Pencil,
  Download,
} from "lucide-react";


const customers = [];


export default function CustomersPage() {


  return (

    <main className="min-h-screen bg-gray-100 p-8">


      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">


        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            Clientes
          </h1>


          <p className="text-gray-600 mt-2">
            Gerencie todos os clientes da sua loja.
          </p>

        </div>



        <div className="flex gap-3">


          <button
          className="
          flex items-center gap-2
          bg-white
          border
          text-gray-900
          px-5
          py-3
          rounded-xl
          hover:bg-gray-50
          "
          >

            <Download size={18}/>

            Exportar

          </button>




          <Link

          href="/admin/customers/new"

          className="
          flex items-center gap-2
          bg-blue-600
          text-white
          px-5
          py-3
          rounded-xl
          hover:bg-blue-700
          "

          >

            <UserPlus size={18}/>

            Novo Cliente

          </Link>



        </div>



      </div>





      {/* ESTATISTICAS */}


      <div className="
      grid
      grid-cols-1
      md:grid-cols-4
      gap-6
      mb-8
      ">



        <StatsCard

        title="Total Clientes"

        value="0"

        icon={<Users size={25}/>}

        color="blue"

        />



        <StatsCard

        title="Novos Hoje"

        value="0"

        icon={<UserPlus size={25}/>}

        color="green"

        />



        <StatsCard

        title="Pedidos"

        value="0"

        icon={<ShoppingBag size={25}/>}

        color="purple"

        />



        <StatsCard

        title="Valor Total"

        value="0 MZN"

        icon={<DollarSign size={25}/>}

        color="orange"

        />



      </div>







      {/* PESQUISA */}


      <div className="bg-white rounded-xl shadow p-5 mb-6">


        <div className="relative">


          <Search

          className="
          absolute
          left-3
          top-3.5
          text-gray-500
          "

          size={18}

          />


          <input

          placeholder="
          Pesquisar por nome, email ou telefone...
          "

          className="
          w-full
          border
          border-gray-300
          rounded-lg
          py-3
          pl-10
          pr-4
          text-gray-900
          bg-white
          "

          />


        </div>


      </div>








      {/* TABELA */}



      <div className="
      bg-white
      rounded-xl
      shadow
      overflow-hidden
      ">


        <table className="w-full">



          <thead className="bg-gray-50">


            <tr className="text-left text-gray-700">


              <th className="p-4">
                Cliente
              </th>


              <th>
                Email
              </th>


              <th>
                Pedidos
              </th>


              <th>
                Total Gasto
              </th>


              <th>
                Estado
              </th>


              <th>
                Ações
              </th>


            </tr>


          </thead>






          <tbody>



          {
            customers.length === 0 ? (


              <tr>


                <td

                colSpan={6}

                className="
                text-center
                py-16
                text-gray-500
                "

                >

                  Ainda não existem clientes.


                </td>



              </tr>



            ) : (


              customers.map((customer:any)=>(


                <tr key={customer.id}>


                  <td>
                    {customer.name}
                  </td>


                </tr>


              ))



            )

          }





          </tbody>




        </table>



      </div>






    </main>


  );


}







function StatsCard({

title,

value,

icon,

color

}:any){



const colors:any={


blue:
"bg-blue-100 text-blue-600",


green:
"bg-green-100 text-green-600",


purple:
"bg-purple-100 text-purple-600",


orange:
"bg-orange-100 text-orange-600",


};




return (


<div className="
bg-white
rounded-xl
shadow
p-6
">


<div className="
flex
justify-between
items-center
">



<div>


<p className="
text-gray-600
">

{title}

</p>




<h2 className="
text-3xl
font-bold
text-gray-900
mt-2
">

{value}

</h2>



</div>





<div className={`p-3 rounded-xl ${colors[color]}`}>

{icon}

</div>




</div>


</div>


);



}