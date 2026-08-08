"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"


export type CartItem = {
  id: string
  name: string
  price: number
  image_url: string
  quantity: number
}


type CartContextType = {
  cart: CartItem[]
  addToCart: (product: CartItem) => void
  removeFromCart: (id:string)=>void
  updateQuantity:(id:string, quantity:number)=>void
  clearCart:()=>void
}


const CartContext = createContext<CartContextType | null>(null)



export function CartProvider({
  children
}:{
  children:React.ReactNode
}){


const [cart,setCart]=useState<CartItem[]>([])



useEffect(()=>{

const saved =
localStorage.getItem("cart")

if(saved){
setCart(JSON.parse(saved))
}

},[])



useEffect(()=>{

localStorage.setItem(
"cart",
JSON.stringify(cart)
)

},[cart])




function addToCart(product:CartItem){

const exists =
cart.find(
(item)=>item.id===product.id
)


if(exists){

setCart(
cart.map(item=>
item.id===product.id
?
{
...item,
quantity:item.quantity+1
}
:item
)
)


}else{

setCart([
...cart,
{
...product,
quantity:1
}
])

}

}




function removeFromCart(id:string){

setCart(
cart.filter(
item=>item.id!==id
)
)

}




function updateQuantity(
id:string,
quantity:number
){

if(quantity<1)return


setCart(
cart.map(item=>
item.id===id
?
{
...item,
quantity
}
:item
)
)


}




function clearCart(){

setCart([])

}



return (

<CartContext.Provider
value={{
cart,
addToCart,
removeFromCart,
updateQuantity,
clearCart
}}
>

{children}

</CartContext.Provider>

)


}



export function useCart(){

const context =
useContext(CartContext)


if(!context){

throw new Error(
"UseCart deve estar dentro do CartProvider"
)

}


return context

}