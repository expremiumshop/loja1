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
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (loading) return

    setError("")
    setSuccess("")

    const cleanName = fullName.trim()
    const cleanUsername = username.trim().toLowerCase()
    const cleanEmail = email.trim().toLowerCase()

    // =========================
    // VALIDAÇÕES
    // =========================

    if (!cleanName) {
      setError("Digite o seu nome completo.")
      return
    }

    if (!cleanUsername) {
      setError("Digite um nome de utilizador.")
      return
    }

    if (!/^[a-z0-9._-]+$/.test(cleanUsername)) {
      setError(
        "O nome de utilizador pode conter apenas letras, números, ponto, hífen e underscore."
      )
      return
    }

    if (cleanUsername.length < 3) {
      setError("O nome de utilizador deve ter pelo menos 3 caracteres.")
      return
    }

    if (!cleanEmail) {
      setError("Digite o seu email.")
      return
    }

    if (!password) {
      setError("Digite uma palavra-passe.")
      return
    }

    if (password.length < 6) {
      setError("A palavra-passe deve ter pelo menos 6 caracteres.")
      return
    }

    if (!confirmPassword) {
      setError("Confirme a sua palavra-passe.")
      return
    }

    if (password !== confirmPassword) {
      setError("A palavra-passe e a confirmação não são iguais.")
      return
    }

    setLoading(true)

    try {
      // =========================
      // VERIFICAR USERNAME
      // =========================

      const { data: existingProfile, error: usernameError } =
        await supabase
          .from("profiles")
          .select("id")
          .eq("username", cleanUsername)
          .maybeSingle()

      if (usernameError) {
        console.error(
          "ERRO AO VERIFICAR USERNAME:",
          usernameError
        )

        setError(
          `Não foi possível verificar o nome de utilizador: ${usernameError.message}`
        )

        return
      }

      if (existingProfile) {
        setError("Este nome de utilizador já está em uso.")
        return
      }

      // =========================
      // CRIAR CONTA NO SUPABASE AUTH
      // =========================

      console.log("Criando conta...")
      console.log("Email:", cleanEmail)
      console.log("Username:", cleanUsername)

      const { data, error: signUpError } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: cleanName,
              username: cleanUsername,
            },
          },
        })

      if (signUpError) {
        console.error(
          "ERRO REAL DO SUPABASE:",
          signUpError
        )

        if (
          signUpError.message
            .toLowerCase()
            .includes("rate limit")
        ) {
          setError(
            "O limite de envio de emails do Supabase foi atingido. Aguarde alguns minutos antes de tentar novamente."
          )
        } else {
          setError(
            `Erro ao criar conta: ${signUpError.message}`
          )
        }

        return
      }

      if (!data.user) {
        setError(
          "A conta não foi criada porque o Supabase não devolveu o utilizador."
        )
        return
      }

      console.log("UTILIZADOR CRIADO:", data.user.id)

      // =========================
      // A TRIGGER CRIA O PROFILE
      // AUTOMATICAMENTE
      // =========================

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

      // =========================
      // CONFIRMAÇÃO DE EMAIL
      // =========================

      setSuccess(
        "Conta criada com sucesso! Verifique o seu email para confirmar a conta."
      )
    } catch (err) {
      console.error(
        "ERRO INESPERADO AO CRIAR CONTA:",
        err
      )

      if (err instanceof Error) {
        setError(
          `Erro ao criar conta: ${err.message}`
        )
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

        {/* LOGO */}

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

        {/* CARD */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">

          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >

            {/* NOME COMPLETO */}

            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Nome completo
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

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

            {/* NOME DE UTILIZADOR */}

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Nome de utilizador
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) =>
                    setUsername(
                      event.target.value.toLowerCase()
                    )
                  }
                  placeholder="ex: joaosilva"
                  autoComplete="username"
                  disabled={loading}
                  className="w-full h-12 rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Será usado para entrar na sua conta.
              </p>
            </div>

            {/* EMAIL */}

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

            {/* PALAVRA-PASSE */}

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
                    showPassword
                      ? "text"
                      : "password"
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

            {/* CONFIRMAR PALAVRA-PASSE */}

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Confirmar palavra-passe
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
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

            {/* ERRO */}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 break-words">
                <p className="font-semibold mb-1">
                  Não foi possível criar a conta
                </p>

                <p>{error}</p>
              </div>
            )}

            {/* SUCESSO */}

            {success && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 break-words">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />

                  <p>{success}</p>
                </div>
              </div>
            )}

            {/* BOTÃO */}

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

          {/* LOGIN */}

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

        {/* VOLTAR */}

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