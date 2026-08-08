"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()

  const id = params.id as string

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadCategory() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setName(data.name)
      setSlug(data.slug)
      setLoading(false)
    }

    if (id) {
      loadCategory()
    }
  }, [id])


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


  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()

    setSaving(true)
    setError("")

    const { error } = await supabase
      .from("categories")
      .update({
        name,
        slug,
      })
      .eq("id", id)

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    router.push("/admin/categories")
    router.refresh()
  }


  async function handleDelete() {
    const confirmDelete = confirm(
      "Tem certeza que deseja apagar esta categoria?"
    )

    if (!confirmDelete) return


    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)


    if (error) {
      setError(error.message)
      return
    }


    router.push("/admin/categories")
    router.refresh()
  }


  if (loading) {
    return (
      <main className="p-8">
        A carregar categoria...
      </main>
    )
  }


  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl">

        <Link
          href="/admin/categories"
          className="text-blue-600 hover:underline"
        >
          ← Voltar
        </Link>


        <h1 className="mt-5 text-3xl font-bold">
          Editar Categoria
        </h1>


        <form
          onSubmit={handleUpdate}
          className="mt-6 rounded-xl bg-white p-6 shadow"
        >

          {error && (
            <div className="mb-5 rounded-lg bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}


          <div className="mb-5">
            <label className="mb-2 block font-medium">
              Nome
            </label>

            <input
              value={name}
              onChange={(e) =>
                handleNameChange(e.target.value)
              }
              className="w-full rounded-lg border p-3"
            />
          </div>


          <div className="mb-5">
            <label className="mb-2 block font-medium">
              Slug
            </label>

            <input
              value={slug}
              onChange={(e) =>
                setSlug(e.target.value)
              }
              className="w-full rounded-lg border p-3"
            />
          </div>


          <div className="flex gap-4">

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-black px-6 py-3 text-white"
            >
              {saving ? "A guardar..." : "Guardar alterações"}
            </button>


            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg bg-red-600 px-6 py-3 text-white"
            >
              Apagar
            </button>

          </div>

        </form>

      </div>
    </main>
  )
}