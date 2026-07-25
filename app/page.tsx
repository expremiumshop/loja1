import { Header } from '@/components/Header'
import { SearchBar } from '@/components/SearchBar'
import { PromotionBanner } from '@/components/PromotionBanner'
import { CategoryMenu } from '@/components/CategoryMenu'
import { ProductGrid } from '@/components/ProductGrid'
import { BenefitsSection } from '@/components/BenefitsSection'
import { Newsletter } from '@/components/Newsletter'
import { Footer } from '@/components/Footer'
import { BottomNavigation } from '@/components/BottomNavigation'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SearchBar />
      <PromotionBanner />
      <CategoryMenu />
      <ProductGrid />
      <BenefitsSection />
      <Newsletter />
      <Footer />
      <BottomNavigation />
      
      {/* Bottom padding for mobile to account for fixed bottom navigation */}
      <div className="md:hidden h-20"></div>
    </div>
  )
}
