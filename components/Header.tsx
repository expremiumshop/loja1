'use client'

import { useState } from 'react'
import { Heart, Bell, User, ShoppingCart, Menu, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-40 hidden md:block bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                E
              </div>
              <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                EXPREMIUM SHOP
              </span>
            </Link>

            {/* Navigation Menu */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
                Home
              </Link>
              <Link href="/electronics" className="text-foreground hover:text-primary transition-colors font-medium">
                Electronics
              </Link>
              <Link href="/fashion" className="text-foreground hover:text-primary transition-colors font-medium">
                Fashion
              </Link>
              <Link href="/beauty" className="text-foreground hover:text-primary transition-colors font-medium">
                Beauty
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
              <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                <Heart size={24} className="text-foreground hover:text-primary" />
              </button>
              <button className="p-2 hover:bg-secondary rounded-full transition-colors relative">
                <Bell size={24} className="text-foreground hover:text-primary" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                <User size={24} className="text-foreground hover:text-primary" />
              </button>
              <button className="p-2 hover:bg-secondary rounded-full transition-colors relative bg-secondary">
                <ShoppingCart size={24} className="text-foreground" />
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 md:hidden bg-white border-b border-border shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
              E
            </div>
            <span className="text-sm font-bold text-foreground">EXPREMIUM</span>
          </Link>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-secondary rounded-full transition-colors relative">
              <Bell size={20} className="text-foreground" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-secondary rounded-full transition-colors">
              <ShoppingCart size={20} className="text-foreground" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="border-t border-border bg-white">
            <Link href="/" className="block px-4 py-3 text-foreground hover:bg-secondary transition-colors">
              Home
            </Link>
            <Link href="/electronics" className="block px-4 py-3 text-foreground hover:bg-secondary transition-colors">
              Electronics
            </Link>
            <Link href="/fashion" className="block px-4 py-3 text-foreground hover:bg-secondary transition-colors">
              Fashion
            </Link>
            <Link href="/beauty" className="block px-4 py-3 text-foreground hover:bg-secondary transition-colors">
              Beauty
            </Link>
            <Link href="/toys" className="block px-4 py-3 text-foreground hover:bg-secondary transition-colors">
              Toys
            </Link>
          </nav>
        )}
      </header>
    </>
  )
}
