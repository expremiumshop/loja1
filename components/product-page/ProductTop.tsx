"use client"

import {
  Share2,
  ShieldCheck,
} from "lucide-react"

interface ProductTopProps {
  product: any
}

export default function ProductTop({
  product,
}: ProductTopProps) {
  return (
    <div className="w-full min-w-0 space-y-5">

      {/* =====================================================
          STATUS DO PRODUTO
      ===================================================== */}

      <div
        className="
          flex
          w-full
          min-w-0
          flex-wrap
          items-center
          justify-between
          gap-3
        "
      >

        {/* PRODUTO VERIFICADO */}

        <div
          className="
            flex
            min-w-0
            max-w-full
            items-center
            gap-3
            rounded-lg
            border
            border-green-200
            bg-green-50
            px-4
            py-3
          "
        >

          <ShieldCheck
            className="
              h-5
              w-5
              shrink-0
              text-green-600
            "
          />

          <div className="min-w-0 max-w-full">

            <p
              className="
                max-w-full
                break-all
                text-sm
                font-semibold
                text-green-700
              "
            >
              ✓ Produto verificado EXPREMIUM SHOP
            </p>

            <p
              className="
                max-w-full
                break-all
                text-xs
                text-gray-600
              "
            >
              Produto analisado e seguro para compra
            </p>

          </div>

        </div>

        {/* =================================================
            COMPARTILHAR
        ================================================= */}

        <button
          type="button"
          className="
            flex
            shrink-0
            items-center
            gap-2
            text-sm
            text-gray-500
            transition
            hover:text-orange-500
            active:scale-95
          "
        >
          <Share2 size={18} />

          Compartilhar
        </button>

      </div>

      {/* =====================================================
          NOME DO PRODUTO
      ===================================================== */}

      <div className="w-full min-w-0 max-w-full overflow-hidden">

        <h1
          title={product?.name || "Produto sem nome"}
          className="
            block
            w-full
            min-w-0
            max-w-full
            break-all
            overflow-hidden
            text-2xl
            font-bold
            leading-tight
            text-gray-900
            lg:text-3xl
          "
        >
          {product?.name || "Produto sem nome"}
        </h1>

      </div>

    </div>
  )
}