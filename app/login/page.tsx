"use client"

import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  User,
} from "lucide-react"
import Link from "next/link"
import { FormEvent, Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [error, setError] = useState("")

  // =====================================================
  // VERIFICAR SE JÁ ESTÁ AUTENTICADO
  // =====================================================

  useEffect(() => {
    let mounted = true

    async function checkSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!mounted) return

        if (session) {
          const next = searchParams.get("next")

          router.replace(
            next && next.startsWith("/")
              ? next
              : "/admin"
          )

          return
        }

        setCheckingSession(false)
      } catch (error) {
        console.error(
          "Erro ao verificar sessão:",
          error
        )

        if (mounted) {
          setCheckingSession(false)
        }
      }
    }

    checkSession()

    return () => {
      mounted = false
    }
  }, [router, searchParams])

  // =====================================================
  // LOGIN EXCLUSIVAMENTE COM NOME DE USUÁRIO
  // =====================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (loading) return

    setError("")

    const cleanUsername = username.trim()

    if (!cleanUsername) {
      setError("Digite o seu nome de usuário.")
      return
    }

    if (!password) {
      setError("Digite a sua palavra-passe.")
      return
    }

    setLoading(true)

    try {
      // =================================================
      // 1. PROCURAR O EMAIL INTERNAMENTE PELO USERNAME
      // =================================================

      const {
        data: email,
        error: usernameError,
      } = await supabase.rpc(
        "get_email_by_username",
        {
          p_username: cleanUsername,
        }
      )

      if (usernameError) {
        console.error(
          "Erro ao procurar nome de usuário:",
          usernameError
        )

        setError(
          "Não foi possível verificar o nome de usuário."
        )

        setLoading(false)
        return
      }

      // =================================================
      // 2. USERNAME NÃO ENCONTRADO
      // =================================================

      if (!email) {
        setError(
          "Nome de usuário ou palavra-passe incorretos."
        )

        setLoading(false)
        return
      }

      // =================================================
      // 3. LOGIN NO SUPABASE USANDO O EMAIL INTERNO
      // =================================================

      const {
        data,
        error: loginError,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError || !data.session) {
        console.error(
          "Erro de login:",
          loginError
        )

        setError(
          "Nome de usuário ou palavra-passe incorretos."
        )

        setLoading(false)
        return
      }

      // =================================================
      // 4. LOGIN CONCLUÍDO
      // =================================================

      const next = searchParams.get("next")

      const nextPath =
        next && next.startsWith("/")
          ? next
          : "/admin"

      router.replace(nextPath)
      router.refresh()
    } catch (error) {
      console.error(
        "Erro inesperado no login:",
        error
      )

      setError(
        "Ocorreu um erro ao tentar entrar. Tente novamente."
      )

      setLoading(false)
    }
  }

  // =====================================================
  // LOADING INICIAL
  // =====================================================

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />

          <p className="text-sm text-gray-500">
            A verificar sessão...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">

        {/* =================================================
            CARD DE LOGIN
        ================================================= */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          {/* =================================================
              LOGO / NOME DA LOJA
          ================================================= */}

          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
              <Lock className="h-7 w-7" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              FOCHINETI FASHION
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Entre na sua conta
            </p>
          </div>

          {/* =================================================
              ERRO
          ================================================= */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* =================================================
              FORMULÁRIO
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* =================================================
                NOME DE USUÁRIO
            ================================================= */}

            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Nome de usuário
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value)
                  }
                  autoComplete="username"
                  autoFocus
                  disabled={loading}
                  placeholder="Digite o seu nome de usuário"
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* =================================================
                PALAVRA-PASSE
            ================================================= */}

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Palavra-passe
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Esqueceu a palavra-passe?
                </Link>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                  disabled={loading}
                  placeholder="Digite a sua palavra-passe"
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-12 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 transition hover:text-gray-700 disabled:cursor-not-allowed"
                  aria-label={
                    showPassword
                      ? "Ocultar palavra-passe"
                      : "Mostrar palavra-passe"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* =================================================
                BOTÃO ENTRAR
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  A entrar...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          {/* =================================================
              REGISTRO
          ================================================= */}

          <div className="mt-6 border-t border-gray-200 pt-6 text-center">
            <p className="text-sm text-gray-500">
              Ainda não tem uma conta?
            </p>

            <Link
              href="/register"
              className="mt-1 inline-block text-sm font-semibold text-primary hover:underline"
            >
              Criar conta
            </Link>
          </div>
        </div>

        {/* =================================================
            RODAPÉ
        ================================================= */}

        <p className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} FOCHINETI FASHION
        </p>
      </div>
    </main>
  )
}

// =========================================================
// PÁGINA
// =========================================================

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  )
}