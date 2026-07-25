'use client'

import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'

export function SearchBar() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="px-4 md:px-0 py-4 md:py-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products, electronics, fashion..."
            className="w-full px-5 py-3 md:py-4 bg-secondary text-foreground rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all pl-12"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white rounded-lg p-2 md:p-3 hover:bg-primary/90 transition-all active:scale-95"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
            ) : (
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
