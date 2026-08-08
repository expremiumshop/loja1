"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { useState } from "react"
import {
  ShieldCheck,
  Truck,
  CreditCard,
  MapPin
} from "lucide-react"


export default function CheckoutPage() {


  const { cart } = useCart()


  const [payment,setPayment] = useState("")


  const total = cart.reduce(
    (sum,item)=>
      sum + item.price * item.quantity,
    0
  )


  if(cart.length === 0){

    return (

      <main className="
      min-h-screen
      flex
      items-center
      justify-center
      p-6
      ">

        <div className="
        text-center
        ">

          <h1 className="
          text-3xl
          font-bold
          ">
            Carrinho vazio
          </h1>


          <Link
          href="/"
          className="
          inline-block
          mt-6
          bg-orange-500
          text-white
          px-6
          py-3
          rounded-xl
          font-bold
          "
          >

            Voltar para loja

          </Link>

        </div>

      </main>

    )

  }




return (

<main className="
min-h-screen
bg-gray-50
p-5
md:p-10
">


<div className="
max-w-7xl
mx-auto
">


{/* HEADER */}

<div className="
mb-8
">

<h1 className="
text-3xl
md:text-4xl
font-bold
">

Finalizar compra

</h1>


<p className="
text-gray-500
mt-2
">

Faça a sua Compra segura

</p>


</div>





<div className="
grid
lg:grid-cols-3
gap-8
">





{/* FORMULARIO */}


<section className="
lg:col-span-2
space-y-6
">



<div className="
bg-white
rounded-2xl
p-6
shadow-sm
">


<h2 className="
text-xl
font-bold
mb-5
flex
items-center
gap-2
">

<MapPin size={22}/>

Dados de entrega

</h2>



<div className="
grid
md:grid-cols-2
gap-4
">


<input
placeholder="Nome completo"
className="
border
rounded-xl
p-4
outline-none
"
/>


<input
placeholder="Telefone"
className="
border
rounded-xl
p-4
outline-none
"
/>


<input
placeholder="Email"
className="
border
rounded-xl
p-4
outline-none
"
/>


<input
placeholder="Cidade"
className="
border
rounded-xl
p-4
outline-none
"
/>


</div>



<textarea

placeholder="Endereço completo"

className="
border
rounded-xl
p-4
w-full
mt-4
h-28
"

/>



</div>







{/* PAGAMENTO */}


<div className="
bg-white
rounded-2xl
p-6
shadow-sm
">


<h2 className="
text-xl
font-bold
mb-5
flex
gap-2
items-center
">

<CreditCard size={22}/>

Método de pagamento

</h2>




<div className="
space-y-3
">


{

[
"M-Pesa",
"e-Mola",
"Cartão bancário",
"PayPal"
]

.map(method=>(


<label

key={method}

className="
flex
items-center
gap-3
border
rounded-xl
p-4
cursor-pointer
"

>


<input

type="radio"

name="payment"

value={method}

onChange={(e)=>
setPayment(e.target.value)
}

/>


{method}


</label>



))


}


</div>


</div>





</section>







{/* RESUMO */}


<aside className="
bg-white
rounded-2xl
p-6
shadow-sm
h-fit
">


<h2 className="
text-xl
font-bold
mb-5
">

Resumo do pedido

</h2>





<div className="
space-y-5
">


{

cart.map(item=>(


<div

key={item.id}

className="
flex
gap-4
border-b
pb-4
"


>


<Image

src={item.image_url}

alt={item.name}

width={70}

height={70}

className="
rounded-xl
object-cover
"

/>



<div className="flex-1">


<h3 className="
font-semibold
line-clamp-2
">

{item.name}

</h3>


<p className="
text-sm
text-gray-500
">

Quantidade: {item.quantity}

</p>


</div>



<strong>

{item.price * item.quantity} MT

</strong>


</div>


))


}


</div>





<div className="
border-t
mt-6
pt-5
space-y-3
">


<div className="
flex
justify-between
">

<span>
Produtos
</span>


<strong>
{total} MT
</strong>


</div>




<div className="
flex
justify-between
">

<span>
Entrega
</span>


<strong className="
text-green-600
">

Grátis

</strong>


</div>




<div className="
flex
justify-between
text-xl
font-bold
">

<span>
Total
</span>


<span>
{total} MT
</span>


</div>


</div>







<button

className="
w-full
mt-6
bg-orange-500
hover:bg-orange-600
text-white
font-bold
py-4
rounded-xl
transition
"

>


Confirmar pedido


</button>




<div className="
mt-6
space-y-3
text-sm
text-gray-600
">


<p className="flex gap-2">

<ShieldCheck size={18}/>

Pagamento seguro

</p>


<p className="flex gap-2">

<Truck size={18}/>

Entrega rastreada

</p>


<p className="flex gap-2">

<ShieldCheck size={18}/>

Garantia 100%

</p>


</div>



</aside>






</div>


</div>


</main>


)

}