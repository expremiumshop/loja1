"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Tag,
  Percent,
  DollarSign,
  Calendar,
  Users,
  Copy,
} from "lucide-react";


const discounts:any[] = [];


export default function DiscountsPage(){


return (

<main className="min-h-screen bg-gray-100 p-8">


<div className="max-w-7xl mx-auto">



{/* HEADER */}


<div className="flex justify-between items-center mb-8">


<div>


<Link

href="/admin/marketing"

className="
flex
items-center
gap-2
text-blue-600
mb-5
"

>

<ArrowLeft size={18}/>

Voltar Marketing

</Link>





<h1 className="
text-3xl
font-bold
text-gray-900
">

Cupons e Descontos

</h1>



<p className="
text-gray-600
mt-2
">

Crie promoções inteligentes para aumentar vendas.

</p>


</div>






<button

className="
bg-blue-600
text-white
px-5
py-3
rounded-xl
flex
items-center
gap-2
hover:bg-blue-700
"

>


<Plus size={18}/>

Novo Cupão


</button>




</div>









{/* ESTATISTICAS */}



<div className="
grid
md:grid-cols-4
gap-6
mb-8
">



<Stats

title="Cupões Ativos"

value="0"

icon={<Tag size={24}/>}

/>



<Stats

title="Usos"

value="0"

icon={<Users size={24}/>}

/>



<Stats

title="Descontos Dados"

value="0 MZN"

icon={<DollarSign size={24}/>}

/>



<Stats

title="Conversão"

value="0%"

icon={<Percent size={24}/>}

/>



</div>









{/* CRIAR CUPAO */}



<div className="
bg-white
rounded-xl
shadow
p-8
mb-8
">



<h2 className="
text-xl
font-bold
text-gray-900
mb-6
">

Criar Cupão Inteligente

</h2>






<div className="
grid
md:grid-cols-2
gap-6
">





<div>


<label className="
text-gray-700
font-medium
">

Código do Cupão

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

placeholder="Ex: GS50"

/>


</div>








<div>


<label className="
text-gray-700
font-medium
">

Tipo de desconto

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
Percentagem %
</option>


<option>
Valor fixo MZN
</option>


<option>
Frete grátis
</option>


</select>


</div>









<div>


<label className="
text-gray-700
font-medium
">

Valor

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

placeholder="50"

/>


</div>









<div>


<label className="
text-gray-700
font-medium
">

Aplicar em

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
Todos produtos
</option>


<option>
Categoria específica
</option>


<option>
Produto específico
</option>


</select>



</div>









<div>


<label className="
text-gray-700
font-medium
">

Limite de utilização

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

placeholder="100"

/>



</div>








<div>


<label className="
text-gray-700
font-medium
">

Data de validade

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
font-semibold
"

>


Criar Cupão


</button>






</div>









{/* LISTA */}



<div className="
bg-white
rounded-xl
shadow
overflow-hidden
">



<table className="w-full">


<thead className="bg-gray-50">


<tr className="
border-b
text-gray-700
">


<th className="text-left p-4">
Código
</th>


<th>
Tipo
</th>


<th>
Valor
</th>


<th>
Usos
</th>


<th>
Estado
</th>


<th>
Copiar
</th>


</tr>


</thead>





<tbody>


{
discounts.length===0 ? (


<tr>


<td

colSpan={6}

className="
text-center
py-16
text-gray-500
"

>


Nenhum cupão criado.


</td>


</tr>



):(


discounts.map((item:any)=>(


<tr key={item.id}>


<td>
{item.code}
</td>


</tr>


))


)


}



</tbody>



</table>





</div>








</div>


</main>


);

}







function Stats({

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