"use client"

import { useState } from "react"
import {
  Heart,
  Bell,
  User,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* =========================
          DESKTOP HEADER
      ========================== */}
      <header className="sticky top-0 z-40 hidden md:block bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                E
              </div>

              <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                EXPREMIUM SHOP
              </span>
            </Link>

            {/* Navigation Menu */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Home
              </Link>

              <Link
                href="/electronics"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Electronics
              </Link>

              <Link
                href="/fashion"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Fashion
              </Link>

              <Link
                href="/beauty"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Beauty
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
              {/* Favoritos */}
              <Link
                href="/favorites"
                className="p-2 hover:bg-secondary rounded-full transition-colors"
                aria-label="Favoritos"
              >
                <Heart
                  size={24}
                  className="text-foreground hover:text-primary"
                />
              </Link>

              {/* Notificações */}
              <Link
                href="/notifications"
                className="p-2 hover:bg-secondary rounded-full transition-colors relative"
                aria-label="Notificações"
              >
                <Bell
                  size={24}
                  className="text-foreground hover:text-primary"
                />

                <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
              </Link>

              {/* Conta */}
              <Link
                href="/login"
                className="p-2 hover:bg-secondary rounded-full transition-colors"
                aria-label="Entrar na conta"
              >
                <User
                  size={24}
                  className="text-foreground hover:text-primary"
                />
              </Link>

              {/* Carrinho */}
              <Link
                href="/cart"
                className="p-2 hover:bg-secondary rounded-full transition-colors relative bg-secondary"
                aria-label="Carrinho"
              >
                <ShoppingCart
                  size={24}
                  className="text-foreground"
                />

                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* =========================
          MOBILE HEADER
      ========================== */}
      <header className="sticky top-0 z-40 md:hidden bg-white border-b border-border shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Menu */}
          <button
            type="button"
            onClick={() =>
              setIsMobileMenuOpen(!isMobileMenuOpen)
            }
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label={
              isMobileMenuOpen
                ? "Fechar menu"
                : "Abrir menu"
            }
          >
            {isMobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
              E
            </div>

            <span className="text-sm font-bold text-foreground">
              EXPREMIUM
            </span>
          </Link>

          {/* Mobile Actions */}
          <div className="flex items-center gap-1">
            {/* Conta */}
            <Link
              href="/login"
              className="p-2 hover:bg-secondary rounded-full transition-colors"
              aria-label="Entrar na conta"
            >
              <User
                size={20}
                className="text-foreground"
              />
            </Link>

            {/* Notificações */}
            <Link
              href="/notifications"
              className="p-2 hover:bg-secondary rounded-full transition-colors relative"
              aria-label="Notificações"
            >
              <Bell
                size={20}
                className="text-foreground"
              />

              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
            </Link>

            {/* Carrinho */}
            <Link
              href="/cart"
              className="p-2 hover:bg-secondary rounded-full transition-colors"
              aria-label="Carrinho"
            >
              <ShoppingCart
                size={20}
                className="text-foreground"
              />
            </Link>
          </div>
        </div>

        {/* =========================
            MOBILE MENU
        ========================== */}
        {isMobileMenuOpen && (
          <nav className="border-t border-border bg-white">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-foreground hover:bg-secondary transition-colors"
            >
              Home
            </Link>

            <Link
              href="/electronics"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-foreground hover:bg-secondary transition-colors"
            >
              Electronics
            </Link>

            <Link
              href="/fashion"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-foreground hover:bg-secondary transition-colors"
            >
              Fashion
            </Link>

            <Link
              href="/beauty"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-foreground hover:bg-secondary transition-colors"
            >
              Beauty
            </Link>

            <Link
              href="/toys"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-foreground hover:bg-secondary transition-colors"
            >
              Toys
            </Link>

            {/* Conta no menu mobile */}
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-secondary transition-colors border-t border-border"
            >
              <User size={20} />
              <span>Minha conta</span>
            </Link>
          </nav>
        )}
      </header>
    </>
  )
}