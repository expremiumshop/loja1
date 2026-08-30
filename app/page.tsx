import { Header } from "@/components/Header"
import BannerCarousel from "@/components/BannerCarousel"
import { ProductGrid } from "@/components/ProductGrid"
import { BenefitsSection } from "@/components/BenefitsSection"
import { TopBenefits } from "@/components/TopBenefits"
import { Footer } from "@/components/Footer"

import {
  Baby,
  ShoppingBag,
  Footprints,
  Sparkles,
  Home as HomeIcon,
  Smartphone,
  Watch,
} from "lucide-react"

/* =====================================================
   DESENHO - MODA FEMININA
   ===================================================== */

function DressIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="h-7 w-7 sm:h-8 sm:w-8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25 10C25 14 27 17 32 17C37 17 39 14 39 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M25 11L20 18L25 24L17 51H47L39 24L44 18L39 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25 24C27 26 29 27 32 27C35 27 37 26 39 24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M20 18L25 24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M44 18L39 24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* =====================================================
   DESENHO - MODA MASCULINA
   ===================================================== */

function MenswearIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="h-7 w-7 sm:h-8 sm:w-8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25 11L18 17L12 22L18 31L23 27V52H41V27L46 31L52 22L46 17L39 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25 11C25 15 28 18 32 18C36 18 39 15 39 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M32 18V52"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M27 20L32 25L37 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* =====================================================
   CATEGORIAS
   ===================================================== */

const categories = [
  {
    name: "Moda Feminina",
    icon: DressIcon,
  },
  {
    name: "Moda Masculina",
    icon: MenswearIcon,
  },
  {
    name: "Roupas Infantis",
    icon: Baby,
  },
  {
    name: "Acessórios",
    icon: ShoppingBag,
  },
  {
    name: "Calçados",
    icon: Footprints,
  },
  {
    name: "Beleza",
    icon: Sparkles,
  },
  {
    name: "Casa",
    icon: HomeIcon,
  },
  {
    name: "Eletrónica",
    icon: Smartphone,
  },
  {
    name: "Relógios",
    icon: Watch,
  },
]

/* =====================================================
   PÁGINA PRINCIPAL
   ===================================================== */

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <Header />

      {/* 1. BANNER */}
      <BannerCarousel />

      {/* 2. BENEFÍCIOS SUPERIORES */}
      <TopBenefits />

      {/* 3. CATEGORIAS */}
      <section className="w-full px-3 py-2 md:px-6 md:py-3">
        <div className="mx-auto w-full max-w-[1440px]">
          <h2 className="mb-2 text-xl font-bold text-foreground md:text-2xl">
            Categorias
          </h2>

          <div
            className="
              flex
              gap-3
              overflow-x-auto
              pb-2
              snap-x
              snap-mandatory
              scrollbar-none
              md:gap-4
            "
          >
            {categories.map((category) => {
              const Icon = category.icon

              return (
                <div
                  key={category.name}
                  className="
                    flex
                    min-w-[100px]
                    shrink-0
                    snap-start
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-border
                    bg-white
                    px-2
                    py-2.5
                    text-center
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-1
                    hover:shadow-md
                    sm:min-w-[115px]
                    sm:px-3
                    sm:py-3
                    md:min-w-[125px]
                    md:py-3.5
                  "
                >
                  {/* DESENHO DA CATEGORIA */}
                  <div
                    className="
                      mb-1.5
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      bg-muted
                      sm:h-12
                      sm:w-12
                    "
                  >
                    <Icon
                      strokeWidth={1.4}
                      className="
                        h-6
                        w-6
                        text-foreground
                        sm:h-7
                        sm:w-7
                      "
                    />
                  </div>

                  {/* NOME */}
                  <span
                    className="
                      text-[10px]
                      font-semibold
                      leading-tight
                      text-foreground
                      sm:text-[11px]
                      md:text-xs
                    "
                  >
                    {category.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. PRODUTOS */}
      <ProductGrid />

      {/* 5. ÁREA DE VENDA */}
      <section className="w-full px-3 py-6 md:px-6 md:py-10">
        <div className="mx-auto w-full max-w-[1440px]">
          <div
            className="
              relative
              min-h-[240px]
              overflow-hidden
              rounded-3xl
              border
              border-border
              bg-muted
              sm:min-h-[300px]
              md:min-h-[380px]
            "
          >
            {/* IMAGEM */}
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1800&q=85"
              alt="Compras online e vendas"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
              "
            />

            {/* CAMADA ESCURA */}
            <div
              className="
                absolute
                inset-0
                bg-black/45
              "
            />

            {/* TEXTO */}
            <div
              className="
                relative
                z-10
                flex
                min-h-[240px]
                items-center
                justify-center
                px-6
                text-center
                sm:min-h-[300px]
                md:min-h-[380px]
              "
            >
              <div className="max-w-2xl">
                <h2
                  className="
                    text-2xl
                    font-bold
                    text-white
                    sm:text-3xl
                    md:text-4xl
                  "
                >
                  Compre com segura
                </h2>

                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-lg
                    text-sm
                    text-white/90
                    md:text-base
                  "
                >
                  Encontre roupas, acessórios, beleza,
                  eletrónica, produtos para casa e muito mais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BENEFÍCIOS INFERIORES */}
      <BenefitsSection />

      {/* 7. FOOTER */}
      <Footer />
    </div>
  )
}