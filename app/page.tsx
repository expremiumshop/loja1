import { Header } from "@/components/Header"

import BannerCarousel from "@/components/BannerCarousel"

import { ProductGrid } from "@/components/ProductGrid"

import { BenefitsSection } from "@/components/BenefitsSection"

import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* =====================================================
          BANNERS
      ====================================================== */}

      <BannerCarousel />

      {/* =====================================================
          PRODUTOS
      ====================================================== */}

      <ProductGrid />

      {/* =====================================================
          BENEFÍCIOS
      ====================================================== */}

      <BenefitsSection />

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <Footer />
    </div>
  )
}