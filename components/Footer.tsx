'use client'

import { Mail, Camera, Share2, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function Footer() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <footer className="bg-foreground text-white">
      {/* Desktop Footer */}
      <div className="hidden md:block border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            {/* Brand Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-lg">
                  E
                </div>
                <h3 className="text-xl font-bold">EXPREMIUM SHOP</h3>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Your premium destination for quality products, innovation and exceptional shopping experience.
              </p>
            </div>

            {/* Shop */}
            <div>
              <h4 className="font-bold mb-4 text-lg">SHOP</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/electronics" className="text-white/70 hover:text-white transition-colors text-sm">
                    Electronics
                  </Link>
                </li>
                <li>
                  <Link href="/fashion" className="text-white/70 hover:text-white transition-colors text-sm">
                    Fashion
                  </Link>
                </li>
                <li>
                  <Link href="/beauty" className="text-white/70 hover:text-white transition-colors text-sm">
                    Beauty
                  </Link>
                </li>
                <li>
                  <Link href="/toys" className="text-white/70 hover:text-white transition-colors text-sm">
                    Toys
                  </Link>
                </li>
                <li>
                  <Link href="/new" className="text-white/70 hover:text-white transition-colors text-sm">
                    New Arrivals
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-bold mb-4 text-lg">CUSTOMER SERVICE</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="text-white/70 hover:text-white transition-colors text-sm">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-white/70 hover:text-white transition-colors text-sm">
                    Shipping
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-white/70 hover:text-white transition-colors text-sm">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-white/70 hover:text-white transition-colors text-sm">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* About */}
            <div>
              <h4 className="font-bold mb-4 text-lg">ABOUT</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-white/70 hover:text-white transition-colors text-sm">
                    About EXPREMIUM SHOP
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-white/70 hover:text-white transition-colors text-sm">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-white/70 hover:text-white transition-colors text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-white/70 hover:text-white transition-colors text-sm">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="font-bold mb-4 text-lg">FOLLOW US</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Camera size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Mail size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <MessageCircle size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Share2 size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/70 text-sm">© 2026 EXPREMIUM SHOP. All rights reserved.</p>
              <div className="flex gap-4">
                <span className="text-white/50 text-xs">Payment Methods:</span>
                <div className="flex gap-2">
                  <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-xs font-bold">
                    💳
                  </div>
                  <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-xs font-bold">
                    🏦
                  </div>
                  <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-xs font-bold">
                    📱
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="md:hidden px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-lg">
              E
            </div>
            <h3 className="font-bold">EXPREMIUM SHOP</h3>
          </div>
          <p className="text-white/70 text-xs">Your premium shopping destination with quality and excellence.</p>
        </div>

        {/* Accordion Sections */}
        {[
          {
            title: 'SHOP',
            items: [
              { label: 'Electronics', href: '/electronics' },
              { label: 'Fashion', href: '/fashion' },
              { label: 'Beauty', href: '/beauty' },
              { label: 'Toys', href: '/toys' },
              { label: 'New Arrivals', href: '/new' },
            ],
          },
          {
            title: 'CUSTOMER SERVICE',
            items: [
              { label: 'Contact Us', href: '/contact' },
              { label: 'Shipping', href: '/shipping' },
              { label: 'Returns', href: '/returns' },
              { label: 'FAQ', href: '/faq' },
            ],
          },
          {
            title: 'ABOUT',
            items: [
              { label: 'About Us', href: '/about' },
              { label: 'Careers', href: '/careers' },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
            ],
          },
        ].map((section) => (
          <div key={section.title} className="border-t border-white/10">
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full py-4 flex justify-between items-center hover:bg-white/5 transition-colors"
            >
              <span className="font-semibold text-sm">{section.title}</span>
              <span className={`transition-transform ${expandedSection === section.title ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {expandedSection === section.title && (
              <div className="pb-4 space-y-2">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-white/70 text-sm pl-4 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Social & Copyright */}
        <div className="border-t border-white/10 pt-6 mt-6">
          <div className="flex gap-3 mb-4 justify-center">
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
              <Camera size={18} />
            </a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
              <Mail size={18} />
            </a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
              <MessageCircle size={18} />
            </a>
          </div>
          <p className="text-white/50 text-xs text-center">© 2026 EXPREMIUM SHOP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
