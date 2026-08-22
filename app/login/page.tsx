"use client"

import {
  FormEvent,
  useEffect,
  useState,
} from "react"

import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react"

import Link from "next/link"

import {
  useRouter,
  useSearchParams,
} from "next/navigation"

import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [showPassword, setShowPassword] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const [checkingSession, setCheckingSession] =
    useState(true)

  const [error, setError] =
    useState("")

  const nextPath =
    searchParams.get("next") || "/"

  // =====================================================
  // VERIFICAR SESSÃO
  // =====================================================

  useEffect(() => {
    let mounted = true

    async function checkSession() {
      try {
        setCheckingSession(true)

        const {
          data,
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error(
            "Erro ao verificar sessão:",
            sessionError
          )

          if (mounted) {
            setError(
              sessionError.message
            )
          }

          return
        }

        if (data.session?.user) {
          console.log(
            "Sessão encontrada:",
            data.session.user.id
          )

          router.replace(nextPath)
          return
        }
      } catch (error) {
        console.error(
          "Erro ao verificar sessão:",
          error
        )

        if (mounted) {
          setError(
            error instanceof Error
              ? error.message
              : "Erro ao verificar sessão."
          )
        }
      } finally {
        if (mounted) {
          setCheckingSession(false)
        }
      }
    }

    checkSession()

    return () => {
      mounted = false
    }
  }, [router, nextPath])

  // =====================================================
  // LOGIN
  // =====================================================

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")

    const cleanEmail = email.trim()

    if (!cleanEmail || !password) {
      setError(
        "Preencha o email e a palavra-passe."
      )

      return
    }

    setLoading(true)

    try {
      const {
        data,
        error: loginError,
      } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })

      if (loginError) {
        console.error(
          "Erro no login:",
          loginError
        )

        setError(
          `Erro do Supabase: ${loginError.message}`
        )

        return
      }

      if (!data.session || !data.user) {
        setError(
          "O login foi aceito, mas nenhuma sessão foi criada."
        )

        return
      }

      console.log(
        "LOGIN OK:",
        data.user.id
      )

      // =================================================
      // CONFIRMAR A SESSÃO NO MESMO CLIENTE
      // =================================================

      const {
        data: sessionCheck,
        error: sessionCheckError,
      } = await supabase.auth.getSession()

      if (sessionCheckError) {
        setError(
          `Não foi possível confirmar a sessão: ${sessionCheckError.message}`
        )

        return
      }

      if (!sessionCheck.session) {
        setError(
          "A sessão não ficou disponível no navegador."
        )

        return
      }

      console.log(
        "SESSÃO CONFIRMADA:",
        sessionCheck.session.user.id
      )

      router.replace(nextPath)
      router.refresh()
    } catch (error) {
      console.error(
        "Erro inesperado:",
        error
      )

      setError(
        error instanceof Error
          ? error.message
          : "Erro inesperado durante o login."
      )
    } finally {
      setLoading(false)
    }
  }

  // =====================================================
  // CARREGANDO
  // =====================================================

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />

          <p className="text-sm text-slate-500">
            A verificar sessão...
          </p>
        </div>
      </main>
    )
  }

  // =====================================================
  // PÁGINA
  // =====================================================

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white">
              E
            </div>

            <span className="text-2xl font-bold text-slate-900">
              EXPREMIUM SHOP
            </span>
          </Link>

          <h1 className="mt-8 text-2xl font-bold text-slate-900">
            Bem-vindo de volta
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Entre na sua conta para continuar.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
            {/* EMAIL */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="seuemail@exemplo.com"
                  autoComplete="email"
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100"
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Palavra-passe
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Digite a sua palavra-passe"
                  autoComplete="current-password"
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-12 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* ERRO */}

            {error && (
              <div className="break-words rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <p className="mb-1 font-semibold">
                  Não foi possível entrar
                </p>

                <p>{error}</p>
              </div>
            )}

            {/* ENTRAR */}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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

          <div className="mt-6 border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Ainda não tem uma conta?
            </p>

            <Link
              href="/register"
              className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <User className="h-4 w-4" />
              Criar conta
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            ← Voltar para a loja
          </Link>
        </div>

      </div>
    </main>
  )
}