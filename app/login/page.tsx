"use client"

import { FormEvent, useEffect, useState } from "react"
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Erro ao verificar sessão:", sessionError)
          setError(
            `Erro ao verificar sessão: ${sessionError.message}`
          )
        }

        if (session) {
          router.replace("/")
          return
        }
      } catch (err) {
        console.error("Erro inesperado:", err)

        setError(
          err instanceof Error
            ? err.message
            : "Erro inesperado ao verificar sessão."
        )
      } finally {
        setCheckingSession(false)
      }
    }

    checkSession()
  }, [router])

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError("")

    const cleanEmail = email.trim()

    if (!cleanEmail || !password) {
      setError("Preencha o email e a palavra-passe.")
      return
    }

    setLoading(true)

    try {
      console.log("Tentando iniciar sessão...")
      console.log("Email:", cleanEmail)

      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        })

      if (loginError) {
        console.error(
          "ERRO REAL DO SUPABASE:",
          loginError
        )

        console.error("Mensagem:", loginError.message)
        console.error("Código:", loginError.code)
        console.error("Status:", loginError.status)

        setError(
          `Erro do Supabase: ${loginError.message}${
            loginError.code
              ? ` | Código: ${loginError.code}`
              : ""
          }${
            loginError.status
              ? ` | Status: ${loginError.status}`
              : ""
          }`
        )

        return
      }

      console.log("LOGIN REALIZADO COM SUCESSO")
      console.log("User ID:", data.user?.id)
      console.log("Email:", data.user?.email)
      console.log("Session:", !!data.session)

      if (!data.session) {
        setError(
          "O Supabase aceitou o login, mas não criou uma sessão."
        )
        return
      }

      router.replace("/")
      router.refresh()
    } catch (err) {
      console.error("ERRO INESPERADO NO LOGIN:", err)

      if (err instanceof Error) {
        setError(`Erro inesperado: ${err.message}`)
      } else {
        setError(
          "Ocorreu um erro inesperado durante o login."
        )
      }
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />

          <p className="text-sm text-slate-500">
            A verificar sessão...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl">
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

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="seuemail@exemplo.com"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full h-12 rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Palavra-passe
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                <input
                  id="password"
                  type={
                    showPassword ? "text" : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Digite a sua palavra-passe"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full h-12 rounded-xl border border-slate-300 bg-white pl-11 pr-12 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100 disabled:cursor-not-allowed"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 disabled:cursor-not-allowed"
                  aria-label={
                    showPassword
                      ? "Ocultar palavra-passe"
                      : "Mostrar palavra-passe"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Esqueceu a palavra-passe?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 break-words">
                <p className="font-semibold mb-1">
                  Não foi possível entrar
                </p>

                <p>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-primary text-white font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  A entrar...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          {/* Register */}
          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-500">
              Ainda não tem uma conta?
            </p>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 mt-2 text-sm font-semibold text-primary hover:underline"
            >
              <User className="w-4 h-4" />
              Criar conta
            </Link>
          </div>
        </div>

        {/* Back */}
        <div className="text-center mt-6">
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