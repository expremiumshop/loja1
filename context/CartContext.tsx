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
  image_url?: string | null
  quantity: number
  slug?: string | null
  variants?: Record<string, string> | null
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (product: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext =
  createContext<CartContextType | null>(null)

function getVariantKey(
  variants?: Record<string, string> | null
) {
  if (!variants) {
    return ""
  }

  return Object.keys(variants)
    .sort()
    .map(
      (key) =>
        `${key}:${variants[key]}`
    )
    .join("|")
}

function getCartItemKey(item: CartItem) {
  return `${item.id}__${getVariantKey(item.variants)}`
}

export function CartProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  // =====================================================
  // CARREGAR CARRINHO
  // =====================================================

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem("cart")

      if (saved) {
        const parsed =
          JSON.parse(saved)

        if (Array.isArray(parsed)) {
          setCart(parsed)
        }
      }
    } catch (error) {
      console.error(
        "Erro ao carregar carrinho:",
        error
      )

      localStorage.removeItem("cart")
    } finally {
      setLoaded(true)
    }
  }, [])

  // =====================================================
  // GUARDAR CARRINHO
  // =====================================================

  useEffect(() => {
    if (!loaded) {
      return
    }

    try {
      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      )
    } catch (error) {
      console.error(
        "Erro ao guardar carrinho:",
        error
      )
    }
  }, [cart, loaded])

  // =====================================================
  // ADICIONAR AO CARRINHO
  // =====================================================

  function addToCart(product: CartItem) {
    setCart((currentCart) => {
      const productKey =
        getCartItemKey(product)

      const existingIndex =
        currentCart.findIndex(
          (item) =>
            getCartItemKey(item) ===
            productKey
        )

      if (existingIndex !== -1) {
        return currentCart.map(
          (item, index) => {
            if (index !== existingIndex) {
              return item
            }

            return {
              ...item,
              quantity:
                Number(item.quantity || 0) +
                Number(product.quantity || 1),
            }
          }
        )
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity:
            Number(product.quantity) > 0
              ? Number(product.quantity)
              : 1,
        },
      ]
    })
  }

  // =====================================================
  // REMOVER DO CARRINHO
  // =====================================================

  function removeFromCart(id: string) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== id
      )
    )
  }

  // =====================================================
  // ALTERAR QUANTIDADE
  // =====================================================

  function updateQuantity(
    id: string,
    quantity: number
  ) {
    if (quantity < 1) {
      return
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item
      )
    )
  }

  // =====================================================
  // LIMPAR CARRINHO
  // =====================================================

  function clearCart() {
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// =====================================================
// USAR CARRINHO
// =====================================================

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error(
      "useCart deve estar dentro do CartProvider"
    )
  }

  return context
}