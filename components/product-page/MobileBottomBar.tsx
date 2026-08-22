"use client"

import { useState } from "react"

import {
  ShoppingCart,
  Zap,
  Check,
} from "lucide-react"

import { useRouter } from "next/navigation"

import { useCart } from "@/context/CartContext"

interface ProductOption {
  id: string
  name: string
  values: string[]
}

interface Props {
  product: any
  productOptions?: ProductOption[]
  selectedVariants?: Record<string, string>
  quantity?: number
}

export default function MobileBottomBar({
  product,
  productOptions = [],
  selectedVariants = {},
  quantity = 1,
}: Props) {
  const router = useRouter()

  const {
    cart,
    addToCart,
  } = useCart()

  const [cartClicked, setCartClicked] =
    useState(false)

  const [buying, setBuying] =
    useState(false)

  const stock =
    Number(product?.stock ?? 0)

  // =====================================================
  // CONTAGEM TOTAL DO CARRINHO
  // =====================================================

  const cartCount = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  )

  // =====================================================
  // PRODUTO PARA O CARRINHO
  // =====================================================

  function getCartProduct() {
    return {
      id: product?.id,
      name: product?.name,
      price: Number(product?.price),

      image_url:
        product?.image_url ||
        product?.image ||
        null,

      slug: product?.slug || null,

      variants:
        productOptions.length > 0
          ? selectedVariants
          : null,

      quantity:
        quantity > 0
          ? quantity
          : 1,
    }
  }

  // =====================================================
  // VALIDAR VARIANTES
  // =====================================================

  function validateVariants() {
    if (productOptions.length === 0) {
      return true
    }

    const missing =
      productOptions.filter(
        (option) =>
          option.name &&
          option.values?.length > 0 &&
          !selectedVariants[
            option.name
          ]?.trim()
      )

    if (missing.length > 0) {
      const names = missing
        .map((option) => option.name)
        .join(", ")

      alert(
        `Selecione as variantes: ${names}`
      )

      return false
    }

    return true
  }

  // =====================================================
  // CARRINHO
  // =====================================================

  function handleCart() {
    if (stock <= 0) {
      alert(
        "Este produto está sem stock."
      )
      return
    }

    if (!validateVariants()) {
      return
    }

    addToCart(
      getCartProduct()
    )

    setCartClicked(true)

    setTimeout(() => {
      router.push("/cart")
    }, 350)
  }

  // =====================================================
  // COMPRAR
  // =====================================================

  function handleBuy() {
    if (stock <= 0) {
      alert(
        "Este produto está sem stock."
      )
      return
    }

    if (!validateVariants()) {
      return
    }

    setBuying(true)

    addToCart(
      getCartProduct()
    )

    setTimeout(() => {
      router.push("/checkout")
    }, 250)
  }

  return (
    <div
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        border-t
        bg-white
        p-3
        shadow-lg
        md:hidden
      "
    >
      <div className="flex gap-3">

        {/* CARRINHO */}

        <button
          type="button"
          onClick={handleCart}
          disabled={
            stock <= 0 ||
            cartClicked
          }
          className={`
            relative
            flex
            h-12
            flex-1
            items-center
            justify-center
            gap-2
            rounded-lg
            border-2
            font-bold
            transition-all
            duration-200
            active:scale-95
            disabled:cursor-not-allowed
            disabled:opacity-70

            ${
              cartClicked
                ? "border-green-500 bg-green-50 text-green-600"
                : "border-orange-500 text-orange-600 hover:bg-orange-50"
            }
          `}
        >
          {cartClicked ? (
            <>
              <Check
                size={20}
                className="animate-in zoom-in duration-200"
              />

              Adicionado
            </>
          ) : (
            <>
              <ShoppingCart
                size={20}
              />

              Carrinho

              {/* CONTADOR */}

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -right-1
                    -top-2
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-primary
                    px-1
                    text-[10px]
                    font-bold
                    text-white
                  "
                >
                  {cartCount}
                </span>
              )}
            </>
          )}
        </button>

        {/* COMPRAR */}

        <button
          type="button"
          onClick={handleBuy}
          disabled={
            stock <= 0 ||
            buying
          }
          className="
            flex
            h-12
            flex-1
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-orange-500
            font-bold
            text-white
            transition-all
            duration-200
            hover:bg-orange-600
            active:scale-95
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <Zap
            size={20}
            className={
              buying
                ? "animate-pulse"
                : ""
            }
          />

          {buying
            ? "A abrir..."
            : "Comprar"}
        </button>

      </div>
    </div>
  )
}