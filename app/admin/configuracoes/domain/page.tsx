"use client";

import { Globe, AlertCircle, CheckCircle } from "lucide-react";


export default function DomainPage(){


return (

<main className="min-h-screen bg-white p-8">


<div className="max-w-4xl mx-auto">


<h1 className="text-3xl font-bold text-gray-900">
🌐 Domínio da Loja
</h1>


<p className="text-gray-600 mt-2 mb-8">
Conecte um domínio personalizado para a sua loja.
</p>



<div className="
bg-white
border
border-gray-200
rounded-2xl
shadow-sm
p-6
mb-6
">


<div className="flex items-center gap-3 mb-5">


<div className="
bg-gray-100
p-3
rounded-xl
">

<Globe className="text-gray-700"/>

</div>



<h2 className="text-xl font-bold text-gray-900">
Domínio atual
</h2>


</div>




<label className="text-sm text-gray-700">
Digite o seu domínio
</label>


<input

className="
mt-2
w-full
bg-white
border
border-gray-300
text-gray-900
placeholder:text-gray-400
rounded-xl
p-4
outline-none
focus:border-gray-900
"

placeholder="exemplo.com"

 />



<button

className="
mt-5
bg-gray-900
hover:bg-black
text-white
font-semibold
px-8
py-3
rounded-xl
transition
"

>

Conectar domínio

</button>


</div>






<div className="
bg-white
border
border-gray-200
rounded-2xl
shadow-sm
p-6
">


<h2 className="text-xl font-bold text-gray-900 mb-5">
Estado da conexão
</h2>




<div className="
flex
items-center
gap-3
border
border-gray-200
p-4
rounded-xl
">


<AlertCircle className="text-gray-700"/>


<div>

<p className="text-gray-900 font-medium">
Aguardando configuração DNS
</p>


<p className="text-gray-600 text-sm">
Configure os registros DNS do seu domínio.
</p>


</div>


</div>




<div className="
mt-5
flex
items-center
gap-3
border
border-gray-200
p-4
rounded-xl
">


<CheckCircle className="text-gray-700"/>


<div>

<p className="text-gray-900 font-medium">
SSL automático
</p>


<p className="text-gray-600 text-sm">
Será ativado após conectar o domínio.
</p>


</div>


</div>




</div>



</div>


</main>

)

}