import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ProductCard } from "@/components/ProductCard"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export default async function ProductsPage() {
  const { data: products, error } = await supabase.from("products").select("*").eq("active", true).order("created_at", { ascending: false })
  return <div className="min-h-screen bg-background"><Header /><main className="mx-auto max-w-7xl px-4 py-10"><div className="mb-8"><Link href="/" className="text-sm text-blue-600 hover:underline">← Voltar à loja</Link><h1 className="mt-2 text-3xl font-bold">Todos os produtos</h1></div>{error && <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">Erro ao carregar produtos: {error.message}</div>}{!error && !products?.length && <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center text-gray-500">Nenhum produto disponível.</div>}<div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">{products?.map((product) => <ProductCard key={product.id} slug={product.slug} name={product.name} image={product.image} price={product.price} compare_at_price={product.compare_at_price} featured={product.featured} />)}</div></main><Footer /></div>
}
