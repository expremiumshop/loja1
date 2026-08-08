"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function NewCategoryPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  function handleNameChange(value: string) {
    setName(value)
    setSlug(generateSlug(value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name) {
      setError("Digite o nome da categoria.")
      return
    }

    setLoading(true)
    setError("")

    const { error } = await supabase
      .from("categories")
      .insert([
        {
          name,
          slug,
        },
      ])

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/admin/categories")
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl">

        <div className="mb-8">
          <Link
            href="/admin/categories"
            className="text-blue-600 hover:underline"
          >
            ← Voltar para categorias
          </Link>

          <h1 className="mt-4 text-3xl font-bold">
            Nova Categoria
          </h1>

          <p className="text-gray-600">
            Adicione uma nova categoria de produtos.
          </p>
        </div>


        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-6 shadow"
        >

          {error && (
            <div className="mb-5 rounded-lg bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}


          <div className="mb-5">
            <label className="mb-2 block font-medium">
              Nome da categoria
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ex: Eletrônicos"
              className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>


          <div className="mb-5">
            <label className="mb-2 block font-medium">
              Slug
            </label>

            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ex: eletronicos"
              className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>


          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "A guardar..." : "Guardar Categoria"}
          </button>

        </form>

      </div>
    </main>
  )
}