"use client"

import {
  useEffect,
  useState,
  type FormEvent,
} from "react"

import {
  User,
  ShoppingCart,
  Menu,
  X,
  Search,
  ChevronDown,
  Package,
  Headphones,
  Gift,
  Zap,
  MapPin,
  Truck,
} from "lucide-react"

import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { supabase } from "@/lib/supabase"

interface Category {
  id: string
  name: string
  slug: string
  active: boolean
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [search, setSearch] = useState("")

  const [categories, setCategories] = useState<Category[]>([])

  const [categoriesLoading, setCategoriesLoading] = useState(true)

  const [mobileNavFixed, setMobileNavFixed] = useState(false)

  const { cart } = useCart()

  // =====================================================
  // CONTADOR DO CARRINHO
  // =====================================================

  const cartCount = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  )

  // =====================================================
  // CARREGAR CATEGORIAS
  // =====================================================

  useEffect(() => {
    let mounted = true

    async function loadCategories() {
      try {
        const {
          data,
          error,
        } = await supabase
          .from("categories")
          .select(
            "id, name, slug, active"
          )
          .eq("active", true)
          .order("created_at", {
            ascending: true,
          })

        if (error) {
          console.error(
            "Erro ao carregar categorias:",
            error
          )

          return
        }

        if (mounted) {
          setCategories(data || [])
        }
      } catch (error) {
        console.error(
          "Erro ao carregar categorias:",
          error
        )
      } finally {
        if (mounted) {
          setCategoriesLoading(false)
        }
      }
    }

    loadCategories()

    return () => {
      mounted = false
    }
  }, [])

  // =====================================================
  // CONTROLE DA ÁREA FIXA NO CELULAR
  // =====================================================

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 60) {
        setMobileNavFixed(true)
      } else {
        setMobileNavFixed(false)
      }
    }

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    )

    handleScroll()

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      )
    }
  }, [])

  // =====================================================
  // PESQUISA
  // =====================================================

  function handleSearch(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    const value = search.trim()

    if (!value) {
      return
    }

    window.location.href =
      `/search?q=${encodeURIComponent(value)}`
  }

  // =====================================================
  // FECHAR MENU
  // =====================================================

  function closeMobileMenu() {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* =========================================================
          DESKTOP
      ========================================================== */}

      <header
        className="
          sticky
          top-0
          z-50
          hidden
          md:block
          bg-white/90
          backdrop-blur-md
        "
      >
        {/* =====================================================
            TOP BAR
        ====================================================== */}

        <div className="bg-primary text-white">
          <div
            className="
              mx-auto
              w-full
              max-w-[1600px]
              px-5
              xl:px-8
            "
          >
            <div
              className="
                flex
                h-9
                items-center
                justify-between
                text-xs
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-5
                "
              >
                <span
                  className="
                    shrink-0
                    font-medium
                  "
                >
                  Bem-vindo à EXPREMIUM SHOP
                </span>

                <div
                  className="
                    flex
                    shrink-0
                    items-center
                    gap-1.5
                    opacity-80
                  "
                >
                  <Zap size={13} />
                  Super Ofertas
                </div>

                <div
                  className="
                    flex
                    shrink-0
                    items-center
                    gap-1.5
                    opacity-80
                  "
                >
                  <Gift size={13} />
                  Cupons
                </div>
              </div>

              <div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    opacity-70
                  "
                >
                  <Package size={13} />
                  Meus pedidos
                </div>

                <a
                  href="https://wa.me/258855932991"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex
                    items-center
                    gap-1.5
                    transition-opacity
                    hover:opacity-80
                  "
                >
                  <Headphones size={13} />
                  Atendimento
                </a>

                <div
                  className="
                    hidden
                    items-center
                    gap-1.5
                    lg:flex
                  "
                >
                  <span>
                    Moçambique
                  </span>
                </div>

                <span>
                  MZN
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            MAIN HEADER
        ====================================================== */}

        <div
          className="
            border-b
            border-white/20
            bg-transparent
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1600px]
              px-5
              xl:px-8
            "
          >
            <div
              className="
                flex
                min-h-[78px]
                items-center
                gap-5
                xl:gap-7
              "
            >
              {/* =================================================
                  NOME DA LOJA
              ================================================== */}

              <Link
                href="/"
                aria-label="EXPREMIUM SHOP"
                className="
                  flex
                  h-12
                  w-[205px]
                  shrink-0
                  items-center
                  overflow-hidden
                "
              >
                <span
                  className="
                    whitespace-nowrap
                    text-xl
                    font-bold
                  "
                >
                  EXPREMIUM SHOP
                </span>
              </Link>

              {/* =================================================
                  PESQUISA DESKTOP
              ================================================== */}

              <div className="min-w-0 flex-1">
                <form onSubmit={handleSearch}>
                  <div
                    className="
                      flex
                      h-11
                      w-full
                      overflow-hidden
                      rounded-full
                      border-2
                      border-primary
                      bg-transparent
                      backdrop-blur-sm
                    "
                  >
                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        pl-4
                        text-muted-foreground
                      "
                    >
                      <Search size={19} />
                    </div>

                    <input
                      type="text"
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      placeholder="
                        Pesquisar produtos, marcas e muito mais...
                      "
                      className="
                        min-w-0
                        flex-1
                        bg-transparent
                        px-3
                        text-sm
                        text-foreground
                        outline-none
                        placeholder:text-muted-foreground
                      "
                    />

                    <button
                      type="submit"
                      className="
                        w-[105px]
                        shrink-0
                        rounded-full
                        bg-primary
                        px-5
                        text-sm
                        font-bold
                        text-white
                        transition
                        hover:opacity-90
                      "
                    >
                      Buscar
                    </button>
                  </div>
                </form>
              </div>

              {/* =================================================
                  CONTA
              ================================================== */}

              <Link
                href="/login"
                className="
                  flex
                  w-[175px]
                  shrink-0
                  items-center
                  gap-3
                  rounded-lg
                  px-2
                  py-2
                  transition-colors
                  hover:bg-secondary/60
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    bg-white/20
                  "
                >
                  <User size={20} />
                </div>

                <div
                  className="
                    min-w-0
                    flex-1
                    leading-tight
                  "
                >
                  <div
                    className="
                      text-xs
                      text-muted-foreground
                    "
                  >
                    Olá!
                  </div>

                  <div
                    className="
                      truncate
                      text-sm
                      font-bold
                    "
                  >
                    Entrar / Registrar
                  </div>
                </div>

                <ChevronDown size={15} />
              </Link>

              {/* =================================================
                  MEUS PEDIDOS
              ================================================== */}

              <div
                className="
                  hidden
                  w-[82px]
                  shrink-0
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  rounded-lg
                  py-2
                  opacity-70
                  xl:flex
                "
              >
                <Package size={21} />

                <span
                  className="
                    whitespace-nowrap
                    text-[11px]
                    font-semibold
                  "
                >
                  Meus pedidos
                </span>
              </div>

              {/* =================================================
                  RASTREIO
              ================================================== */}

              <div
                className="
                  hidden
                  w-[72px]
                  shrink-0
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  rounded-lg
                  py-2
                  opacity-70
                  xl:flex
                "
              >
                <Truck size={21} />

                <span
                  className="
                    text-[11px]
                    font-semibold
                  "
                >
                  Rastreio
                </span>
              </div>

              {/* =================================================
                  CARRINHO
              ================================================== */}

              <Link
                href="/cart"
                className="
                  relative
                  flex
                  w-[72px]
                  shrink-0
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  rounded-lg
                  py-2
                  hover:bg-secondary/60
                "
              >
                <div className="relative">
                  <ShoppingCart size={27} />

                  {cartCount > 0 && (
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
                  className="
                    text-[11px]
                    font-semibold
                  "
                >
                  Carrinho
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* =====================================================
            CATEGORIAS DESKTOP
        ====================================================== */}

        <div
          className="
            border-b
            border-white/20
            bg-transparent
            backdrop-blur-sm
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1600px]
              px-5
              xl:px-8
            "
          >
            <div
              className="
                flex
                h-[52px]
                items-center
                gap-5
              "
            >
              {/* TODAS AS CATEGORIAS */}

              <div
                className="
                  flex
                  h-9
                  shrink-0
                  items-center
                  gap-2
                  rounded-full
                  bg-primary
                  px-5
                  text-sm
                  font-bold
                  text-white
                "
              >
                <Menu size={18} />

                <span>
                  Todas as categorias
                </span>

                <ChevronDown size={15} />
              </div>

              {/* CATEGORIAS */}

              <nav
                className="
                  flex
                  min-w-0
                  flex-1
                  items-center
                  gap-5
                  overflow-x-auto
                  whitespace-nowrap
                  scrollbar-hide
                "
              >
                {categoriesLoading ? (
                  <span
                    className="
                      text-sm
                      text-muted-foreground
                    "
                  >
                    Carregando categorias...
                  </span>
                ) : categories.length === 0 ? (
                  <span
                    className="
                      text-sm
                      text-muted-foreground
                    "
                  >
                    Nenhuma categoria cadastrada
                  </span>
                ) : (
                  categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="
                        shrink-0
                        rounded-full
                        px-3
                        py-1.5
                        text-sm
                        font-semibold
                        transition
                        hover:bg-primary/10
                        hover:text-primary
                      "
                    >
                      {category.name}
                    </Link>
                  ))
                )}
              </nav>

              {/* ENTREGA */}

              <div
                className="
                  hidden
                  shrink-0
                  items-center
                  gap-2
                  text-xs
                  text-muted-foreground
                  2xl:flex
                "
              >
                <MapPin size={16} />

                <span>
                  Entregamos em Moçambique
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            BENEFÍCIOS
        ====================================================== */}

        <div
          className="
            border-b
            border-white/20
            bg-transparent
            backdrop-blur-sm
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1600px]
              px-5
              xl:px-8
            "
          >
            <div
              className="
                flex
                h-9
                items-center
                justify-center
                gap-8
                text-[11px]
                font-medium
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  whitespace-nowrap
                "
              >
                <Gift
                  size={14}
                  className="text-primary"
                />

                Cupons exclusivos EXPREMIUM
              </div>

              <div className="h-4 w-px bg-border" />

              <div
                className="
                  flex
                  items-center
                  gap-2
                  whitespace-nowrap
                "
              >
                <Package
                  size={14}
                  className="text-primary"
                />

                Rastreamento disponível
              </div>

              <div className="h-4 w-px bg-border" />

              <div
                className="
                  flex
                  items-center
                  gap-2
                  whitespace-nowrap
                "
              >
                <Zap
                  size={14}
                  className="text-primary"
                />

                Ofertas todos os dias
              </div>

              <div className="h-4 w-px bg-border" />

              <div
                className="
                  flex
                  items-center
                  gap-2
                  whitespace-nowrap
                "
              >
                <Headphones
                  size={14}
                  className="text-primary"
                />

                Suporte ao cliente
              </div>
            </div>
          </div>
        </div>

        <div className="h-1 bg-primary" />
      </header>

      {/* =========================================================
          MOBILE
      ========================================================== */}

      <div className="md:hidden">

        {/* PARTE SUPERIOR */}

        <div
          className="
            bg-white/90
            backdrop-blur-md
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              px-4
              py-3
            "
          >
            {/* MENU */}

            <button
              type="button"
              onClick={() =>
                setIsMobileMenuOpen(
                  (prev) => !prev
                )
              }
              className="
                rounded-full
                p-2
                hover:bg-secondary
              "
            >
              {isMobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>

            {/* NOME DA LOJA */}

            <Link
              href="/"
              aria-label="EXPREMIUM SHOP"
              className="
                flex
                h-8
                w-[130px]
                items-center
                justify-center
                overflow-hidden
              "
            >
              <span
                className="
                  whitespace-nowrap
                  text-sm
                  font-bold
                "
              >
                EXPREMIUM SHOP
              </span>
            </Link>

            {/* AÇÕES */}

            <div
              className="
                flex
                items-center
                gap-1
              "
            >
              <Link
                href="/login"
                className="
                  rounded-full
                  p-2
                  hover:bg-secondary
                "
              >
                <User size={20} />
              </Link>

              <Link
                href="/cart"
                className="
                  relative
                  rounded-full
                  p-2
                  hover:bg-secondary
                "
              >
                <ShoppingCart size={20} />

                {cartCount > 0 && (
                  <span
                    className="
                      absolute
                      -right-1
                      -top-1
                      flex
                      h-4
                      min-w-4
                      items-center
                      justify-center
                      rounded-full
                      bg-primary
                      px-1
                      text-[9px]
                      font-bold
                      text-white
                    "
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* ESPAÇO QUANDO FIXO */}

        {mobileNavFixed && (
          <div className="h-[88px]" />
        )}

        {/* PESQUISA + CATEGORIAS MOBILE */}

        <div
          className={
            mobileNavFixed
              ? `
                fixed
                left-0
                right-0
                top-0
                z-[100]
                overflow-hidden
                bg-white/80
                shadow-md
                backdrop-blur-md
              `
              : `
                relative
                overflow-hidden
                bg-transparent
              `
          }
        >

          {/* PESQUISA MOBILE */}

          <div
            className="
              bg-transparent
              px-4
              pt-2
              pb-1
            "
          >
            <form onSubmit={handleSearch}>
              <div
                className="
                  flex
                  h-10
                  w-full
                  overflow-hidden
                  rounded-full
                  border-2
                  border-primary
                  bg-transparent
                  backdrop-blur-sm
                "
              >
                <div
                  className="
                    flex
                    shrink-0
                    items-center
                    justify-center
                    pl-4
                    text-muted-foreground
                  "
                >
                  <Search size={17} />
                </div>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Pesquisar produtos..."
                  className="
                    min-w-0
                    flex-1
                    bg-transparent
                    px-3
                    text-sm
                    outline-none
                    placeholder:text-muted-foreground
                  "
                />

                <button
                  type="submit"
                  className="
                    shrink-0
                    rounded-full
                    bg-primary
                    px-5
                    text-xs
                    font-bold
                    text-white
                  "
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>

          {/* CATEGORIAS MOBILE */}

          <div
            className="
              bg-transparent
              backdrop-blur-sm
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                overflow-x-auto
                px-4
                py-2
                whitespace-nowrap
                scrollbar-hide
              "
            >
              {categoriesLoading ? (
                <span
                  className="
                    shrink-0
                    text-sm
                    text-muted-foreground
                  "
                >
                  Carregando categorias...
                </span>
              ) : categories.length === 0 ? (
                <span
                  className="
                    shrink-0
                    text-sm
                    text-muted-foreground
                  "
                >
                  Nenhuma categoria cadastrada
                </span>
              ) : (
                categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="
                      shrink-0
                      rounded-full
                      px-3
                      py-1.5
                      text-sm
                      font-semibold
                      transition
                      hover:bg-primary/10
                      hover:text-primary
                    "
                  >
                    {category.name}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* MENU MOBILE */}

        {isMobileMenuOpen && (
          <nav
            className="
              relative
              z-[110]
              border-t
              border-border
              bg-white
            "
          >
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                hover:bg-secondary
              "
            >
              <Menu size={19} />
              Home
            </Link>

            <div
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                text-muted-foreground
              "
            >
              <Zap size={19} />
              Super Ofertas
            </div>

            <div
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                text-muted-foreground
              "
            >
              <Gift size={19} />
              Cupons
            </div>

            <div
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                text-muted-foreground
              "
            >
              <Package size={19} />
              Meus pedidos
            </div>

            <div
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                text-muted-foreground
              "
            >
              <Truck size={19} />
              Rastreio
            </div>

            <Link
              href="/login"
              onClick={closeMobileMenu}
              className="
                flex
                items-center
                gap-3
                border-t
                border-border
                px-4
                py-3
                hover:bg-secondary
              "
            >
              <User size={20} />
              Minha conta
            </Link>
          </nav>
        )}
      </div>
    </>
  )
}