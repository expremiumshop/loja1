import { notFound } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

import ProductGallery from "@/components/product-page/ProductGallery"
import ProductTop from "@/components/product-page/ProductTop"
import ProductInfo from "@/components/product-page/ProductInfo"
import ProductPurchaseSection from "@/components/product-page/ProductPurchaseSection"
import ShippingCard from "@/components/product-page/ShippingCard"
import GuaranteeCard from "@/components/product-page/GuaranteeCard"
import StoreInfo from "@/components/product-page/StoreInfo"
import ProductTabs from "@/components/product-page/ProductTabs"
import RelatedProducts from "@/components/product-page/RelatedProducts"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params

  const supabase = await createClient()

  // ============================================================
  // PRODUTO
  // ============================================================

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

  // ============================================================
  // IMAGENS
  // ============================================================

  const {
    data: productImages,
    error: imagesError,
  } = await supabase
    .from("product_images")
    .select("id, image_url, position")
    .eq("product_id", product.id)
    .order("position", {
      ascending: true,
    })

  if (imagesError) {
    console.error(
      "Erro ao carregar imagens:",
      imagesError
    )
  }

  // ============================================================
  // GALERIA
  // ============================================================

  const galleryImages = [
    ...(product.image
      ? [
          {
            id: "main-image",
            image_url: product.image,
            position: -1,
          },
        ]
      : []),

    ...(productImages || []).filter(
      (img) => img.image_url !== product.image
    ),
  ]

  // ============================================================
  // PRODUTOS RELACIONADOS
  // ============================================================

  const { data: related } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(12)

  // ============================================================
  // OPÇÕES DO PRODUTO
  // ============================================================

  const {
    data: rawProductOptions,
    error: optionsError,
  } = await supabase
    .from("product_options")
    .select("id, name, values, position")
    .eq("product_id", product.id)
    .order("position", {
      ascending: true,
    })

  if (optionsError) {
    console.error(
      "Erro ao carregar opções:",
      optionsError
    )
  }

  // ============================================================
  // NORMALIZAR OPÇÕES
  // ============================================================

  const productOptions = (rawProductOptions || [])
    .map((option) => {
      const values = Array.isArray(option.values)
        ? option.values
            .map((value) => String(value).trim())
            .filter(Boolean)
        : []

      return {
        id: option.id,
        name: option.name || "",
        values,
        position: option.position ?? 0,
      }
    })
    .filter(
      (option) =>
        option.name.trim().length > 0 &&
        option.values.length > 0
    )

  // ============================================================
  // VARIANTES DO PRODUTO
  // ============================================================

  const {
    data: productVariants,
    error: variantsError,
  } = await supabase
    .from("product_variants")
    .select(
      "id, product_id, options, name, sku, price, stock, active, position"
    )
    .eq("product_id", product.id)
    .eq("active", true)
    .order("position", {
      ascending: true,
    })

  if (variantsError) {
    console.error(
      "Erro ao carregar variantes:",
      variantsError
    )
  }

  // ============================================================
  // DEBUG
  // ============================================================

  console.log(
    "=========================================="
  )

  console.log(
    "PRODUTO:",
    product.name
  )

  console.log(
    "PRODUCT ID:",
    product.id
  )

  console.log(
    "IMAGENS:",
    galleryImages
  )

  console.log(
    "OPÇÕES:",
    productOptions
  )

  console.log(
    "VARIANTES:",
    productVariants || []
  )

  console.log(
    "=========================================="
  )

  // ============================================================
  // PÁGINA
  // ============================================================

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="mx-auto max-w-[1440px] px-3 py-4 md:px-4 md:py-8">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="grid grid-cols-1 gap-6 p-4 md:p-6 xl:grid-cols-[620px_1fr] xl:gap-10">

            {/* ==================================================
                GALERIA
            ================================================== */}

            <ProductGallery
              images={galleryImages}
              image={product.image}
              name={product.name}
            />

            {/* ==================================================
                INFORMAÇÕES
            ================================================== */}

            <div className="min-w-0 space-y-5">

              <ProductTop
                product={product}
              />

              <ProductInfo
                product={product}
              />

              {/* ==================================================
                  COMPRA / OPÇÕES / VARIANTES
              ================================================== */}

              <ProductPurchaseSection
                product={product}
                options={productOptions}
                variants={productVariants || []}
              />

              <ShippingCard />

              <GuaranteeCard />

              <StoreInfo />

            </div>
          </div>

          {/* ====================================================
              ABAS
          ==================================================== */}

          <ProductTabs
            product={product}
          />

        </div>

        {/* ======================================================
            PRODUTOS RELACIONADOS
        ====================================================== */}

        <RelatedProducts
          products={related || []}
        />

      </div>
    </main>
  )
}