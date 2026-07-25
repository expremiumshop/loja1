"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Plus,
  Target,
  Users,
  Megaphone,
  Calendar,
  DollarSign,
  TrendingUp,
  BarChart3,
} from "lucide-react";


export default function CampaignsPage() {


return (

<main className="min-h-screen bg-gray-100 p-8">


<div className="max-w-7xl mx-auto">



{/* HEADER */}


<div className="flex justify-between items-center mb-8">


<div>


<Link
href="/admin/marketing"
className="flex items-center gap-2 text-blue-600 mb-5"
>

<ArrowLeft size={18}/>

Voltar Marketing

</Link>



<h1 className="text-3xl font-bold text-gray-900">

Marketing Intelligence

</h1>


<p className="text-gray-600 mt-2">

Crie campanhas inteligentes para aumentar as vendas.

</p>


</div>





<button

className="
flex
items-center
gap-2
bg-purple-600
text-white
px-5
py-3
rounded-xl
hover:bg-purple-700
"

>


<Sparkles size={18}/>


Criar Campanha com IA


</button>



</div>









{/* MÉTRICAS */}



<div className="
grid
md:grid-cols-4
gap-6
mb-8
">



<Metric

title="Campanhas Ativas"

value="0"

icon={<Megaphone size={25}/>}

/>



<Metric

title="Clientes Alcançados"

value="0"

icon={<Users size={25}/>}

/>



<Metric

title="Conversão"

value="0%"

icon={<TrendingUp size={25}/>}

/>



<Metric

title="Receita Gerada"

value="0 MZN"

icon={<DollarSign size={25}/>}

/>



</div>









{/* CRIADOR DE CAMPANHA */}



<div className="
bg-white
rounded-xl
shadow
p-8
mb-8
">


<div className="
flex
items-center
gap-3
mb-8
">


<div className="
bg-blue-100
text-blue-600
p-3
rounded-lg
">

<Target size={24}/>

</div>


<h2 className="
text-xl
font-bold
text-gray-900
">

Criador de Campanha

</h2>



</div>









<div className="
grid
md:grid-cols-2
gap-6
">





<div>


<label className="text-gray-700 font-medium">

Nome da Campanha

</label>


<input

className="
mt-2
w-full
border
border-gray-300
rounded-lg
p-3
text-gray-900
bg-white
"

placeholder="Ex: Black Friday GS"

/>


</div>







<div>


<label className="text-gray-700 font-medium">

Objetivo

</label>


<select

className="
mt-2
w-full
border
border-gray-300
rounded-lg
p-3
text-gray-900
bg-white
"

>


<option>
Aumentar vendas
</option>


<option>
Ganhar clientes
</option>


<option>
Recuperar clientes
</option>


<option>
Limpar estoque
</option>


<option>
Lançamento de produto
</option>


</select>


</div>







<div>


<label className="text-gray-700 font-medium">

Canal

</label>



<select

className="
mt-2
w-full
border
border-gray-300
rounded-lg
p-3
text-gray-900
bg-white
"

>


<option>
Loja Online
</option>


<option>
WhatsApp
</option>


<option>
Email
</option>


<option>
Facebook Ads
</option>


<option>
Instagram Ads
</option>


<option>
Google Ads
</option>


<option>
TikTok Ads
</option>


</select>


</div>







<div>


<label className="text-gray-700 font-medium">

Público

</label>



<select

className="
mt-2
w-full
border
border-gray-300
rounded-lg
p-3
text-gray-900
bg-white
"

>


<option>
Todos clientes
</option>


<option>
Clientes VIP
</option>


<option>
Clientes novos
</option>


<option>
Clientes inativos
</option>


<option>
Abandonaram carrinho
</option>


</select>



</div>







<div>


<label className="text-gray-700 font-medium">

Orçamento

</label>


<input

type="number"

className="
mt-2
w-full
border
border-gray-300
rounded-lg
p-3
text-gray-900
bg-white
"

placeholder="0 MZN"

/>


</div>








<div>


<label className="text-gray-700 font-medium">

Data da Campanha

</label>



<input

type="date"

className="
mt-2
w-full
border
border-gray-300
rounded-lg
p-3
text-gray-900
bg-white
"

/>


</div>





</div>






<button

className="
mt-8
bg-blue-600
text-white
px-8
py-3
rounded-xl
flex
items-center
gap-2
"

>


<Plus size={18}/>


Criar Campanha


</button>




</div>









{/* PERFORMANCE */}



<div className="
bg-white
rounded-xl
shadow
p-6
">



<h2 className="
text-xl
font-bold
text-gray-900
mb-6
">

Performance das Campanhas

</h2>





<table className="w-full">


<thead>


<tr className="
border-b
text-gray-700
">


<th className="text-left py-3">
Campanha
</th>


<th>
Visualizações
</th>


<th>
Cliques
</th>


<th>
Vendas
</th>


<th>
Receita
</th>


</tr>


</thead>





<tbody>


<tr>


<td className="
py-8
text-gray-500
">

Nenhuma campanha criada.

</td>


<td className="text-center">
0
</td>


<td className="text-center">
0
</td>


<td className="text-center">
0
</td>


<td className="text-center">
0 MZN
</td>



</tr>


</tbody>



</table>





</div>








</div>


</main>


);


}









function Metric({

title,
value,
icon

}:any){



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



<div className="
bg-blue-100
text-blue-600
p-3
rounded-lg
">

{icon}

</div>


</div>


</div>

)

}