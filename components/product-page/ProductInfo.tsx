"use client"

interface ProductInfoProps {
  product: any
}

export default function ProductInfo({
  product,
}: ProductInfoProps) {
  const discount = product.compare_at_price
    ? Math.round(
        ((product.compare_at_price - product.price) /
          product.compare_at_price) *
          100
      )
    : 0

  return (
    <div className="space-y-4">

      {/* =====================================================
          PREÇO
          ===================================================== */}
      <div className="rounded-xl bg-gray-50 p-4">

        <div className="flex flex-wrap items-center gap-2.5">

          {/* PREÇO ATUAL */}
          <span className="text-3xl font-bold text-red-600">
            {Number(product.price).toFixed(2)} MZN
          </span>

          {/* PREÇO ANTERIOR */}
          {product.compare_at_price && (
            <span className="text-base text-gray-400 line-through">
              {Number(product.compare_at_price).toFixed(2)} MZN
            </span>
          )}

          {/* DESCONTO */}
          {discount > 0 && (
            <span
              className="
                rounded
                bg-red-600
                px-2.5
                py-1
                text-xs
                font-semibold
                text-white
              "
            >
              -{discount}%
            </span>
          )}

        </div>

        {/* OFERTA */}
        <p className="mt-2 text-sm font-medium text-red-600">
          Oferta especial por tempo limitado
        </p>

      </div>

      {/* =====================================================
          CUPOM
          ===================================================== */}
      <div
        className="
          flex
          items-center
          justify-between
          rounded-lg
          border
          border-orange-200
          bg-orange-50
          p-3.5
        "
      >

        <div>

          <p className="text-sm font-semibold text-orange-700">
            Cupom EXPREMIUM
          </p>

          <p className="text-xs text-gray-600">
            Economize nesta compra
          </p>

        </div>

        <button
          className="
            rounded-lg
            bg-orange-500
            px-3.5
            py-1.5
            text-xs
            font-semibold
            text-white
          "
        >
          Obter
        </button>

      </div>

      {/* =====================================================
          ESTOQUE
          ===================================================== */}
      <div className="text-xs text-gray-600">

        Restam

        <span className="mx-1 font-bold text-red-600">
          {product.stock}
        </span>

        unidades disponíveis

      </div>

    </div>
  )
}