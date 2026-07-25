"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Crown,
  UserPlus,
  UserX,
  ShoppingCart,
  Plus,
  Send,
  Filter,
} from "lucide-react";


const segments = [
  {
    name:"Clientes VIP",
    description:"Clientes com alto volume de compras",
    customers:0,
    icon:<Crown size={25}/>
  },

  {
    name:"Clientes Novos",
    description:"Primeira compra nos últimos 30 dias",
    customers:0,
    icon:<UserPlus size={25}/>
  },

  {
    name:"Clientes Inativos",
    description:"Sem compras há mais de 90 dias",
    customers:0,
    icon:<UserX size={25}/>
  },

  {
    name:"Carrinho Abandonado",
    description:"Adicionaram produtos e não compraram",
    customers:0,
    icon:<ShoppingCart size={25}/>
  }
];



export default function SegmentsPage(){


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

Segmentação Inteligente

</h1>


<p className="
text-gray-600
mt-2
">

Organize clientes e crie campanhas personalizadas.

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
"

>


<Plus size={18}/>

Criar Segmento


</button>



</div>









{/* RESUMO */}



<div className="
grid
md:grid-cols-4
gap-6
mb-8
">



<Stats

title="Total Clientes"

value="0"

icon={<Users size={25}/>}

/>




<Stats

title="VIP"

value="0"

icon={<Crown size={25}/>}

/>




<Stats

title="Inativos"

value="0"

icon={<UserX size={25}/>}

/>




<Stats

title="Carrinhos"

value="0"

icon={<ShoppingCart size={25}/>}

/>




</div>









{/* SEGMENTOS */}



<div className="
grid
md:grid-cols-2
gap-6
">



{

segments.map((segment,index)=>(


<div

key={index}

className="
bg-white
rounded-xl
shadow
p-6
"


>


<div className="
flex
justify-between
items-center
mb-5
">



<div className="
bg-blue-100
text-blue-600
p-3
rounded-lg
">

{segment.icon}

</div>





<button

className="
text-blue-600
flex
items-center
gap-2
text-sm
"

>


<Send size={16}/>

Enviar Campanha


</button>



</div>








<h2 className="
text-xl
font-bold
text-gray-900
">

{segment.name}

</h2>




<p className="
text-gray-600
mt-2
">

{segment.description}

</p>






<div className="
mt-5
flex
justify-between
items-center
">


<span className="
text-gray-500
">

Clientes

</span>


<strong className="
text-2xl
text-gray-900
">

{segment.customers}

</strong>



</div>





</div>



))


}



</div>









{/* FILTRO AVANÇADO */}



<div className="
bg-white
rounded-xl
shadow
p-8
mt-8
">



<div className="
flex
items-center
gap-3
mb-6
">


<div className="
bg-purple-100
text-purple-600
p-3
rounded-lg
">

<Filter size={22}/>

</div>



<h2 className="
text-xl
font-bold
text-gray-900
">

Criar Segmento Personalizado

</h2>


</div>








<div className="
grid
md:grid-cols-3
gap-5
">



<select

className="
border
border-gray-300
rounded-lg
p-3
text-gray-900
bg-white
"

>


<option>
Valor gasto
</option>


<option>
Número de compras
</option>


<option>
Última compra
</option>


<option>
Localização
</option>


</select>







<select

className="
border
border-gray-300
rounded-lg
p-3
text-gray-900
bg-white
"

>


<option>
Maior que
</option>


<option>
Menor que
</option>


<option>
Igual
</option>


</select>







<input

className="
border
border-gray-300
rounded-lg
p-3
text-gray-900
bg-white
"

placeholder="Valor ou condição"

/>




</div>






<button

className="
mt-6
bg-purple-600
text-white
px-7
py-3
rounded-xl
"

>


Salvar Segmento


</button>




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