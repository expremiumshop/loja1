"use client"

import { useState } from "react"
import { Check, ShoppingCart } from "lucide-react"

import { useCart } from "@/context/CartContext"

interface AddToCartButtonProps {
  product: any
}

export default function AddToCartButton({
  product,
}: AddToCartButtonProps) {
  const { addToCart } = useCart()

  const [added, setAdded] = useState(false)

  function handleAddToCart() {
    if (!product?.id) {
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image_url:
        product.image_url ||
        product.image ||
        null,
      slug: product.slug || null,
      variants: null,
      quantity: 1,
    })

    setAdded(true)

    window.setTimeout(() => {
      setAdded(false)
    }, 1800)
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className={`
        flex
        items-center
        justify-center
        gap-2
        rounded-xl
        px-6
        py-3
        font-bold
        text-white
        transition-all
        duration-200
        active:scale-95
        ${
          added
            ? "bg-green-600"
            : "bg-orange-500 hover:bg-orange-600"
        }
      `}
    >
      {added ? (
        <>
          <Check
            size={18}
            className="animate-in zoom-in duration-200"
          />
          Adicionado
        </>
      ) : (
        <>
          <ShoppingCart size={18} />
          Adicionar ao carrinho
        </>
      )}
    </button>
  )
}