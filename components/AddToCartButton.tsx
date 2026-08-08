"use client"

import {useCart} from "@/context/CartContext"


export default function AddToCartButton({
product
}:any){


const {addToCart}=useCart()



return (

<button

onClick={()=>addToCart({
id:product.id,
name:product.name,
price:product.price,
image_url:product.image_url,
quantity:1
})}

className="
rounded-xl
bg-orange-500
px-6 py-3
font-bold
text-white
"

>

🛒 Adicionar ao carrinho

</button>


)

}