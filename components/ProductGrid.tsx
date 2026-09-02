"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "./ProductCard"
import { supabase } from "@/lib/supabase"

interface Product {
  id: string
  slug: string
  name: string
  description: string | null
  image: string | null
  price: number
  compare_at_price: number | null
  featured: boolean
  active: boolean
  created_at: string
}

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadProducts() {
    try {
      setError(null)

      const { data, error } = await supabase
        .from("products")
        .select(
          "id, slug, name, description, image, price, compare_at_price, featured, active, created_at"
        )
        .eq("active", true)
        // Primeiro: produtos em destaque
        .order("featured", { ascending: false })
        // Depois: mais recentes dentro de cada grupo
        .order("created_at", { ascending: false })

      console.log("========== PRODUCTGRID ==========")
      console.log("PRODUTOS:", data)
      console.log("ERRO:", error)
      console.log("================================")

      if (error) {
        console.error("Erro ao carregar produtos:", error)
        setError("Não foi possível carregar os produtos.")
        return
      }

      setProducts(data || [])
    } catch (err) {
      console.error("Erro inesperado ao carregar produtos:", err)
      setError("Não foi possível carregar os produtos.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Carregar produtos quando a loja abre
    loadProducts()

    // Escutar alterações nos produtos em tempo real
    const channel = supabase
      .channel("store-products-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        (payload) => {
          console.log("ALTERAÇÃO NOS PRODUTOS:", payload)

          // Recarregar a lista depois de qualquer alteração
          loadProducts()
        }
      )
      .subscribe((status) => {
        console.log("Realtime products:", status)
      })

    // Atualizar também quando o utilizador volta para a aba da loja
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        loadProducts()
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    )

    return () => {
      supabase.removeChannel(channel)

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      )
    }
  }, [])

  return (
    <section className="w-full bg-background px-3 py-2 sm:px-4 md:py-3">
      <div className="mx-auto max-w-[1600px]">
        {/* CABEÇALHO */}
        <div className="mb-3">
          <h2 className="mb-1 text-2xl font-bold text-foreground md:text-3xl">
            Produtos em destaque
          </h2>

          <p className="text-sm text-muted-foreground">
            Produtos selecionados especialmente para si
          </p>
        </div>

        {/* CARREGANDO */}
        {loading && (
          <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-sm text-muted-foreground">
            Carregando produtos...
          </div>
        )}

        {/* ERRO */}
        {!loading && error && (
          <div className="mb-4 rounded-2xl border border-border bg-white p-4 text-sm text-red-700">
            {error}
            <br />
            Verifique a ligação ao Supabase.
          </div>
        )}

        {/* SEM PRODUTOS */}
        {!loading && !error && products.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-sm text-muted-foreground">
            Ainda não há produtos na loja.
            <br />
            Adicione produtos no painel de administração.
          </div>
        )}

        {/* PRODUTOS */}
        {!loading && !error && products.length > 0 && (
          <div
            className="
              grid
              grid-cols-2
              gap-2
              sm:gap-3
              md:grid-cols-4
              md:gap-4
              lg:grid-cols-6
              lg:gap-4
              xl:grid-cols-8
            "
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                name={product.name}
                description={product.description}
                image={product.image}
                price={product.price}
                compare_at_price={product.compare_at_price}
                featured={product.featured}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}