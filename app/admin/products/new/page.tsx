"use client"

import Link from "next/link"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ImagePlus, Upload, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import ProductVariantsAdmin, { ProductOptionInput } from "@/components/admin/ProductVariantsAdmin"

type Category = { id: string; name: string }

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

function errorMessage(error: unknown) {
  if (error && typeof error === "object") {
    const details = error as { message?: string; details?: string; hint?: string; code?: string }
    return [details.message, details.details, details.hint, details.code].filter(Boolean).join(" — ")
  }
  return error instanceof Error ? error.message : "Não foi possível criar o produto."
}

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [compareAtPrice, setCompareAtPrice] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [brand, setBrand] = useState("")
  const [sku, setSku] = useState("")
  const [stock, setStock] = useState("0")
  const [status, setStatus] = useState("active")
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [productOptions, setProductOptions] = useState<ProductOptionInput[]>([])

  useEffect(() => {
    supabase.from("categories").select("id, name").order("name").then(({ data, error }) => {
      if (error) setMessage(`Erro ao carregar categorias: ${error.message}`)
      else setCategories(data ?? [])
    })
  }, [])

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) return setMessage("Erro: selecione uma imagem válida.")
    if (file.size > 5 * 1024 * 1024) return setMessage("Erro: a imagem não pode ultrapassar 5 MB.")
    if (preview) URL.revokeObjectURL(preview)
    setImage(file)
    setPreview(URL.createObjectURL(file))
    setMessage("")
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const numericPrice = Number(price)
    if (!name.trim()) return setMessage("Erro: digite o nome do produto.")
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) return setMessage("Erro: digite um preço válido.")
    if (compareAtPrice && Number(compareAtPrice) <= numericPrice) return setMessage("Erro: o preço antigo deve ser superior ao preço actual.")

    setLoading(true)
    setMessage("")
    try {
      let imageUrl: string | null = null
      if (image) {
        const fileName = `${crypto.randomUUID()}-${image.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`
        const { error: uploadError } = await supabase.storage.from("products").upload(fileName, image, { upsert: false })
        if (uploadError) throw new Error(`Não foi possível enviar a imagem: ${uploadError.message}`)
        imageUrl = supabase.storage.from("products").getPublicUrl(fileName).data.publicUrl
      }

      const selectedCategory = categories.find((item) => item.id === categoryId)
      const baseSlug = slugify(name) || "produto"
      const { data: product, error } = await supabase.from("products").insert({
        name: name.trim(), slug: `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`,
        description: description.trim() || null, price: numericPrice,
        compare_at_price: compareAtPrice ? Number(compareAtPrice) : null,
        category_id: categoryId || null, category: selectedCategory?.name ?? null,
        brand: brand.trim() || null, sku: sku.trim() || null,
        stock: Math.max(0, Number.parseInt(stock || "0", 10) || 0),
        image: imageUrl, active: status === "active", featured: false,
      }).select("id").single()
      if (error) throw error

      const optionRows = productOptions
        .map((option) => ({
          product_id: product.id,
          name: option.name.trim(),
          values: option.values.map((value) => value.trim()).filter(Boolean),
        }))
        .filter((option) => option.name && option.values.length > 0)
      if (optionRows.length > 0) {
        const { error: optionsError } = await supabase.from("product_options").insert(optionRows)
        if (optionsError) throw optionsError
      }

      setMessage("Produto criado com sucesso.")
      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      setMessage(`Erro: ${errorMessage(error)}`)
    } finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen bg-gray-200 p-4 text-gray-900 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div><h1 className="text-3xl font-bold">Adicionar Produto</h1><p className="mt-2 text-gray-700">Criar novo produto para a loja</p></div>
          <Link href="/admin/products" className="rounded-lg border bg-white px-5 py-3 text-center font-semibold hover:bg-gray-100">Voltar</Link>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section className="rounded-xl bg-white p-6 shadow">
              <h2 className="mb-6 text-xl font-bold">Informações do Produto</h2>
              <label className="font-semibold">Nome do produto<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex: Smartphone Samsung" className="mt-2 w-full rounded-lg border p-3" /></label>
              <label className="mt-5 block font-semibold">Descrição<textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={6} placeholder="Descrição do produto" className="mt-2 w-full rounded-lg border p-3" /></label>
            </section>
            <section className="rounded-xl bg-white p-6 shadow">
              <h2 className="mb-6 text-xl font-bold">Imagem do Produto</h2>
              <div className="rounded-xl border-2 border-dashed bg-gray-50 p-8 text-center"><ImagePlus size={48} className="mx-auto mb-4" /><label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white"><Upload size={20} />Adicionar imagem<input type="file" accept="image/*" onChange={chooseImage} className="hidden" /></label><p className="mt-3 text-sm text-gray-500">JPG, PNG ou WebP até 5 MB.</p></div>
              {preview && <div className="relative mt-6 w-40"><img src={preview} alt="Pré-visualização" className="h-40 w-40 rounded-lg object-cover" /><button type="button" onClick={() => { URL.revokeObjectURL(preview); setPreview(""); setImage(null) }} className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white" aria-label="Remover imagem"><X size={16} /></button></div>}
            </section>
            <section className="rounded-xl bg-white p-6 shadow">
              <h2 className="mb-5 text-xl font-bold">Preço</h2>
              <div className="grid gap-5 md:grid-cols-2"><label className="font-semibold">Preço actual<input required min="0.01" step="0.01" type="number" value={price} onChange={(event) => setPrice(event.target.value)} className="mt-2 w-full rounded-lg border p-3" /></label><label className="font-semibold">Preço antigo (opcional)<input min="0" step="0.01" type="number" value={compareAtPrice} onChange={(event) => setCompareAtPrice(event.target.value)} className="mt-2 w-full rounded-lg border p-3" /></label></div>
            </section>
            <ProductVariantsAdmin options={productOptions} onChange={setProductOptions} />
          </div>
          <aside className="space-y-8">
            <section className="rounded-xl bg-white p-6 shadow"><h2 className="mb-5 text-xl font-bold">Organização</h2><label className="font-semibold">Categoria<select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="mt-2 w-full rounded-lg border p-3"><option value="">Sem categoria</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="mt-5 block font-semibold">Marca<input value={brand} onChange={(event) => setBrand(event.target.value)} className="mt-2 w-full rounded-lg border p-3" /></label></section>
            <section className="rounded-xl bg-white p-6 shadow"><h2 className="mb-5 text-xl font-bold">Inventário</h2><label className="font-semibold">SKU<input value={sku} onChange={(event) => setSku(event.target.value)} className="mt-2 w-full rounded-lg border p-3" /></label><label className="mt-5 block font-semibold">Quantidade<input min="0" type="number" value={stock} onChange={(event) => setStock(event.target.value)} className="mt-2 w-full rounded-lg border p-3" /></label></section>
            <section className="rounded-xl bg-white p-6 shadow"><h2 className="mb-5 text-xl font-bold">Estado</h2><select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full rounded-lg border p-3"><option value="active">Ativo</option><option value="draft">Rascunho</option></select></section>
            {message && <div className={`rounded-lg p-4 font-semibold ${message.startsWith("Erro") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{message}</div>}
            <button disabled={loading} className="w-full rounded-xl bg-blue-600 px-8 py-4 font-bold text-white disabled:opacity-50">{loading ? "A publicar..." : "Publicar Produto"}</button>
          </aside>
        </form>
      </div>
    </main>
  )
}
