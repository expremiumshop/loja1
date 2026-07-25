"use client"

import {
  Users,
  Package,
  DollarSign,
  Eye,
  TrendingUp,
  ShoppingCart,
  BarChart3
} from "lucide-react"


export default function AdminPage() {


const stats = {

receita:"0 MZN",
pedidos:0,
clientes:0,
produtos:3,
visitantes:0,
conversao:"0%",
vendasHoje:0

}



return (

<div className="min-h-screen bg-gray-100">


{/* CONTEÚDO DASHBOARD */}

<h1 className="text-3xl font-bold text-gray-900 mb-8">
Dashboard
</h1>





{/* CARTÕES PRINCIPAIS */}


<div className="grid grid-cols-1 md:grid-cols-4 gap-6">



<Card
title="Receita Total"
value={stats.receita}
icon={<DollarSign size={28}/>}
/>



<Card
title="Pedidos"
value={stats.pedidos}
icon={<ShoppingCart size={28}/>}
/>



<Card
title="Clientes"
value={stats.clientes}
icon={<Users size={28}/>}
/>



<Card
title="Produtos"
value={stats.produtos}
icon={<Package size={28}/>}
/>



</div>







{/* MÉTRICAS */}


<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">


<Metric
title="Visitantes"
value={stats.visitantes}
icon={<Eye size={25}/>}
/>



<Metric
title="Taxa de Conversão"
value={stats.conversao}
icon={<TrendingUp size={25}/>}
/>



<Metric
title="Vendas Hoje"
value={stats.vendasHoje}
icon={<BarChart3 size={25}/>}
/>



</div>








{/* GRÁFICO */}


<div className="bg-white rounded-xl shadow p-6 mt-8">


<h2 className="text-xl font-bold text-gray-900 mb-6">
Vendas dos últimos 30 dias
</h2>



<div className="h-48 flex items-end gap-3">


{
[0,0,0,0,0,0,0].map((x,i)=>(

<div

key={i}

style={{
height:`${x}%`
}}

className="bg-blue-600 flex-1 rounded-t-lg"

/>

))
}


</div>


</div>








{/* PEDIDOS */}


<div className="bg-white rounded-xl shadow p-6 mt-8">


<h2 className="text-xl font-bold text-gray-900 mb-6">
Últimos pedidos
</h2>




<table className="w-full">


<thead>


<tr className="border-b text-gray-700">


<th className="text-left py-3">
Cliente
</th>


<th className="text-left">
Produto
</th>


<th className="text-left">
Valor
</th>


<th className="text-left">
Estado
</th>


</tr>


</thead>





<tbody>


<tr className="border-b text-gray-900">


<td className="py-3">
Nenhum pedido
</td>


<td>
-
</td>


<td>
0 MZN
</td>


<td>
Aguardando
</td>


</tr>


</tbody>


</table>


</div>



</div>

)

}








function Card({
title,
value,
icon
}:any){


return (

<div className="bg-white p-6 rounded-xl shadow">


<div className="flex justify-between">


<div>


<p className="text-gray-700">
{title}
</p>



<h2 className="text-3xl font-bold text-gray-900">
{value}
</h2>


</div>



<div className="bg-blue-100 text-blue-600 p-3 rounded-lg">

{icon}

</div>


</div>


</div>


)

}








function Metric({
title,
value,
icon
}:any){


return (

<div className="bg-white p-6 rounded-xl shadow">


<div className="flex items-center gap-4">


<div className="bg-green-100 text-green-600 p-3 rounded-lg">

{icon}

</div>



<div>


<p className="text-gray-700">
{title}
</p>



<h3 className="text-2xl font-bold text-gray-900">
{value}
</h3>



</div>


</div>


</div>


)

}