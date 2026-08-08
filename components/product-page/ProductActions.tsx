"use client"

import { useState } from "react"
import {
  ShoppingCart,
  Zap,
  Minus,
  Plus
} from "lucide-react"

import { useCart } from "@/context/CartContext"
import { useRouter } from "next/navigation"


interface ProductActionsProps {
  product: any
}


export default function ProductActions({
  product
}: ProductActionsProps) {


  const [quantity, setQuantity] = useState(1)

  const {
    addToCart
  } = useCart()


  const router = useRouter()



  function increase() {

    if (quantity < product.stock) {

      setQuantity(quantity + 1)

    }

  }



  function decrease() {

    if (quantity > 1) {

      setQuantity(quantity - 1)

    }

  }



  function handleAddCart() {


    addToCart({

      id: product.id,

      name: product.name,

      price: product.price,

      image_url: product.image_url || product.image,

      quantity

    })


  }



  function handleBuyNow() {


    addToCart({

      id: product.id,

      name: product.name,

      price: product.price,

      image_url: product.image_url || product.image,

      quantity

    })


    router.push("/checkout")

  }




  return (

    <div className="space-y-5">


      {/* QUANTIDADE */}

      <div>

        <p className="
        text-sm
        font-semibold
        text-gray-700
        mb-3
        ">
          Quantidade
        </p>


        <div className="
        flex
        items-center
        border
        rounded-lg
        w-fit
        overflow-hidden
        ">


          <button

            onClick={decrease}

            className="
            p-3
            hover:bg-gray-100
            "

          >

            <Minus size={18}/>

          </button>



          <span className="
          px-6
          font-semibold
          ">

            {quantity}

          </span>



          <button

            onClick={increase}

            className="
            p-3
            hover:bg-gray-100
            "

          >

            <Plus size={18}/>

          </button>


        </div>

      </div>





      {/* BOTÕES DESKTOP */}

      <div className="
      hidden
      md:flex
      gap-4
      ">



        <button

          onClick={handleAddCart}

          className="
          flex-1
          h-14
          rounded-xl
          border-2
          border-orange-500
          text-orange-600
          font-bold
          flex
          items-center
          justify-center
          gap-2
          hover:bg-orange-50
          transition
          "

        >

          <ShoppingCart size={20}/>

          Adicionar ao carrinho


        </button>





        <button

          onClick={handleBuyNow}

          className="
          flex-1
          h-14
          rounded-xl
          bg-orange-500
          text-white
          font-bold
          flex
          items-center
          justify-center
          gap-2
          hover:bg-orange-600
          transition
          "

        >

          <Zap size={20}/>

          Comprar agora


        </button>


      </div>





      <p className="
      text-xs
      text-gray-500
      ">

        Pagamento seguro • Produto protegido • Compra garantida

      </p>


    </div>

  )

}