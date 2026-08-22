"use client"

import { useState } from "react"

import ProductVariants, {
  ProductOption,
} from "@/components/product-page/ProductVariants"

import ProductActions from "@/components/product-page/ProductActions"

interface ProductPurchaseSectionProps {
  product: any
  options: ProductOption[]
}

export default function ProductPurchaseSection({
  product,
  options,
}: ProductPurchaseSectionProps) {
  const [selectedVariants, setSelectedVariants] =
    useState<Record<string, string>>({})

  return (
    <div className="space-y-5">
      {options.length > 0 && (
        <ProductVariants
          options={options}
          onChange={setSelectedVariants}
        />
      )}

      <ProductActions
        product={product}
        productOptions={options}
        selectedVariants={selectedVariants}
      />
    </div>
  )
}