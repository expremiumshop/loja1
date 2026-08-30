"use client"

import {
  FormEvent,
  Suspense,
  useEffect,
  useState,
} from "react"

import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  User,
} from "lucide-react"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [error, setError] = useState("")

  const nextPath = searchParams.get("next") || "/"

  useEffect(() => {
    let mounted = true

    async function checkSession() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (!mounted) return

        if (sessionError) {
          console.error(
            "Erro ao verificar sessão:",
            sessionError
          )

          setError(sessionError.message)
          setCheckingSession(false)
          return
        }

        if (session?.user) {
          router.replace(nextPath)
          return
        }

        setCheckingSession(false)
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

          setCheckingSession(false)
        }
      }
    }

    checkSession()

    return () => {
      mounted = false
    }
  }, [router, nextPath])

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (loading) return

    setError("")

    const cleanLogin = login.trim().toLowerCase()

    if (!cleanLogin) {
      setError(
        "Digite o email ou nome de utilizador."
      )
      return
    }

    if (!password) {
      setError(
        "Digite a palavra-passe."
      )
      return
    }

    setLoading(true)

    try {
      let emailToLogin = cleanLogin

      const isEmail = cleanLogin.includes("@")

      if (!isEmail) {
        console.log(
          "Procurando utilizador:",
          cleanLogin
        )

        const {
          data: email,
          error: usernameError,
        } = await supabase.rpc(
          "get_email_by_username",
          {
            p_username: cleanLogin,
          }
        )

        if (usernameError) {
          console.error(
            "Erro ao procurar utilizador:",
            usernameError
          )

          setError(
            "Não foi possível verificar o nome de utilizador."
          )

          setLoading(false)
          return
        }

        if (!email) {
          setError(
            "Nome de utilizador não encontrado."
          )

          setLoading(false)
          return
        }

        emailToLogin = email

        console.log(
          "Nome de utilizador encontrado."
        )
      }

      const {
        data,
        error: loginError,
      } = await supabase.auth.signInWithPassword({
        email: emailToLogin,
        password,
      })

      if (loginError) {
        console.error(
          "Erro no login:",
          loginError
        )

        const message =
          loginError.message.toLowerCase()

        if (
          message.includes("email not confirmed")
        ) {
          setError(
            "O email ainda não foi confirmado."
          )
        } else if (
          message.includes(
            "invalid login credentials"
          )
        ) {
          setError(
            "Email/nome de utilizador ou palavra-passe incorretos."
          )
        } else {
          setError(loginError.message)
        }

        setLoading(false)
        return
      }

      if (!data.user) {
        setError(
          "O Supabase não devolveu o utilizador."
        )

        setLoading(false)
        return
      }

      const {
        data: sessionData,
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error(
          "Erro ao confirmar sessão:",
          sessionError
        )

        setError(
          `Não foi possível confirmar a sessão: ${sessionError.message}`
        )

        setLoading(false)
        return
      }

      if (!sessionData.session) {
        setError(
          "O login foi realizado, mas a sessão não ficou disponível."
        )

        setLoading(false)
        return
      }

      console.log(
        "LOGIN REALIZADO COM SUCESSO:",
        data.user.id
      )

      router.replace(nextPath)
      router.refresh()
    } catch (error) {
      console.error(
        "Erro inesperado no login:",
        error
      )

      setError(
        error instanceof Error
          ? error.message
          : "Erro inesperado durante o login."
      )

      setLoading(false)
    }
  }

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
            FOCHINETI FASHION
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

            <div>
              <label
                htmlFor="login"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email ou nome de utilizador
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  id="login"
                  type="text"
                  value={login}
                  onChange={(event) =>
                    setLogin(event.target.value)
                  }
                  placeholder="Email ou nome de utilizador"
                  autoComplete="username"
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>
            </div>

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
                    setPassword(event.target.value)
                  }
                  placeholder="Digite a sua palavra-passe"
                  autoComplete="current-password"
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-12 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
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

            {error && (
              <div className="break-words rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <p className="mb-1 font-semibold">
                  Não foi possível entrar
                </p>

                <p>
                  {error}
                </p>
              </div>
            )}

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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />

            <p className="text-sm text-slate-500">
              A carregar...
            </p>
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  )
}