"use client"

import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogOut,
  Save,
  Shield,
  User,
} from "lucide-react"
import { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function SecurityPage() {
  const router = useRouter()

  // =====================================================
  // DADOS DA CONTA
  // =====================================================

  const [userId, setUserId] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [loadingAccount, setLoadingAccount] = useState(true)

  // =====================================================
  // VISUALIZAÇÃO DA PALAVRA-PASSE NA INFORMAÇÃO DA CONTA
  // =====================================================

  const [showAccountPassword, setShowAccountPassword] =
    useState(false)

  // =====================================================
  // ALTERAR PALAVRA-PASSE
  // =====================================================

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false)

  const [showNewPassword, setShowNewPassword] =
    useState(false)

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [changingPassword, setChangingPassword] =
    useState(false)

  // =====================================================
  // ALTERAR USERNAME
  // =====================================================

  const [newUsername, setNewUsername] = useState("")
  const [changingUsername, setChangingUsername] =
    useState(false)

  // =====================================================
  // LOGOUT
  // =====================================================

  const [loggingOut, setLoggingOut] = useState(false)

  // =====================================================
  // MENSAGENS
  // =====================================================

  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // =====================================================
  // CARREGAR CONTA
  // =====================================================

  useEffect(() => {
    let mounted = true

    async function loadAccount() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (!mounted) return

        if (userError || !user) {
          router.replace("/login")
          return
        }

        setUserId(user.id)

        // O email é usado internamente apenas para
        // verificar a palavra-passe atual.
        // Nunca é mostrado na interface.
        setEmail(user.email || "")

        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .maybeSingle()

        if (profileError) {
          console.error(
            "Erro ao carregar username:",
            profileError
          )
        }

        if (profile?.username) {
          setUsername(profile.username)
          setNewUsername(profile.username)
        }

        setLoadingAccount(false)
      } catch (error) {
        console.error(
          "Erro ao carregar conta:",
          error
        )

        if (mounted) {
          setErrorMessage(
            "Não foi possível carregar os dados da conta."
          )

          setLoadingAccount(false)
        }
      }
    }

    loadAccount()

    return () => {
      mounted = false
    }
  }, [router])

  // =====================================================
  // ALTERAR USERNAME
  // =====================================================

  async function handleChangeUsername(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (changingUsername) return

    setSuccessMessage("")
    setErrorMessage("")

    const cleanUsername = newUsername.trim()

    // ---------------------------------------------------
    // VALIDAÇÕES
    // ---------------------------------------------------

    if (!cleanUsername) {
      setErrorMessage(
        "Digite o novo nome de usuário."
      )
      return
    }

    if (cleanUsername.length < 3) {
      setErrorMessage(
        "O nome de usuário deve ter pelo menos 3 caracteres."
      )
      return
    }

    if (cleanUsername.length > 30) {
      setErrorMessage(
        "O nome de usuário deve ter no máximo 30 caracteres."
      )
      return
    }

    if (cleanUsername === username) {
      setErrorMessage(
        "O novo nome de usuário é igual ao atual."
      )
      return
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(cleanUsername)) {
      setErrorMessage(
        "O nome de usuário pode conter apenas letras, números, ponto, hífen e underscore."
      )
      return
    }

    setChangingUsername(true)

    try {
      // -------------------------------------------------
      // VERIFICAR SE O USERNAME JÁ EXISTE
      // -------------------------------------------------

      const {
        data: existingUser,
        error: existingError,
      } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", cleanUsername)
        .neq("id", userId)
        .maybeSingle()

      if (existingError) {
        console.error(
          "Erro ao verificar username:",
          existingError
        )

        setErrorMessage(
          "Não foi possível verificar o nome de usuário."
        )

        setChangingUsername(false)
        return
      }

      if (existingUser) {
        setErrorMessage(
          "Este nome de usuário já está em uso."
        )

        setChangingUsername(false)
        return
      }

      // -------------------------------------------------
      // ATUALIZAR USERNAME
      // -------------------------------------------------

      const { error: updateError } =
        await supabase
          .from("profiles")
          .update({
            username: cleanUsername,
          })
          .eq("id", userId)

      if (updateError) {
        console.error(
          "Erro ao atualizar username:",
          updateError
        )

        setErrorMessage(
          updateError.message ||
            "Não foi possível alterar o nome de usuário."
        )

        setChangingUsername(false)
        return
      }

      setUsername(cleanUsername)
      setNewUsername(cleanUsername)

      setSuccessMessage(
        "Nome de usuário alterado com sucesso."
      )
    } catch (error) {
      console.error(
        "Erro inesperado ao alterar username:",
        error
      )

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao alterar o nome de usuário."
      )
    } finally {
      setChangingUsername(false)
    }
  }

  // =====================================================
  // ALTERAR PALAVRA-PASSE
  // =====================================================

  async function handleChangePassword(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (changingPassword) return

    setSuccessMessage("")
    setErrorMessage("")

    // ---------------------------------------------------
    // VALIDAÇÕES
    // ---------------------------------------------------

    if (!currentPassword) {
      setErrorMessage(
        "Digite a sua palavra-passe atual."
      )
      return
    }

    if (!newPassword) {
      setErrorMessage(
        "Digite a nova palavra-passe."
      )
      return
    }

    if (newPassword.length < 6) {
      setErrorMessage(
        "A nova palavra-passe deve ter pelo menos 6 caracteres."
      )
      return
    }

    if (!confirmPassword) {
      setErrorMessage(
        "Confirme a nova palavra-passe."
      )
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(
        "A nova palavra-passe e a confirmação não coincidem."
      )
      return
    }

    if (!email) {
      setErrorMessage(
        "Não foi possível identificar os dados de autenticação da conta."
      )
      return
    }

    setChangingPassword(true)

    try {
      // -------------------------------------------------
      // VERIFICAR PALAVRA-PASSE ATUAL
      // -------------------------------------------------

      const {
        error: verifyError,
      } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      })

      if (verifyError) {
        console.error(
          "Erro ao verificar palavra-passe:",
          verifyError
        )

        setErrorMessage(
          "A palavra-passe atual está incorreta."
        )

        setChangingPassword(false)
        return
      }

      // -------------------------------------------------
      // ATUALIZAR PALAVRA-PASSE
      // -------------------------------------------------

      const {
        error: updateError,
      } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        console.error(
          "Erro ao alterar palavra-passe:",
          updateError
        )

        setErrorMessage(
          updateError.message ||
            "Não foi possível alterar a palavra-passe."
        )

        setChangingPassword(false)
        return
      }

      // -------------------------------------------------
      // LIMPAR CAMPOS
      // -------------------------------------------------

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      setSuccessMessage(
        "Palavra-passe alterada com sucesso."
      )
    } catch (error) {
      console.error(
        "Erro inesperado ao alterar palavra-passe:",
        error
      )

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao alterar a palavra-passe."
      )
    } finally {
      setChangingPassword(false)
    }
  }

  // =====================================================
  // TERMINAR SESSÃO
  // =====================================================

  async function handleLogout() {
    if (loggingOut) return

    setLoggingOut(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const { error } =
        await supabase.auth.signOut()

      if (error) {
        console.error(
          "Erro ao terminar sessão:",
          error
        )

        setErrorMessage(
          error.message ||
            "Não foi possível terminar a sessão."
        )

        setLoggingOut(false)
        return
      }

      router.replace("/login")
      router.refresh()
    } catch (error) {
      console.error(
        "Erro inesperado ao terminar sessão:",
        error
      )

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao terminar a sessão."
      )

      setLoggingOut(false)
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loadingAccount) {
    return (
      <main className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex min-h-[400px] max-w-4xl items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />

            <p className="text-sm text-gray-500">
              A carregar segurança da conta...
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">

        {/* =================================================
            CABEÇALHO
        ================================================= */}

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-gray-700 shadow-sm">
              <Shield className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Segurança
              </h1>

              <p className="mt-1 text-sm text-gray-600">
                Gerencie as informações de acesso da sua conta.
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            SUCESSO
        ================================================= */}

        {successMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

            <p>{successMessage}</p>
          </div>
        )}

        {/* =================================================
            ERRO
        ================================================= */}

        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <p>{errorMessage}</p>
          </div>
        )}

        <div className="space-y-6">

          {/* =================================================
              ALTERAR NOME DE USUÁRIO
          ================================================= */}

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <User className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Nome de usuário
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Altere o nome de usuário utilizado para entrar na sua conta.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleChangeUsername}
              className="space-y-5"
            >

              {/* USERNAME ATUAL */}

              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Nome de usuário atual
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    id="username"
                    type="text"
                    value={username}
                    readOnly
                    className="h-12 w-full rounded-xl border border-gray-300 bg-gray-100 pl-11 pr-4 text-gray-700 outline-none"
                  />
                </div>
              </div>

              {/* NOVO USERNAME */}

              <div>
                <label
                  htmlFor="new-username"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Novo nome de usuário
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    id="new-username"
                    type="text"
                    value={newUsername}
                    onChange={(event) =>
                      setNewUsername(event.target.value)
                    }
                    autoComplete="username"
                    disabled={changingUsername}
                    placeholder="Digite o novo nome de usuário"
                    className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100"
                  />
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Use entre 3 e 30 caracteres. Pode usar letras, números, ponto, hífen e underscore.
                </p>
              </div>

              {/* BOTÃO */}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={changingUsername}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {changingUsername ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      A guardar...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Alterar nome de usuário
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* =================================================
              ALTERAR PALAVRA-PASSE
          ================================================= */}

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <Lock className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Alterar palavra-passe
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Altere a palavra-passe utilizada para entrar na sua conta.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleChangePassword}
              className="space-y-5"
            >

              {/* PALAVRA-PASSE ATUAL */}

              <div>
                <label
                  htmlFor="current-password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Palavra-passe atual
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    id="current-password"
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(event.target.value)
                    }
                    autoComplete="current-password"
                    disabled={changingPassword}
                    placeholder="Digite a palavra-passe atual"
                    className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-12 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(
                        !showCurrentPassword
                      )
                    }
                    disabled={changingPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700"
                    aria-label={
                      showCurrentPassword
                        ? "Ocultar palavra-passe"
                        : "Mostrar palavra-passe"
                    }
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* NOVA PALAVRA-PASSE */}

              <div>
                <label
                  htmlFor="new-password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Nova palavra-passe
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    id="new-password"
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(event.target.value)
                    }
                    autoComplete="new-password"
                    disabled={changingPassword}
                    placeholder="Digite a nova palavra-passe"
                    className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-12 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(
                        !showNewPassword
                      )
                    }
                    disabled={changingPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700"
                    aria-label={
                      showNewPassword
                        ? "Ocultar nova palavra-passe"
                        : "Mostrar nova palavra-passe"
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Mínimo de 6 caracteres.
                </p>
              </div>

              {/* CONFIRMAR PALAVRA-PASSE */}

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Confirmar nova palavra-passe
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    id="confirm-password"
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
                    autoComplete="new-password"
                    disabled={changingPassword}
                    placeholder="Repita a nova palavra-passe"
                    className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-12 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    disabled={changingPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700"
                    aria-label={
                      showConfirmPassword
                        ? "Ocultar confirmação"
                        : "Mostrar confirmação"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* BOTÃO */}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {changingPassword ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      A alterar...
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5" />
                      Alterar palavra-passe
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* =================================================
              TERMINAR SESSÃO
          ================================================= */}

          <section className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <LogOut className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Terminar sessão
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    Sair da conta neste dispositivo.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingOut ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    A sair...
                  </>
                ) : (
                  <>
                    <LogOut className="h-5 w-5" />
                    Terminar sessão
                  </>
                )}
              </button>
            </div>
          </section>

          {/* =================================================
              INFORMAÇÃO DA CONTA
          ================================================= */}

          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 sm:flex-row sm:items-center">

            {/* NOME DE USUÁRIO */}

            <div className="flex items-center gap-3">
              <User className="h-5 w-5 shrink-0 text-gray-400" />

              <span>
                Nome de usuário:
              </span>

              <strong className="font-semibold text-gray-900">
                {username || newUsername}
              </strong>
            </div>

            <div className="hidden text-gray-300 sm:block">
              |
            </div>

            {/* PALAVRA-PASSE */}

            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 shrink-0 text-gray-400" />

              <span>
                Palavra-passe:
              </span>

              <strong className="font-semibold tracking-widest text-gray-900">
                {showAccountPassword
                  ? "Configurada"
                  : "••••••••"}
              </strong>

              <button
                type="button"
                onClick={() =>
                  setShowAccountPassword(
                    !showAccountPassword
                  )
                }
                className="ml-1 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label={
                  showAccountPassword
                    ? "Ocultar palavra-passe"
                    : "Visualizar palavra-passe"
                }
                title={
                  showAccountPassword
                    ? "Ocultar palavra-passe"
                    : "Visualizar palavra-passe"
                }
              >
                {showAccountPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

          </div>

        </div>
      </div>
    </main>
  )
}