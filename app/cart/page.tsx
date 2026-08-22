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

  // =====================================================
  // TOTAL
  // =====================================================

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
        Number(item.quantity),
    0
  )

  // =====================================================
  // CARRINHO VAZIO
  // =====================================================

  if (cart.length === 0) {
    return (
      <main
        className="
          flex
          min-h-screen
          min-w-0
          items-center
          justify-center
          overflow-x-hidden
          p-6
        "
      >
        <div className="w-full min-w-0 max-w-md text-center">
          <h1
            className="
              min-w-0
              max-w-full
              break-words
              [overflow-wrap:anywhere]
              text-2xl
              font-bold
            "
          >
            Seu carrinho está vazio
          </h1>

          <p
            className="
              mt-2
              min-w-0
              max-w-full
              break-words
              [overflow-wrap:anywhere]
              text-gray-500
            "
          >
            Adicione produtos para continuar.
          </p>

          <Link
            href="/"
            className="
              mt-6
              inline-block
              rounded-xl
              bg-orange-500
              px-6
              py-3
              font-bold
              text-white
              hover:bg-orange-600
            "
          >
            Continuar comprando
          </Link>
        </div>
      </main>
    )
  }

  // =====================================================
  // PÁGINA DO CARRINHO
  // =====================================================

  return (
    <main
      className="
        min-h-screen
        min-w-0
        overflow-x-hidden
        bg-gray-50
        px-4
        py-6
        pb-24
        md:p-8
      "
    >
      <div className="mx-auto w-full min-w-0 max-w-6xl">

        {/* =================================================
            TÍTULO
        ================================================= */}

        <div className="mb-8 min-w-0">
          <h1
            className="
              min-w-0
              max-w-full
              break-words
              [overflow-wrap:anywhere]
              text-3xl
              font-bold
              md:text-4xl
            "
          >
            Carrinho de compras
          </h1>
        </div>

        {/* =================================================
            PRODUTOS
        ================================================= */}

        <div className="min-w-0 space-y-5">

          {cart.map((item) => {
            const imageSrc =
              item.image_url &&
              item.image_url.trim() !== ""
                ? item.image_url
                : "/placeholder-logo.png"

            return (
              <div
                key={item.id}
                className="
                  flex
                  min-w-0
                  flex-col
                  gap-4
                  rounded-xl
                  border
                  bg-white
                  p-4
                  shadow-sm
                  sm:flex-row
                  sm:items-center
                  sm:gap-5
                "
              >

                {/* =================================================
                    IMAGEM
                ================================================= */}

                <div
                  className="
                    relative
                    h-[100px]
                    w-[100px]
                    shrink-0
                    overflow-hidden
                    rounded-lg
                    bg-gray-100
                  "
                >
                  <Image
                    src={imageSrc}
                    alt={item.name}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </div>

                {/* =================================================
                    INFORMAÇÕES
                ================================================= */}

                <div
                  className="
                    min-w-0
                    flex-1
                  "
                >
                  <h2
                    className="
                      min-w-0
                      max-w-full
                      break-words
                      [overflow-wrap:anywhere]
                      text-lg
                      font-bold
                    "
                  >
                    {item.name}
                  </h2>

                  <p
                    className="
                      mt-1
                      min-w-0
                      break-words
                      text-orange-600
                      font-bold
                    "
                  >
                    {Number(item.price).toLocaleString(
                      "pt-MZ"
                    )}{" "}
                    MT
                  </p>

                  {/* =================================================
                      VARIANTES
                  ================================================= */}

                  {item.variants &&
                    Object.keys(item.variants).length >
                      0 && (
                      <div
                        className="
                          mt-2
                          min-w-0
                          max-w-full
                          space-y-1
                          break-words
                          [overflow-wrap:anywhere]
                          text-sm
                          text-gray-600
                        "
                      >
                        {Object.entries(
                          item.variants
                        ).map(
                          ([name, value]) => (
                            <div
                              key={name}
                              className="
                                min-w-0
                                max-w-full
                                break-words
                                [overflow-wrap:anywhere]
                              "
                            >
                              <strong>
                                {name}:
                              </strong>{" "}
                              {value}
                            </div>
                          )
                        )}
                      </div>
                    )}

                  {/* =================================================
                      QUANTIDADE
                  ================================================= */}

                  <div
                    className="
                      mt-3
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded
                        bg-gray-200
                        hover:bg-gray-300
                      "
                      aria-label="Diminuir quantidade"
                    >
                      -
                    </button>

                    <span
                      className="
                        min-w-[25px]
                        text-center
                        font-bold
                      "
                    >
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded
                        bg-gray-200
                        hover:bg-gray-300
                      "
                      aria-label="Aumentar quantidade"
                    >
                      +
                    </button>
                  </div>

                  {/* =================================================
                      REMOVER
                  ================================================= */}

                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                    className="
                      mt-3
                      text-red-500
                      hover:text-red-600
                    "
                  >
                    Remover
                  </button>
                </div>

                {/* =================================================
                    SUBTOTAL
                ================================================= */}

                <div
                  className="
                    min-w-0
                    shrink-0
                    sm:self-start
                  "
                >
                  <strong
                    className="
                      block
                      max-w-full
                      break-words
                      text-left
                      sm:text-right
                    "
                  >
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toLocaleString(
                      "pt-MZ"
                    )}{" "}
                    MT
                  </strong>
                </div>

              </div>
            )
          })}

        </div>

        {/* =================================================
            RESUMO
        ================================================= */}

        <div
          className="
            mt-8
            min-w-0
            rounded-xl
            border
            bg-white
            p-5
            shadow-sm
          "
        >
          <h2
            className="
              min-w-0
              break-words
              text-xl
              font-bold
            "
          >
            Resumo
          </h2>

          <div
            className="
              mt-4
              flex
              min-w-0
              items-center
              justify-between
              gap-4
            "
          >
            <span className="shrink-0">
              Total:
            </span>

            <strong
              className="
                min-w-0
                break-words
                text-right
              "
            >
              {total.toLocaleString(
                "pt-MZ"
              )}{" "}
              MT
            </strong>
          </div>

          {/* =================================================
              FINALIZAR
          ================================================= */}

          <Link
            href="/checkout"
            className="
              mt-6
              block
              min-w-0
              rounded-xl
              bg-orange-500
              p-4
              text-center
              font-bold
              text-white
              transition
              hover:bg-orange-600
            "
          >
            Finalizar compra
          </Link>

          {/* =================================================
              LIMPAR
          ================================================= */}

          <button
            type="button"
            onClick={clearCart}
            className="
              mt-4
              w-full
              min-w-0
              break-words
              text-red-500
              hover:text-red-600
            "
          >
            Limpar carrinho
          </button>
        </div>

      </div>
    </main>
  )
}