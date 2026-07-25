import { ProductCard } from './ProductCard'

const products = [
  {
    id: '1',
    name: 'Wireless Earbuds',
    price: 799,
    originalPrice: 1299,
    rating: 4.8,
    reviewCount: 234,
    image: '/products/wireless-earbuds.png',
    discount: 38,
  },
  {
    id: '2',
    name: 'Summer Dress',
    price: 1499,
    originalPrice: 1999,
    rating: 4.9,
    reviewCount: 156,
    image: '/products/summer-dress.png',
    discount: 25,
  },
  {
    id: '3',
    name: 'Portable Power Bank',
    price: 999,
    originalPrice: 1599,
    rating: 4.7,
    reviewCount: 312,
    image: '/products/power-bank.png',
    discount: 37,
  },
  {
    id: '4',
    name: 'Premium Sneakers',
    price: 2499,
    originalPrice: 3499,
    rating: 4.9,
    reviewCount: 428,
    image: '/products/premium-sneakers.png',
    discount: 28,
  },
]

export function ProductGrid() {
  return (
    <div className="bg-white py-8 md:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-balance">
            Recommendations For You
          </h2>
          <p className="text-muted-foreground">Carefully selected premium products just for you</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  )
}
