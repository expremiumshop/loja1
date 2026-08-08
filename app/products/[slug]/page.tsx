import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

import ProductGallery from "@/components/product-page/ProductGallery"
import ProductTop from "@/components/product-page/ProductTop"
import ProductInfo from "@/components/product-page/ProductInfo"
import ProductVariants from "@/components/product-page/ProductVariants"
import ProductActions from "@/components/product-page/ProductActions"

import ShippingCard from "@/components/product-page/ShippingCard"
import GuaranteeCard from "@/components/product-page/GuaranteeCard"
import StoreInfo from "@/components/product-page/StoreInfo"

import ProductTabs from "@/components/product-page/ProductTabs"
import RelatedProducts from "@/components/product-page/RelatedProducts"
import MobileBottomBar from "@/components/product-page/MobileBottomBar"


interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}


export default async function ProductPage({
  params,
}: ProductPageProps) {

  const { slug } = await params

  const supabase = createClient()


  // BUSCAR PRODUTO
  const {
    data: product,
    error,
  } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single()


  if (error || !product) {
    notFound()
  }



  // BUSCAR PRODUTOS RELACIONADOS
  const {
    data: related,
  } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(12)



  // BUSCAR VARIAÇÕES
  const {
    data: productOptions,
  } = await supabase
    .from("product_options")
    .select(`
      id,
      name,
      value,
      position
    `)
    .eq("product_id", product.id)
    .order("position")



  return (

    <main
      className="
        min-h-screen
        bg-[#f5f5f5]
        pb-24
      "
    >

      <div
        className="
          max-w-[1440px]
          mx-auto
          px-4
          py-8
          space-y-8
        "
      >


        <div
          className="
            bg-white
            rounded-xl
            border
            shadow-sm
            overflow-hidden
          "
        >


          <div
            className="
              grid
              grid-cols-1
              xl:grid-cols-[620px_1fr]
              gap-10
              p-6
            "
          >


            {/* GALERIA */}
            <ProductGallery
              image={product.image}
              name={product.name}
            />



            {/* INFORMAÇÕES */}
            <div className="space-y-6">


              {/* PRODUTO VERIFICADO */}
              <ProductTop
                product={product}
              />



              {/* PREÇO */}
              <ProductInfo
                product={product}
              />



              {/* VARIAÇÕES */}
              <ProductVariants
                options={productOptions || []}
              />



              {/* AÇÕES */}
              <ProductActions
                product={product}
              />



              {/* ENTREGA */}
              <ShippingCard />



              {/* GARANTIA */}
              <GuaranteeCard />



              {/* LOJA */}
              <StoreInfo />



            </div>


          </div>




          {/* ABAS */}
          <ProductTabs
            product={product}
          />



        </div>




        {/* PRODUTOS RELACIONADOS */}
        <RelatedProducts
          products={related || []}
        />




        {/* BARRA MOBILE */}
        <MobileBottomBar
          product={product}
        />


      </div>


    </main>

  )
}