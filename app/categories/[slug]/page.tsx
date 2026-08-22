import { notFound } from "next/navigation"

import { supabase } from "@/lib/supabase"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ProductCard } from "@/components/ProductCard"

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params

  // =====================================================
  // BUSCAR CATEGORIA PELO SLUG
  // =====================================================

  const {
    data: category,
    error: categoryError,
  } = await supabase
    .from("categories")
    .select("id, name, slug, active")
    .eq("slug", slug)
    .eq("active", true)
    .single()

  if (categoryError || !category) {
    notFound()
  }

  // =====================================================
  // BUSCAR PRODUTOS DA CATEGORIA
  // =====================================================
  // Aceita produtos cujo campo category esteja salvo
  // como nome OU como slug da categoria.

  const {
    data: products,
    error: productsError,
  } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .in("category", [
      category.name,
      category.slug,
    ])
    .order("created_at", {
      ascending: false,
    })

  return (
    <div className="min-h-screen bg-background">

      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 md:py-10">

        {/* =================================================
            CABEÇALHO
        ================================================= */}

        <div className="mb-8 min-w-0">

          <h1
            className="
              min-w-0
              max-w-full
              break-words
              [overflow-wrap:anywhere]
              text-3xl
              font-bold
              text-foreground
              md:text-4xl
            "
          >
            {category.name}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Produtos de {category.name}
          </p>

        </div>

        {/* =================================================
            ERRO
        ================================================= */}

        {productsError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            Não foi possível carregar os produtos desta categoria.
          </div>
        )}

        {/* =================================================
            NENHUM PRODUTO
        ================================================= */}

        {!productsError &&
          (!products || products.length === 0) && (
            <div
              className="
                rounded-xl
                border
                border-dashed
                border-gray-300
                bg-gray-50
                p-12
                text-center
                text-gray-500
              "
            >
              Nenhum produto encontrado nesta categoria.
            </div>
          )}

        {/* =================================================
            PRODUTOS
        ================================================= */}

        {!productsError &&
          products &&
          products.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">

              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  slug={product.slug}
                  name={product.name}
                  description={product.description}
                  image={product.image}
                  price={product.price}
                  compare_at_price={
                    product.compare_at_price
                  }
                  featured={product.featured}
                />
              ))}

            </div>
          )}

      </main>

      <Footer />

    </div>
  )
}