'use client'

import { Smartphone, Shirt, Sparkles, Gamepad2, Home } from 'lucide-react'
import Link from 'next/link'

const categories = [
  { name: 'Home', icon: Home, color: 'from-blue-500/20 to-blue-400/10' },
  { name: 'Electronics', icon: Smartphone, color: 'from-purple-500/20 to-purple-400/10' },
  { name: 'Fashion', icon: Shirt, color: 'from-pink-500/20 to-pink-400/10' },
  { name: 'Beauty', icon: Sparkles, color: 'from-rose-500/20 to-rose-400/10' },
  { name: 'Toys', icon: Gamepad2, color: 'from-amber-500/20 to-amber-400/10' },
]

export function CategoryMenu() {
  return (
    <div className="bg-white py-6 md:py-8 px-4 border-b border-border">
      <div className="max-w-7xl mx-auto">
        {/* Desktop - Horizontal centered */}
        <div className="hidden md:flex justify-center gap-8">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.name}
                href={`/${category.name.toLowerCase()}`}
                className="flex flex-col items-center gap-2 group transition-all"
              >
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}
                >
                  <Icon className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors text-center">
                  {category.name}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Mobile - Horizontal scroll */}
        <div className="md:hidden flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.name}
                href={`/${category.name.toLowerCase()}`}
                className="flex flex-col items-center gap-2 group transition-all flex-shrink-0"
              >
                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center group-active:scale-95 transition-all duration-200`}
                >
                  <Icon className="w-6 h-6 text-foreground" />
                </div>
                <span className="text-xs font-semibold text-foreground text-center whitespace-nowrap">
                  {category.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
