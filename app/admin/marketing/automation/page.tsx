"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Zap,
  ShoppingCart,
  Mail,
  Gift,
  Package,
  Users,
  Play,
  Pause,
  BarChart3,
} from "lucide-react";


const automations:any[] = [];


export default function AutomationPage(){


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

Automação de Marketing

</h1>



<p className="
text-gray-600
mt-2
">

Crie ações automáticas para aumentar vendas.

</p>


</div>








<button

className="
bg-purple-600
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

Nova Automação


</button>




</div>









{/* MÉTRICAS */}



<div className="
grid
md:grid-cols-4
gap-6
mb-8
">



<Stats

title="Automações Ativas"

value="0"

icon={<Zap size={25}/>}

/>



<Stats

title="Execuções"

value="0"

icon={<Play size={25}/>}

/>



<Stats

title="Conversões"

value="0"

icon={<BarChart3 size={25}/>}

/>



<Stats

title="Receita"

value="0 MZN"

icon={<Gift size={25}/>}

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



<h2 className="
text-xl
font-bold
text-gray-900
mb-6
">

Criar Automação Inteligente

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

Nome da automação

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

placeholder="Ex: Recuperar carrinhos"

/>


</div>







<div>


<label className="
text-gray-700
font-medium
">

Quando acontecer?

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
Carrinho abandonado
</option>


<option>
Novo cliente
</option>


<option>
Pedido entregue
</option>


<option>
Cliente VIP
</option>


<option>
Estoque baixo
</option>


</select>



</div>









<div>


<label className="
text-gray-700
font-medium
">

Esperar

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
Imediatamente
</option>


<option>
Depois de 1 hora
</option>


<option>
Depois de 24 horas
</option>


<option>
Depois de 7 dias
</option>


</select>


</div>









<div>


<label className="
text-gray-700
font-medium
">

Executar ação

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
Enviar Email
</option>


<option>
Enviar WhatsApp
</option>


<option>
Criar Cupão
</option>


<option>
Enviar Notificação
</option>


</select>


</div>







<div className="md:col-span-2">


<label className="
text-gray-700
font-medium
">

Mensagem automática

</label>


<textarea

rows={5}

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

placeholder="Escreva a mensagem..."

></textarea>


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


Salvar Automação


</button>






</div>









{/* LISTA */}



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

Automações Criadas

</h2>






<table className="w-full">


<thead className="bg-gray-50">


<tr className="
border-b
text-gray-700
">


<th className="text-left p-4">
Nome
</th>


<th>
Gatilho
</th>


<th>
Execuções
</th>


<th>
Estado
</th>


</tr>


</thead>





<tbody>


<tr>


<td

colSpan={4}

className="
text-center
py-16
text-gray-500
"

>


Nenhuma automação criada.


</td>


</tr>



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
bg-purple-100
text-purple-600
p-3
rounded-lg
">

{icon}

</div>



</div>


</div>

)

}