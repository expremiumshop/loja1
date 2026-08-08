"use client"

import {

ShoppingCart,
Zap

} from "lucide-react"



interface Props {

product:any

}



export default function MobileBottomBar({

product

}:Props){



return (

<div

className="
fixed

bottom-0

left-0

right-0

z-50

bg-white

border-t

shadow-lg

p-3

md:hidden

"

>


<div

className="
flex

gap-3

"

>


<button

className="

flex-1

h-12

border-2

border-orange-500

rounded-lg

text-orange-600

font-bold

flex

items-center

justify-center

gap-2

"

>


<ShoppingCart size={20}/>

Carrinho


</button>







<button

className="

flex-1

h-12

bg-orange-500

text-white

rounded-lg

font-bold

flex

items-center

justify-center

gap-2

"

>


<Zap size={20}/>


Comprar


</button>



</div>


</div>

)

}