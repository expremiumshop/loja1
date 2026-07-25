'use client'

import { Home, MessageCircle, ShoppingCart, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function BottomNavigation() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const navItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Messages', icon: MessageCircle, href: '/messages' },
    { name: 'Cart', icon: ShoppingCart, href: '/cart' },
    { name: 'Account', icon: User, href: '/account' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-3 transition-all relative ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`relative transition-all ${active ? 'scale-110' : 'scale-100'}`}
              >
                <Icon size={24} />
                {item.name === 'Cart' && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
                    0
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 font-medium ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.name}
              </span>
              {active && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
