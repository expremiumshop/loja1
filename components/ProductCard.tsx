import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  slug: string
  name: string
  image?: string | null
  price: number | string
  compare_at_price?: number | string | null
  featured?: boolean
}

export function ProductCard({ slug, name, image, price, compare_at_price, featured = false }: ProductCardProps) {
  const currentPrice = Number(price)
  const previousPrice = compare_at_price == null ? null : Number(compare_at_price)

  return (
    <Link href={`/products/${slug}`} className="group block overflow-hidden rounded-xl border bg-white transition hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image src={image?.trim() || "/placeholder.svg"} alt={name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
        {featured && <span className="absolute left-2 top-2 rounded-full bg-black px-3 py-1 text-xs text-white">Destaque</span>}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-gray-900">{name}</h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-black">{currentPrice.toFixed(2)} MZN</span>
          {previousPrice !== null && previousPrice > currentPrice && <span className="text-sm text-gray-400 line-through">{previousPrice.toFixed(2)} MZN</span>}
        </div>
      </div>
    </Link>
  )
}
