"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Send,
  Users,
  MousePointerClick,
  DollarSign,
  Plus,
  Calendar,
} from "lucide-react";


export default function EmailMarketingPage(){


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

Email Marketing

</h1>


<p className="
text-gray-600
mt-2
">

Crie campanhas de email e aumente as vendas.

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

Nova Campanha


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

title="Emails Enviados"

value="0"

icon={<Send size={24}/>}

/>




<Metric

title="Clientes"

value="0"

icon={<Users size={24}/>}

/>




<Metric

title="Abertura"

value="0%"

icon={<Mail size={24}/>}

/>




<Metric

title="Receita"

value="0 MZN"

icon={<DollarSign size={24}/>}

/>




</div>









{/* CRIADOR */}



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

<Mail size={24}/>

</div>



<h2 className="
text-xl
font-bold
text-gray-900
">

Criar Campanha de Email

</h2>



</div>









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

Nome da campanha

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

placeholder="Ex: Promoção de Julho"

/>


</div>








<div>


<label className="
text-gray-700
font-medium
">

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







<div className="md:col-span-2">


<label className="
text-gray-700
font-medium
">

Assunto do email

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

placeholder="Oferta especial para você"

/>



</div>









<div className="md:col-span-2">


<label className="
text-gray-700
font-medium
">

Mensagem

</label>



<textarea

rows={8}

className="
mt-2
w-full
border
border-gray-300
rounded-lg
p-4
text-gray-900
bg-white
"

placeholder="Escreva a mensagem do email..."

>


</textarea>



</div>







<div>


<label className="
text-gray-700
font-medium
">

Enviar quando

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
Enviar agora
</option>


<option>
Agendar envio
</option>


</select>


</div>




<div>


<label className="
text-gray-700
font-medium
">

Data de envio

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
font-semibold
"

>


<Send size={18}/>

Enviar Campanha


</button>





</div>









{/* HISTÓRICO */}



<div className="
bg-white
rounded-xl
shadow
overflow-hidden
">


<h2 className="
text-xl
font-bold
text-gray-900
p-6
">

Histórico de Campanhas

</h2>





<table className="w-full">


<thead className="bg-gray-50">


<tr className="
border-b
text-gray-700
">


<th className="text-left p-4">
Campanha
</th>


<th>
Enviados
</th>


<th>
Abertura
</th>


<th>
Cliques
</th>


<th>
Receita
</th>


</tr>


</thead>





<tbody>


<tr>


<td

colSpan={5}

className="
text-center
py-16
text-gray-500
"

>


Nenhuma campanha enviada.


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