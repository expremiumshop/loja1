import { ProductCard } from "./ProductCard"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function ProductGrid() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })

  return (
    <section className="bg-white px-3 py-8 sm:px-4 md:py-10">
      <div className="mx-auto max-w-[1600px]">

        {/* CABEÇALHO */}
        <div className="mb-6">
          <h2 className="mb-1 text-2xl font-bold text-foreground md:text-3xl">
            Produtos em destaque
          </h2>

          <p className="text-sm text-muted-foreground">
            Produtos selecionados especialmente para si
          </p>
        </div>

        {/* ERRO */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            Não foi possível carregar os produtos.
            Verifique a ligação ao Supabase.
          </div>
        )}

        {/* SEM PRODUTOS */}
        {!error && !products?.length && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-sm text-gray-500">
            Ainda não há produtos na loja.
            Adicione produtos no painel de administração.
          </div>
        )}

        {/* PRODUTOS */}
        <div
          className="
            grid
            grid-cols-2
            gap-2
            sm:gap-3
            md:grid-cols-4
            md:gap-4
            lg:grid-cols-6
            xl:grid-cols-8
          "
        >
          {products?.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              name={product.name}
              image={product.image}
              price={product.price}
              compare_at_price={product.compare_at_price}
              featured={product.featured}
            />
          ))}
        </div>
      </div>
    </section>
  )
}