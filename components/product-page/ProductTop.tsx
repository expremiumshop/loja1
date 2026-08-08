"use client"

import {
  Share2,
  ShieldCheck
} from "lucide-react"



interface ProductTopProps {

  product:any

}



export default function ProductTop({

product

}:ProductTopProps){



return (

<div

className="
space-y-5

"

>







{/* STATUS DO PRODUTO */}

<div

className="
flex
flex-wrap
items-center
justify-between
gap-3

"

>



<div

className="
flex
items-center
gap-3

bg-green-50

border

border-green-200

rounded-lg

px-4

py-3

"

>



<ShieldCheck

className="
w-5
h-5
text-green-600

"

/>




<div>


<p

className="
text-sm
font-semibold
text-green-700

"

>

✓ Produto verificado EXPREMIUM SHOP

</p>




<p

className="
text-xs
text-gray-600

"

>

Produto analisado e seguro para compra

</p>



</div>



</div>







{/* COMPARTILHAR */}

<button

className="
flex
items-center
gap-2

text-gray-500

hover:text-orange-500

transition

text-sm

"

>


<Share2 size={18}/>


Compartilhar


</button>





</div>









{/* NOME DO PRODUTO */}

<h1

className="
text-2xl
lg:text-3xl
font-bold
text-gray-900
leading-tight

"

>

{product.name}

</h1>







</div>

)

}