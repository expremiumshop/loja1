'use client'

import { useState } from 'react'
import { Heart, Star } from 'lucide-react'
import Image from 'next/image'

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice: number
  rating: number
  reviewCount: number
  image: string
  discount: number
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  rating,
  reviewCount,
  image,
  discount,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleAddToCart = () => {
    setIsAddingToCart(true)
    setTimeout(() => setIsAddingToCart(false), 500)
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:border-primary/20">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-secondary h-64 md:h-72">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
            {discount}% OFF
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-secondary transition-all group-hover:scale-110 active:scale-95"
        >
          <Heart
            size={20}
            className={isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-semibold text-foreground text-sm md:text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {rating} ({reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg md:text-xl font-bold text-foreground">{price} MZN</span>
          {originalPrice > price && (
            <span className="text-sm text-muted-foreground line-through">{originalPrice} MZN</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-75 text-sm md:text-base"
          disabled={isAddingToCart}
        >
          {isAddingToCart ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
