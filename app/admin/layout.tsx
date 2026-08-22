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
} from "lucide-react"

import { supabase } from "@/lib/supabase"

const links = [
  ["/admin", "Dashboard", LayoutDashboard],
  ["/admin/products", "Produtos", Package],
  ["/admin/orders", "Pedidos", ShoppingCart],
  ["/admin/customers", "Clientes", Users],
  ["/admin/marketing", "Marketing", Megaphone],
  ["/admin/theme", "Personalizar Loja", Palette],
  ["/admin/configuracoes", "Configurações", Settings],
] as const

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const [checking, setChecking] = useState(true)
  const [allowed, setAllowed] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    let mounted = true

    async function checkAccess() {
      try {
        setChecking(true)
        setErrorMessage("")
        setAllowed(false)

        // =====================================================
        // SESSÃO
        // =====================================================

        const {
          data: sessionData,
          error: sessionError,
        } = await supabase.auth.getSession()

        console.log(
          "ADMIN SESSION:",
          sessionData.session
        )

        console.log(
          "ADMIN SESSION ERROR:",
          sessionError
        )

        if (sessionError) {
          if (mounted) {
            setErrorMessage(
              `Erro ao verificar sessão: ${sessionError.message}`
            )
          }

          return
        }

        const user =
          sessionData.session?.user

        // =====================================================
        // SEM USUÁRIO
        // =====================================================

        if (!user) {
          if (mounted) {
            setErrorMessage(
              "Nenhum usuário autenticado foi encontrado."
            )
          }

          return
        }

        console.log(
          "ADMIN USER:",
          user.id
        )

        // =====================================================
        // VERIFICAR ADMIN
        // =====================================================

        const {
          data: admin,
          error: adminError,
        } = await supabase
          .from("admins")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle()

        console.log(
          "ADMIN RECORD:",
          admin
        )

        console.log(
          "ADMIN ERROR:",
          adminError
        )

        if (adminError) {
          if (mounted) {
            setErrorMessage(
              `Erro ao consultar admins: ${adminError.message}`
            )
          }

          return
        }

        if (!admin) {
          if (mounted) {
            setErrorMessage(
              "O usuário está autenticado, mas não está cadastrado na tabela admins."
            )
          }

          return
        }

        // =====================================================
        // AUTORIZADO
        // =====================================================

        if (mounted) {
          setAllowed(true)
          setErrorMessage("")
        }
      } catch (error) {
        console.error(
          "Erro ao verificar acesso:",
          error
        )

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

    // =====================================================
    // OUVIR LOGIN / LOGOUT
    // =====================================================

    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        async () => {
          await checkAccess()
        }
      )

    return () => {
      mounted = false

      authListener.subscription.unsubscribe()
    }
  }, [pathname])

  // =====================================================
  // CARREGANDO
  // =====================================================

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
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

          <p className="text-gray-600">
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
          p-6
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
            p-8
            shadow-lg
          "
        >

          <h1 className="text-2xl font-bold text-red-600">
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

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="
                flex-1
                rounded-xl
                bg-emerald-500
                px-5
                py-3
                font-bold
                text-white
                hover:bg-emerald-600
              "
            >
              Tentar novamente
            </button>

            <Link
              href={`/login?next=${encodeURIComponent(
                pathname
              )}`}
              className="
                flex-1
                rounded-xl
                border
                border-gray-300
                px-5
                py-3
                text-center
                font-bold
                text-gray-700
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
    <div className="flex min-h-screen bg-gray-100">

      <aside
        className="
          hidden
          w-64
          shrink-0
          bg-slate-900
          p-6
          text-white
          md:block
        "
      >

        <h1 className="mb-10 text-xl font-bold">
          PAINEL DE ADMINISTRAÇÃO
        </h1>

        <nav className="space-y-3">

          {links.map(
            ([href, label, Icon]) => (
              <Link
                key={href}
                href={href}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  p-3
                  transition
                  hover:bg-slate-800
                "
              >
                <Icon size={20} />

                <span>
                  {label}
                </span>
              </Link>
            )
          )}

        </nav>

      </aside>

      <main className="min-w-0 flex-1 p-4 md:p-8">
        {children}
      </main>

    </div>
  )
}