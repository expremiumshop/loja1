"use client"

import {
  ShieldCheck,
  Store,
  MessageCircle,
  Package,
} from "lucide-react"

export default function StoreInfo() {
  return (
    <div
      className="
        border
        rounded-xl
        bg-white
        p-5
        space-y-5
      "
    >
      {/* =====================================================
          CABEÇALHO DA LOJA
          ===================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            min-w-0
          "
        >
          {/* ÍCONE DA LOJA */}

          <div
            className="
              w-14
              h-14
              shrink-0
              rounded-full
              bg-orange-100
              flex
              items-center
              justify-center
            "
          >
            <Store
              className="
                text-orange-600
                w-7
                h-7
              "
            />
          </div>

          {/* NOME DA LOJA */}

          <div className="min-w-0">
            <h3
              className="
                font-bold
                text-gray-900
                truncate
              "
            >
              FOCHINETI FASHION
            </h3>

            {/* LOJA VERIFICADA */}

            <div
              className="
                flex
                items-center
                gap-1
                text-green-600
                text-sm
              "
            >
              <ShieldCheck size={16} />

              <span>
                Loja verificada
              </span>
            </div>
          </div>
        </div>

        {/* VER LOJA */}

        <button
          type="button"
          className="
            shrink-0
            border
            border-orange-500
            text-orange-600
            rounded-lg
            px-4
            py-2
            text-sm
            font-semibold
            transition
            hover:bg-orange-50
          "
        >
          Ver loja
        </button>
      </div>

      {/* =====================================================
          INFORMAÇÕES DA LOJA
          ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
        "
      >
        {/* AVALIAÇÃO */}

        <div
          className="
            bg-gray-50
            rounded-lg
            p-3
          "
        >
          <p
            className="
              text-xs
              text-gray-500
            "
          >
            Avaliação da loja
          </p>

          <p
            className="
              font-bold
              text-orange-600
            "
          >
            98% positivo
          </p>
        </div>

        {/* PRODUTOS */}

        <div
          className="
            bg-gray-50
            rounded-lg
            p-3
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <Package size={18} />

            <p
              className="
                text-sm
                font-medium
              "
            >
              +500 produtos
            </p>
          </div>
        </div>

        {/* RESPOSTA */}

        <div
          className="
            bg-gray-50
            rounded-lg
            p-3
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <MessageCircle size={18} />

            <p
              className="
                text-sm
                font-medium
              "
            >
              Resposta rápida
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}