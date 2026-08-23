import { ProductCard } from "./ProductCard"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function ProductGrid() {
  const { data: products, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, description, image, price, compare_at_price, featured, active, created_at"
    )
    .eq("active", true)
    .order("created_at", { ascending: false })

  // DEBUG
  console.log("========== PRODUCTGRID ==========")
  console.log("PRODUTOS:", products)
  console.log("ERRO:", error)
  console.log("================================")

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

        {/* ERRO */}
        {error && (
          <div className="mb-4 rounded-2xl border border-border bg-white p-4 text-sm text-red-700">
            Não foi possível carregar os produtos.
            <br />
            Verifique a ligação ao Supabase.
          </div>
        )}

        {/* SEM PRODUTOS */}
        {!error && (!products || products.length === 0) && (
          <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-sm text-muted-foreground">
            Ainda não há produtos na loja.
            <br />
            Adicione produtos no painel de administração.
          </div>
        )}

        {/* PRODUTOS */}
        {products && products.length > 0 && (
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