"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/context/CartContext"

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart()

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  if (cart.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold">
          Seu carrinho está vazio
        </h1>

        <p className="mt-2 text-gray-500">
          Adicione produtos para continuar.
        </p>

        <Link
          href="/"
          className="mt-6 rounded-xl bg-orange-500 px-6 py-3 text-white font-bold"
        >
          Continuar comprando
        </Link>
      </main>
    )
  }


  return (
    <main className="min-h-screen p-6">

      <h1 className="text-3xl font-bold mb-8">
        Carrinho de compras
      </h1>


      <div className="space-y-5">

        {cart.map((item) => (

          <div
            key={item.id}
            className="flex items-center gap-5 rounded-xl border p-4"
          >

            <Image
              src={item.image_url}
              alt={item.name}
              width={100}
              height={100}
              className="rounded-lg object-cover"
            />


            <div className="flex-1">

              <h2 className="font-bold text-lg">
                {item.name}
              </h2>


              <p className="text-orange-600 font-bold">
                {item.price} MT
              </p>


              <div className="flex items-center gap-3 mt-3">

                <button
                  onClick={() =>
                    updateQuantity(
                      item.id,
                      item.quantity - 1
                    )
                  }
                  className="w-8 h-8 rounded bg-gray-200"
                >
                  -
                </button>


                <span className="font-bold">
                  {item.quantity}
                </span>


                <button
                  onClick={() =>
                    updateQuantity(
                      item.id,
                      item.quantity + 1
                    )
                  }
                  className="w-8 h-8 rounded bg-gray-200"
                >
                  +
                </button>

              </div>


              <button
                onClick={() =>
                  removeFromCart(item.id)
                }
                className="mt-3 text-red-500"
              >
                Remover
              </button>


            </div>


          </div>

        ))}

      </div>



      <div className="mt-8 rounded-xl border p-5">

        <h2 className="text-xl font-bold">
          Resumo
        </h2>


        <div className="flex justify-between mt-4">

          <span>
            Total:
          </span>


          <strong>
            {total} MT
          </strong>

        </div>


        <Link
          href="/checkout"
          className="
          mt-6
          block
          rounded-xl
          bg-orange-500
          p-4
          text-center
          font-bold
          text-white
          "
        >
          Finalizar compra
        </Link>


        <button
          onClick={clearCart}
          className="mt-4 w-full text-red-500"
        >
          Limpar carrinho
        </button>


      </div>


    </main>
  )
}