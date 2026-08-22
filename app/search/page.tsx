import Link from "next/link"

import { supabase } from "@/lib/supabase"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ProductCard } from "@/components/ProductCard"

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
  }>
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams

  const query = (params.q || "").trim()

  if (!query) {
    return (
      <div className="min-h-screen bg-background">
        <Header />

        <main className="mx-auto max-w-7xl px-4 py-10">
          <h1 className="text-3xl font-bold text-foreground">
            Pesquisa
          </h1>

          <p className="mt-2 text-gray-500">
            Digite um produto na barra de pesquisa.
          </p>
        </main>

        <Footer />
      </div>
    )
  }

  const searchTerm = `%${query}%`

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .or(
      `name.ilike.${searchTerm},description.ilike.${searchTerm},category.ilike.${searchTerm}`
    )
    .order("created_at", {
      ascending: false,
    })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 md:py-10">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm font-medium text-primary hover:underline"
          >
            ← Voltar para a loja
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">
            Resultados da pesquisa
          </h1>

          <p className="mt-2 text-gray-500">
            Resultados para:{" "}
            <strong className="text-gray-800">
              "{query}"
            </strong>
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            Não foi possível realizar a pesquisa.
          </div>
        )}

        {!error &&
          (!products || products.length === 0) && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Nenhum produto encontrado
              </h2>

              <p className="mt-2 text-gray-500">
                Tente pesquisar usando outro nome ou palavra-chave.
              </p>

              <Link
                href="/"
                className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 font-bold text-white hover:opacity-90"
              >
                Continuar comprando
              </Link>
            </div>
          )}

        {!error &&
          products &&
          products.length > 0 && (
            <>
              <div className="mb-5 text-sm text-gray-500">
                {products.length}{" "}
                {products.length === 1
                  ? "produto encontrado"
                  : "produtos encontrados"}
              </div>

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
            </>
          )}
      </main>

      <Footer />
    </div>
  )
}