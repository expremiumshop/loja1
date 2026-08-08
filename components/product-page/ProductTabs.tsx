"use client"

import {
  useState
} from "react"



interface ProductTabsProps {

product:any

}



export default function ProductTabs({

product

}:ProductTabsProps){



const [active,setActive]=useState("description")




const tabs=[

{
id:"description",
name:"Descrição"
},

{
id:"details",
name:"Detalhes"
},

{
id:"reviews",
name:"Avaliações"
}

]






return (

<div

className="
bg-white
border
rounded-xl
overflow-hidden

"

>







{/* MENU DAS ABAS */}

<div

className="
flex
border-b
overflow-x-auto

"

>


{

tabs.map(tab=>(


<button

key={tab.id}

onClick={()=>setActive(tab.id)}

className={`

px-6

py-4

font-semibold

text-sm

whitespace-nowrap


${
active===tab.id

?

"text-orange-600 border-b-2 border-orange-500"

:

"text-gray-500"

}

`}

>


{tab.name}


</button>



))

}


</div>









{/* CONTEÚDO */}

<div

className="
p-6

"

>






{

active==="description" &&

(

<div

className="
space-y-4

"

>


<h3

className="
text-xl
font-bold

"

>

Descrição do produto

</h3>



<p

className="
text-gray-600
leading-relaxed

"

>

{product.description ||

"Informações detalhadas do produto aparecerão aqui."}

</p>


</div>


)

}








{

active==="details" &&

(

<div

className="
space-y-3

"

>


<h3

className="
text-xl
font-bold

"

>

Detalhes do produto

</h3>



<div className="space-y-2 text-sm">


<p>

<strong>Categoria:</strong>{" "}

{product.category || "Sem categoria"}

</p>



<p>

<strong>Disponibilidade:</strong>{" "}

Em estoque

</p>



<p>

<strong>Envio:</strong>{" "}

Internacional

</p>



<p>

<strong>Garantia:</strong>{" "}

Garantia EXPREMIUM

</p>



</div>


</div>


)

}








{

active==="reviews" &&

(

<div>


<h3

className="
text-xl
font-bold
mb-3

"

>

Avaliações

</h3>


<p

className="
text-gray-500

"

>

As avaliações dos clientes aparecerão aqui.

</p>


</div>


)

}





</div>







</div>

)

}