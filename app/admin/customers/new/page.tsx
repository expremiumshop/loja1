"use client";

import Link from "next/link";
import {
  ArrowLeft,
  UserPlus,
  MapPin,
  Mail,
  Phone,
  User,
} from "lucide-react";


export default function NewCustomerPage() {


return (

<main className="min-h-screen bg-gray-100 p-8">


<div className="max-w-5xl mx-auto">



{/* HEADER */}


<Link

href="/admin/customers"

className="
flex
items-center
gap-2
text-blue-600
font-medium
mb-6
"

>

<ArrowLeft size={18}/>

Voltar para clientes

</Link>





<h1 className="
text-3xl
font-bold
text-gray-900
">

Criar Cliente

</h1>



<p className="
text-gray-600
mt-2
mb-8
">

Adicione um novo cliente manualmente.

</p>







<div className="
grid
lg:grid-cols-3
gap-8
">





{/* FORMULARIO */}



<div className="
lg:col-span-2
space-y-6
">





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
bg-blue-100
text-blue-600
p-3
rounded-lg
">

<User size={22}/>

</div>



<h2 className="
text-xl
font-bold
text-gray-900
">

Informações Pessoais

</h2>



</div>






<label className="
text-gray-700
font-medium
">

Nome completo

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

placeholder="Nome do cliente"

/>





<label className="
block
mt-5
text-gray-700
font-medium
">

Email

</label>



<div className="
relative
">


<Mail

size={18}

className="
absolute
left-3
top-3.5
text-gray-500
"

/>


<input

className="
mt-2
w-full
border
border-gray-300
rounded-lg
p-3
pl-10
text-gray-900
bg-white
"

placeholder="cliente@email.com"

/>


</div>








<label className="
block
mt-5
text-gray-700
font-medium
">

Telefone

</label>



<div className="
relative
">


<Phone

size={18}

className="
absolute
left-3
top-3.5
text-gray-500
"

/>


<input

className="
mt-2
w-full
border
border-gray-300
rounded-lg
p-3
pl-10
text-gray-900
bg-white
"

placeholder="+258"

/>


</div>




</div>









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
bg-green-100
text-green-600
p-3
rounded-lg
">

<MapPin size={22}/>

</div>



<h2 className="
text-xl
font-bold
text-gray-900
">

Endereço

</h2>



</div>





<input

className="
w-full
border
border-gray-300
rounded-lg
p-3
text-gray-900
bg-white
mb-4
"

placeholder="País"

/>





<input

className="
w-full
border
border-gray-300
rounded-lg
p-3
text-gray-900
bg-white
mb-4
"

placeholder="Cidade"

/>






<textarea

rows={4}

className="
w-full
border
border-gray-300
rounded-lg
p-3
text-gray-900
bg-white
"

placeholder="Morada completa"

/>



</div>






</div>









{/* LADO DIREITO */}



<div>



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

Configurações

</h2>




<label className="
text-gray-700
font-medium
">

Estado

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
Ativo
</option>


<option>
Bloqueado
</option>


</select>







<label className="
block
mt-5
text-gray-700
font-medium
">

Tags

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

placeholder="VIP, Novo, Frequente"

/>





<button

className="
mt-8
w-full
bg-blue-600
hover:bg-blue-700
text-white
font-semibold
py-3
rounded-xl
flex
items-center
justify-center
gap-2
"

>


<UserPlus size={18}/>


Criar Cliente


</button>



</div>



</div>






</div>



</div>



</main>


);


}