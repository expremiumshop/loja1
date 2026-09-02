"use client"

import {
  Home,
  MessageCircle,
  ShoppingCart,
  User,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "@/context/CartContext"

export function BottomNavigation() {
  const pathname = usePathname()
  const { cart } = useCart()

  // =====================================================
  // CONTADOR DO CARRINHO
  // =====================================================

  const cartCount = cart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  )

  // =====================================================
  // NAVEGAÇÃO
  // =====================================================

  const navItems = [
    {
      name: "Home",
      icon: Home,
      href: "/",
      external: false,
    },
    {
      name: "Mensagens",
      icon: MessageCircle,
      href: "https://wa.me/258849030643",
      external: true,
    },
    {
      name: "Carrinho",
      icon: ShoppingCart,
      href: "/cart",
      external: false,
    },
    {
      name: "Conta",
      icon: User,
      href: "/register",
      external: false,
    },
  ]

  // =====================================================
  // VERIFICAR PÁGINA ATIVA
  // =====================================================

  function isActive(path: string) {
    if (path === "/") {
      return pathname === "/"
    }

    return pathname === path
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <nav
      className="
        fixed
        bottom-3
        left-3
        right-3
        z-[90]
        md:hidden
      "
    >
      <div
        className="
          flex
          w-full
          items-center
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-[0_4px_20px_rgba(0,0,0,0.12)]
        "
      >
        {navItems.map((item) => {
          const Icon = item.icon

          const active =
            !item.external &&
            isActive(item.href)

          const className = `
            relative
            flex
            min-h-[62px]
            flex-1
            flex-col
            items-center
            justify-center
            gap-1
            transition-all
            ${
              active
                ? "text-primary"
                : "text-muted-foreground"
            }
          `

          // =================================================
          // WHATSAPP
          // =================================================

          if (item.external) {
            return (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                <div className="relative">
                  <Icon size={23} />
                </div>

                <span className="text-[11px] font-medium">
                  {item.name}
                </span>
              </a>
            )
          }

          // =================================================
          // LINKS INTERNOS
          // =================================================

          return (
            <Link
              key={item.name}
              href={item.href}
              className={className}
            >
              <div
                className={`
                  relative
                  transition-transform
                  ${
                    active
                      ? "scale-110"
                      : "scale-100"
                  }
                `}
              >
                <Icon size={23} />

                {/* CONTADOR DO CARRINHO */}

                {item.name === "Carrinho" &&
                  cartCount > 0 && (
                    <span
                      className="
                        absolute
                        -right-2
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
              </div>

              <span
                className={`
                  text-[11px]
                  font-medium
                  ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground"
                  }
                `}
              >
                {item.name}
              </span>

              {/* INDICADOR DA PÁGINA ATIVA */}

              {active && (
                <div
                  className="
                    absolute
                    bottom-1
                    left-1/2
                    h-0.5
                    w-8
                    -translate-x-1/2
                    rounded-full
                    bg-primary
                  "
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}