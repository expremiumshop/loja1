"use client"

import { FormEvent, useState } from "react"
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function RegisterPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleRegister = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setError("")
    setSuccess("")

    const cleanName = fullName.trim()
    const cleanEmail = email.trim().toLowerCase()

    // Verificar nome
    if (!cleanName) {
      setError("Digite o seu nome completo.")
      return
    }

    // Verificar email
    if (!cleanEmail) {
      setError("Digite o seu email.")
      return
    }

    // Verificar palavra-passe
    if (!password) {
      setError("Digite uma palavra-passe.")
      return
    }

    // Tamanho mínimo
    if (password.length < 6) {
      setError(
        "A palavra-passe deve ter pelo menos 6 caracteres."
      )
      return
    }

    // Confirmar palavra-passe
    if (!confirmPassword) {
      setError("Confirme a sua palavra-passe.")
      return
    }

    // Comparar palavras-passe
    if (password !== confirmPassword) {
      setError(
        "A palavra-passe e a confirmação não são iguais."
      )
      return
    }

    setLoading(true)

    try {
      console.log("Criando conta...")
      console.log("Email:", cleanEmail)

      const { data, error: signUpError } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: cleanName,
            },
          },
        })

      if (signUpError) {
        console.error(
          "ERRO REAL DO SUPABASE:",
          signUpError
        )

        setError(
          `Erro do Supabase: ${signUpError.message}${
            signUpError.code
              ? ` | Código: ${signUpError.code}`
              : ""
          }`
        )

        return
      }

      console.log("Conta criada com sucesso.")
      console.log("User ID:", data.user?.id)
      console.log("Email:", data.user?.email)
      console.log("Session:", !!data.session)

      // Se o Supabase já criou uma sessão
      if (data.session) {
        setSuccess(
          "Conta criada com sucesso! A entrar na loja..."
        )

        setTimeout(() => {
          router.replace("/")
          router.refresh()
        }, 1000)

        return
      }

      // Se for necessário confirmar o email
      setSuccess(
        "Conta criada com sucesso! Verifique o seu email para confirmar a conta."
      )
    } catch (err) {
      console.error(
        "ERRO INESPERADO AO CRIAR CONTA:",
        err
      )

      if (err instanceof Error) {
        setError(`Erro inesperado: ${err.message}`)
      } else {
        setError(
          "Ocorreu um erro inesperado ao criar a conta."
        )
      }
    } finally {
      setLoading(false)
    }
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
            Criar a sua conta
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Crie a sua conta em poucos segundos.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">

          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >

            {/* Nome completo */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Nome completo
              </label>

              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                />

                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(event) =>
                    setFullName(event.target.value)
                  }
                  placeholder="Digite o seu nome completo"
                  autoComplete="name"
                  disabled={loading}
                  className="w-full h-12 rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                />

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

            {/* Palavra-passe */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Palavra-passe
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                />

                <input
                  id="password"
                  type={
                    showPassword ? "text" : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Crie uma palavra-passe"
                  autoComplete="new-password"
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

              <p className="mt-2 text-xs text-slate-500">
                Mínimo de 6 caracteres.
              </p>
            </div>

            {/* Confirmar palavra-passe */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Confirmar palavra-passe
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                />

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Digite novamente a palavra-passe"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full h-12 rounded-xl border border-slate-300 bg-white pl-11 pr-12 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100 disabled:cursor-not-allowed"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 disabled:cursor-not-allowed"
                  aria-label={
                    showConfirmPassword
                      ? "Ocultar confirmação"
                      : "Mostrar confirmação"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 break-words">
                <p className="font-semibold mb-1">
                  Não foi possível criar a conta
                </p>

                <p>{error}</p>
              </div>
            )}

            {/* Sucesso */}
            {success && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 break-words">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />

                  <p>{success}</p>
                </div>
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-primary text-white font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  A criar conta...
                </>
              ) : (
                "Criar conta"
              )}
            </button>
          </form>

          {/* Login */}
          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-500">
              Já tem uma conta?
            </p>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 mt-2 text-sm font-semibold text-primary hover:underline"
            >
              Entrar na conta
            </Link>
          </div>
        </div>

        {/* Voltar */}
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