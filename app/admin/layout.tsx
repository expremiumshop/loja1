"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Megaphone,
  Palette,
  Settings,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

// =====================================================
// LINKS DO PAINEL
// =====================================================

const links = [
  ["/admin", "Dashboard", LayoutDashboard],
  ["/admin/products", "Produtos", Package],
  ["/admin/orders", "Pedidos", ShoppingCart],
  ["/admin/customers", "Clientes", Users],
  ["/admin/marketing", "Marketing", Megaphone],
  ["/admin/theme", "Personalizar Loja", Palette],
  ["/admin/configuracoes", "Configurações", Settings],
] as const

// =====================================================
// LAYOUT ADMIN
// =====================================================

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const [checking, setChecking] = useState(true)
  const [allowed, setAllowed] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // =====================================================
  // MENU MOBILE
  // =====================================================

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // =====================================================
  // VERIFICAR AUTENTICAÇÃO
  // =====================================================

  useEffect(() => {
    let mounted = true

    async function checkAccess() {
      try {
        setChecking(true)
        setErrorMessage("")
        setAllowed(false)

        const {
          data: sessionData,
          error: sessionError,
        } = await supabase.auth.getSession()

        console.log("ADMIN SESSION:", sessionData.session)
        console.log("ADMIN SESSION ERROR:", sessionError)

        if (sessionError) {
          if (mounted) {
            setErrorMessage(
              `Erro ao verificar sessão: ${sessionError.message}`
            )
          }
          return
        }

        const user = sessionData.session?.user

        console.log("ADMIN USER:", user?.id)

        if (!user) {
          if (mounted) {
            setErrorMessage(
              "Nenhum usuário autenticado foi encontrado."
            )
          }
          return
        }

        if (mounted) {
          setAllowed(true)
          setErrorMessage("")
        }
      } catch (error) {
        console.error("Erro ao verificar acesso:", error)

        if (mounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Erro ao verificar acesso."
          )
        }
      } finally {
        if (mounted) {
          setChecking(false)
        }
      }
    }

    checkAccess()

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange(async () => {
      await checkAccess()
    })

    return () => {
      mounted = false
      authListener.subscription.unsubscribe()
    }
  }, [pathname])

  // =====================================================
  // FECHAR MENU MOBILE AO MUDAR DE PÁGINA
  // =====================================================

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // =====================================================
  // CARREGANDO
  // =====================================================

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="text-center">
          <div
            className="
              mx-auto
              mb-4
              h-10
              w-10
              animate-spin
              rounded-full
              border-4
              border-gray-200
              border-t-emerald-500
            "
          />

          <p className="text-sm text-gray-600 sm:text-base">
            A verificar acesso ao painel...
          </p>
        </div>
      </main>
    )
  }

  // =====================================================
  // ACESSO NEGADO
  // =====================================================

  if (!allowed) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-gray-100
          p-4
          sm:p-6
        "
      >
        <div
          className="
            w-full
            max-w-xl
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-5
            shadow-lg
            sm:p-8
          "
        >
          <div
            className="
              mb-5
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-red-50
              text-red-600
            "
          >
            <ShieldCheck size={25} />
          </div>

          <h1
            className="
              text-xl
              font-bold
              text-red-600
              sm:text-2xl
            "
          >
            Acesso ao painel negado
          </h1>

          <p
            className="
              mt-4
              break-words
              text-sm
              leading-6
              text-gray-600
            "
          >
            {errorMessage}
          </p>

          <div
            className="
              mt-6
              flex
              flex-col
              gap-3
              sm:flex-row
            "
          >
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="
                flex-1
                rounded-xl
                bg-emerald-500
                px-5
                py-3
                text-sm
                font-bold
                text-white
                transition
                hover:bg-emerald-600
              "
            >
              Tentar novamente
            </button>

            <Link
              href={`/login?next=${encodeURIComponent(pathname)}`}
              className="
                flex-1
                rounded-xl
                border
                border-gray-300
                px-5
                py-3
                text-center
                text-sm
                font-bold
                text-gray-700
                transition
                hover:bg-gray-50
              "
            >
              Entrar novamente
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // =====================================================
  // PAINEL
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* =================================================
          CABEÇALHO MOBILE
          ================================================= */}

      <header
        className="
          sticky
          top-0
          z-50
          flex
          h-16
          items-center
          justify-between
          border-b
          border-gray-200
          bg-white
          px-4
          shadow-sm
          md:hidden
        "
      >
        {/* BOTÃO MENU */}

        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(
              (previous) => !previous
            )
          }
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            border
            border-gray-200
            text-gray-700
            transition
            hover:bg-gray-100
          "
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>

        {/* LOGOTIPO DA LOJA */}

        <div className="flex min-w-0 items-center gap-2">

          <div className="min-w-0">
            <p
              className="
                truncate
                text-sm
                font-bold
                text-gray-900
              "
            >
              FOCHINETI FASHION
            </p>

            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
              Painel
            </p>
          </div>
        </div>

        {/* ESPAÇO PARA CENTRALIZAR */}

        <div className="h-10 w-10" />
      </header>

      {/* =================================================
          FUNDO ESCURO DO MENU MOBILE
          ================================================= */}

      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setMobileMenuOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            md:hidden
          "
        />
      )}

      {/* =================================================
          MENU MOBILE
          ================================================= */}

      <aside
        className={`
          fixed
          bottom-0
          left-0
          top-0
          z-50
          flex
          w-[280px]
          max-w-[85vw]
          flex-col
          bg-slate-900
          text-white
          shadow-2xl
          transition-transform
          duration-300
          md:hidden
          ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* CABEÇALHO DO MENU */}

        <div
          className="
            flex
            h-16
            shrink-0
            items-center
            justify-between
            border-b
            border-slate-800
            px-4
          "
        >
          <div className="flex items-center gap-3">

            <div>
              <p className="text-sm font-bold">
                FOCHINETI FASHION
              </p>

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Painel
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="
              rounded-lg
              p-2
              text-slate-400
              transition
              hover:bg-slate-800
              hover:text-white
            "
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVEGAÇÃO */}

        <nav
          className="
            flex-1
            overflow-y-auto
            px-3
            py-5
          "
        >
          <p
            className="
              mb-3
              px-3
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-slate-500
            "
          >
            Menu principal
          </p>

          <div className="space-y-1">
            {links.map(
              ([href, label, Icon]) => {
                const isActive =
                  pathname === href ||
                  (href !== "/admin" &&
                    pathname.startsWith(
                      `${href}/`
                    ))

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className={`
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-3
                      text-sm
                      font-medium
                      transition
                      ${
                        isActive
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }
                    `}
                  >
                    <Icon
                      size={19}
                      className="shrink-0"
                    />

                    <span>{label}</span>
                  </Link>
                )
              }
            )}
          </div>
        </nav>

        {/* RODAPÉ DO MENU */}

        <div
          className="
            shrink-0
            border-t
            border-slate-800
            p-4
          "
        >
          <div
            className="
              rounded-xl
              bg-slate-800
              p-3
            "
          >
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              Loja
            </p>

            <p
              className="
                mt-1
                truncate
                text-xs
                font-medium
                text-slate-200
              "
            >
              Fochineti Fashion
            </p>
          </div>
        </div>
      </aside>

      {/* =================================================
          LAYOUT DESKTOP + CONTEÚDO
          ================================================= */}

      <div className="flex min-h-screen">

        {/* =================================================
            SIDEBAR DESKTOP
            ================================================= */}

        <aside
          className="
            sticky
            top-0
            hidden
            h-screen
            w-64
            shrink-0
            flex-col
            bg-slate-900
            text-white
            md:flex
          "
        >
          {/* LOGOTIPO */}

          <div
            className="
              border-b
              border-slate-800
              p-6
            "
          >
            <div className="flex items-center gap-3">

              <div className="min-w-0">
                <h1
                  className="
                    truncate
                    text-base
                    font-bold
                  "
                >
                  FOCHINETI FASHION
                </h1>

                <p
                  className="
                    mt-0.5
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  Painel
                </p>
              </div>

            </div>
          </div>

          {/* NAVEGAÇÃO */}

          <nav
            className="
              flex-1
              overflow-y-auto
              px-4
              py-6
            "
          >
            <p
              className="
                mb-3
                px-2
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              Menu principal
            </p>

            <div className="space-y-1">
              {links.map(
                ([href, label, Icon]) => {
                  const isActive =
                    pathname === href ||
                    (href !== "/admin" &&
                      pathname.startsWith(
                        `${href}/`
                      ))

                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        text-sm
                        font-medium
                        transition
                        ${
                          isActive
                            ? "bg-emerald-500 text-white shadow-sm"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }
                      `}
                    >
                      <Icon
                        size={20}
                        className="shrink-0"
                      />

                      <span>{label}</span>
                    </Link>
                  )
                }
              )}
            </div>
          </nav>

          {/* RODAPÉ */}

          <div
            className="
              border-t
              border-slate-800
              p-4
            "
          >
            <div
              className="
                rounded-xl
                bg-slate-800
                p-3
              "
            >
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                Loja
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-xs
                  font-medium
                  text-slate-200
                "
              >
                Fochineti Fashion
              </p>
            </div>
          </div>
        </aside>

        {/* =================================================
            ÁREA PRINCIPAL
            ================================================= */}

        <main
          className="
            min-w-0
            flex-1
            overflow-x-hidden
            bg-gray-100
          "
        >

          {/* =================================================
              BARRA SUPERIOR DESKTOP
              ================================================= */}

          <div
            className="
              hidden
              h-16
              items-center
              justify-between
              border-b
              border-gray-200
              bg-white
              px-6
              lg:flex
              xl:px-8
            "
          >
            <div>
              <p
                className="
                  text-xs
                  font-medium
                  text-gray-400
                "
              >
                Painel
              </p>

              <p
                className="
                  text-sm
                  font-bold
                  text-gray-900
                "
              >
                {getPageTitle(pathname)}
              </p>
            </div>

            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                bg-emerald-50
                px-3
                py-1.5
                text-xs
                font-semibold
                text-emerald-700
              "
            >
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-emerald-500
                "
              />

              Loja online
            </div>
          </div>

          {/* =================================================
              CONTEÚDO DAS PÁGINAS
              ================================================= */}

          <div
            className="
              w-full
              p-3
              sm:p-4
              md:p-6
              lg:p-8
            "
          >
            {children}
          </div>

        </main>
      </div>
    </div>
  )
}

// =====================================================
// TÍTULO DA PÁGINA
// =====================================================

function getPageTitle(pathname: string) {
  if (pathname === "/admin") {
    return "Dashboard"
  }

  if (pathname.startsWith("/admin/products")) {
    return "Produtos"
  }

  if (pathname.startsWith("/admin/orders")) {
    return "Pedidos"
  }

  if (pathname.startsWith("/admin/customers")) {
    return "Clientes"
  }

  if (pathname.startsWith("/admin/marketing")) {
    return "Marketing"
  }

  if (pathname.startsWith("/admin/theme")) {
    return "Personalizar Loja"
  }

  if (
    pathname.startsWith(
      "/admin/configuracoes"
    )
  ) {
    return "Configurações"
  }

  return "Administração"
}