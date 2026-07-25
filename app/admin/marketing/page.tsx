"use client";

import Link from "next/link";

import {
  Megaphone,
  TrendingUp,
  Users,
  DollarSign,
  Plus,
  Tag,
  Mail,
  Target,
  BarChart3,
  Zap,
} from "lucide-react";



export default function MarketingPage() {


return (

<main className="min-h-screen bg-gray-100 p-8">


<div className="max-w-7xl mx-auto">



{/* HEADER */}


<div className="flex justify-between items-center mb-8">


<div>


<h1 className="text-3xl font-bold text-gray-900">
Marketing
</h1>


<p className="text-gray-600 mt-2">
Gerencie campanhas, descontos e crescimento da loja.
</p>


</div>





<Link

href="/admin/marketing/campaigns"

className="
flex
items-center
gap-2
bg-blue-600
text-white
px-5
py-3
rounded-xl
hover:bg-blue-700
"

>

<Plus size={18}/>

Nova Campanha

</Link>



</div>









{/* ESTATÍSTICAS */}



<div className="
grid
grid-cols-1
md:grid-cols-4
gap-6
mb-8
">



<StatsCard

title="Receita Marketing"

value="0 MZN"

icon={<DollarSign size={25}/>}

/>





<StatsCard

title="Campanhas Ativas"

value="0"

icon={<Megaphone size={25}/>}

/>





<StatsCard

title="Clientes Alcançados"

value="0"

icon={<Users size={25}/>}

/>





<StatsCard

title="Conversão"

value="0%"

icon={<TrendingUp size={25}/>}

/>




</div>









{/* MENU MARKETING */}



<div className="
grid
md:grid-cols-5
gap-6
mb-8
">





<CardLink

href="/admin/marketing/campaigns"

icon={<Megaphone size={25}/>}

title="Campanhas"

text="Criar e acompanhar campanhas"

/>







<CardLink

href="/admin/marketing/discounts"

icon={<Tag size={25}/>}

title="Descontos"

text="Cupons e promoções"

/>







<CardLink

href="/admin/marketing/emails"

icon={<Mail size={25}/>}

title="Email Marketing"

text="Enviar campanhas por email"

/>







<CardLink

href="/admin/marketing/segments"

icon={<Target size={25}/>}

title="Segmentos"

text="Organizar clientes"

/>









<CardLink

href="/admin/marketing/automation"

icon={<Zap size={25}/>}

title="Automação"

text="Ações automáticas inteligentes"

/>





</div>









{/* DESEMPENHO */}



<div className="
bg-white
rounded-xl
shadow
p-6
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


<BarChart3 size={24}/>


</div>




<h2 className="
text-xl
font-bold
text-gray-900
">

Desempenho das Campanhas

</h2>



</div>







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
Cliques
</th>


<th>
Vendas
</th>


<th>
Receita
</th>


<th>
Estado
</th>


</tr>


</thead>





<tbody>


<tr>


<td className="
py-6
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
0 MZN
</td>


<td className="text-center">
Inativa
</td>



</tr>



</tbody>



</table>







</div>





</div>


</main>

);


}









function StatsCard({

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









function CardLink({

href,
icon,
title,
text

}:any){


return (

<Link

href={href}

className="
bg-white
rounded-xl
shadow
p-6
hover:shadow-lg
transition
block
"

>


<div className="
bg-blue-100
text-blue-600
p-3
rounded-lg
w-fit
mb-4
">


{icon}


</div>





<h3 className="
text-lg
font-bold
text-gray-900
">

{title}

</h3>





<p className="
text-gray-600
mt-2
">

{text}

</p>



</Link>


)


}